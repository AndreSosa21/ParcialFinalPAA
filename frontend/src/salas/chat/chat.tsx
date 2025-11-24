import { useEffect, useRef, useState} from "react";
import type { FormEvent } from "react";
import "./chat.css";
import { API_URL, WS_URL } from "../../config";

type ChatMessage = {
  id: string;
  author: "me" | "other";
  username?: string;
  content: string;
  timestamp: string; // HH:MM
};

type ChatProps = {
  roomId: number;
  roomName: string;
  username: string;
  userId: number;
  token: string;
};

const Chat = ({ roomId, roomName, username, userId, token }: ChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"connecting" | "open" | "closed">(
    "connecting"
  );
  const [notification, setNotification] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const nowTime = () =>
    new Date().toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });

  // ============================================================
  // 1. Cargar historial desde la API al entrar a la sala
  //    Soporta:  [], { messages: [] }, { data: [] }
  // ============================================================
  useEffect(() => {
    let cancelled = false;

    const loadHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/messages/${roomId}/messages`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.warn(
            "No se pudo cargar historial:",
            res.status,
            text || "<sin cuerpo>"
          );
          return;
        }

        const raw = await res.json();
        console.log("Historial bruto de API:", raw);

        let dataList: any[] = [];

        if (Array.isArray(raw)) {
          dataList = raw;
        } else if (raw && Array.isArray(raw.messages)) {
          dataList = raw.messages;
        } else if (raw && Array.isArray(raw.data)) {
          dataList = raw.data;
        } else {
          console.warn("Formato inesperado de historial:", raw);
          return;
        }

        const mapped: ChatMessage[] = dataList.map((m) => {
          const msgUserId: number | null =
            m.user_id ??
            m.userId ??
            m.user?.id ??
            m.user?.user_id ??
            null;

          const fromUserName: string =
            m.username ??
            m.user_name ??
            m.user?.username ??
            m.user?.email ??
            m.email ??
            (typeof msgUserId === "number"
              ? `Usuario #${msgUserId}`
              : "Usuario");

          const isMe = msgUserId === userId;

          const created = m.created_at ?? m.timestamp ?? m.createdAt ?? null;
          const timeStr = created
            ? new Date(created).toLocaleTimeString("es-CO", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : nowTime();

          const content: string =
            m.content ?? m.text ?? m.message ?? "";

          return {
            id: String(
              m.id ??
                `${m.room_id ?? roomId}-${msgUserId ?? ""}-${
                  created ?? Math.random()
                }`
            ),
            author: isMe ? "me" : "other",
            username: fromUserName,
            content,
            timestamp: timeStr,
          };
        });

        if (!cancelled) {
          setMessages(mapped);
        }
      } catch (err) {
        console.error("Error cargando historial:", err);
      }
    };

    void loadHistory();
    return () => {
      cancelled = true;
    };
  }, [roomId, token, userId]);

  // Toast 3s al recibir mensaje de otro
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(t);
  }, [notification]);

  // Scroll siempre al final
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  // ============================================================
  // 2. WebSocket: conectar + join_room + escuchar mensajes nuevos
  // ============================================================
  useEffect(() => {
    const url = `${WS_URL}?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(url);
    wsRef.current = ws;
    setStatus("connecting");

    ws.onopen = () => {
      setStatus("open");
      const joinMsg = { type: "join_room", room_id: roomId };
      try {
        ws.send(JSON.stringify(joinMsg));
      } catch (err) {
        console.error("Error enviando join_room:", err);
      }
    };

    ws.onerror = () => {
      console.error("WebSocket error");
      setStatus("closed");
    };

    ws.onclose = () => {
      setStatus("closed");
    };

    ws.onmessage = (event) => {
      console.log("WS RAW:", event.data);

      let data: any;
      try {
        data = JSON.parse(event.data);
      } catch {
        const content = String(event.data || "").trim();
        if (!content) return;
        setMessages((prev) => [
          ...prev,
          {
            id: `ws-${Date.now()}-${Math.random()}`,
            author: "other",
            username: "Servidor",
            content,
            timestamp: nowTime(),
          },
        ]);
        return;
      }

      if (data.type === "connected") {
        setStatus("open");
        return;
      }

      const base =
        data.message ??
        data.payload ??
        data;

      const msgRoomId =
        base.room_id ?? data.room_id ?? base.roomId ?? data.roomId;
      if (msgRoomId && Number(msgRoomId) !== roomId) {
        return;
      }

      const msgUserId: number | null =
        base.user_id ??
        base.userId ??
        base.user?.id ??
        data.user_id ??
        data.userId ??
        null;

      const fromUserName: string =
        base.username ??
        base.user_name ??
        base.user?.username ??
        base.user?.email ??
        base.email ??
        data.username ??
        data.email ??
        (typeof msgUserId === "number"
          ? `Usuario #${msgUserId}`
          : "Usuario");

      const content: string =
        base.content ?? base.text ?? base.message ?? data.content ?? "";

      if (!content) return;

      const author: "me" | "other" =
        msgUserId === userId || fromUserName === username ? "me" : "other";

      if (author === "other") {
        setNotification(`Nuevo mensaje de ${fromUserName} en "${roomName}"`);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ws-${Date.now()}-${Math.random()}`,
          author,
          username: fromUserName,
          content,
          timestamp: nowTime(),
        },
      ]);
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [roomId, roomName, token, userId, username]);

  // ============================================================
  // 3. Enviar mensaje (solo WS, sin eco local)
  // ============================================================
  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.warn("WS no conectado, no se puede enviar");
      return;
    }

    const payload = {
      type: "send_message",
      room_id: roomId,
      content: trimmed,
    };

    try {
      wsRef.current.send(JSON.stringify(payload));
    } catch (err) {
      console.error("Error sending WS message", err);
    }

    setInput("");
  };

  return (
    <div className="chat-wrapper">
      {notification && (
        <div className="chat-toast">
          <span>🔔 {notification}</span>
        </div>
      )}

      <div className="chat-header-strip">
        <div className="chat-header-left">
          <span className="chat-room-pill">💬 {roomName}</span>
          <span className="chat-user-pill">🧑‍💻 {username}</span>
        </div>
        <span
          className={`chat-status-pill chat-status-${
            status === "open"
              ? "ok"
              : status === "connecting"
              ? "pending"
              : "down"
          }`}
        >
          {status === "open"
            ? "WS conectado"
            : status === "connecting"
            ? "Conectando..."
            : "WS cerrado"}
        </span>
      </div>

      <div className="chat-messages" ref={listRef}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat-message-row ${
              m.author === "me" ? "me" : "other"
            }`}
          >
            <div className="chat-bubble-wrapper">
              {m.author === "other" && (
                <div className="chat-name-tag">
                  {m.username ?? "Usuario"}
                </div>
              )}
              <div
                className={`chat-bubble ${
                  m.author === "me" ? "chat-bubble-me" : "chat-bubble-other"
                }`}
              >
                <span>{m.content}</span>
                <span className="chat-time">{m.timestamp}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form className="chat-input-row" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Enviar ➤</button>
      </form>
    </div>
  );
};

export default Chat;
