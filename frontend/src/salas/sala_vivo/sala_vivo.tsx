import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import "./sala_vivo.css";
import type { AuthUser, RoomType } from "../../App";
import { API_URL } from "../../config";
import Chat from "../chat/chat";

type Room = {
  id: number;
  name: string;
  type: RoomType;
};

type SalaVivoProps = {
  user: AuthUser;
  token: string;
};

const SalaVivo = ({ user, token }: SalaVivoProps) => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const roomFromState = (location.state as { room?: Room } | null)?.room;
  const id = Number(roomId);

  const room: Room | null =
    roomFromState && !Number.isNaN(id)
      ? roomFromState
      : roomId
      ? { id, name: `Sala #${id}`, type: "public" }
      : null;

  const [hasJoined, setHasJoined] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [password, setPassword] = useState("");

  // Auto-join solo para salas públicas
  useEffect(() => {
    if (!room) return;
    if (room.type !== "public") return;
    if (Number.isNaN(room.id)) return;

    const joinPublic = async () => {
      try {
        setIsJoining(true);
        setJoinError(null);

        await fetch(`${API_URL}/rooms/${room.id}/join`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ password: "" }),
        });

        setHasJoined(true);
      } catch (error) {
        console.error("Error al unirse automáticamente a la sala:", error);
        setJoinError(
          "No se pudo unir automáticamente a la sala pública. Revisa el backend."
        );
      } finally {
        setIsJoining(false);
      }
    };

    void joinPublic();
  }, [room?.id, room?.type, token]);

  const handleJoinPrivate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!room) return;
    if (!password) {
      setJoinError("Ingresa la contraseña de la sala.");
      return;
    }

    try {
      setIsJoining(true);
      setJoinError(null);

      const res = await fetch(`${API_URL}/rooms/${room.id}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const text = await res.text();
        let msg = `Error ${res.status}`;
        try {
          const json = JSON.parse(text);
          if (json?.message) msg = json.message;
        } catch {
          if (text) msg = text;
        }
        throw new Error(msg);
      }

      setHasJoined(true);
    } catch (err) {
      console.error(err);
      setJoinError(
        err instanceof Error
          ? err.message
          : "No se pudo unir a la sala privada."
      );
    } finally {
      setIsJoining(false);
    }
  };

  if (!room) {
    return (
      <div className="sala-vivo-page">
        <div className="sala-vivo-not-found">
          <p>❌ Sala no encontrada.</p>
          <button onClick={() => navigate("/salas")}>Volver a salas</button>
        </div>
      </div>
    );
  }

  const isPrivate = room.type === "private";

  return (
    <div className="sala-vivo-page">
      <header className="sala-vivo-header">
        <div>
          <p className="sala-vivo-kicker">🛎️ Sala activa</p>
          <h2 className="sala-vivo-title">{room.name}</h2>
          <p className="sala-vivo-subtitle">
            Tipo: {isPrivate ? "Privada 🔒" : "Pública 🌐"}
          </p>
        </div>

        <div className="sala-vivo-right">
          <span className="sala-vivo-user">🧑‍💻 {user.username}</span>
          <button
            className="sala-vivo-back"
            onClick={() => navigate("/salas")}
          >
            ← Volver a salas
          </button>
        </div>
      </header>

      {isPrivate && !hasJoined && (
        <section className="sala-vivo-join-card">
          <h3>🔒 Esta sala es privada</h3>
          <p>Ingresa la contraseña definida al crear la sala para unirte.</p>

          {joinError && <p className="sala-vivo-error">{joinError}</p>}

          <form onSubmit={handleJoinPrivate} className="sala-vivo-join-form">
            <label>
              Contraseña de la sala
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (joinError) setJoinError(null);
                }}
                placeholder="••••••••"
              />
            </label>
            <button type="submit" disabled={isJoining}>
              {isJoining ? "Uniéndose..." : "Unirse a la sala"}
            </button>
          </form>
        </section>
      )}

      {!isPrivate && joinError && (
        <p className="sala-vivo-error">{joinError}</p>
      )}

      {hasJoined && (
        <Chat
          roomId={room.id}
          roomName={room.name}
          username={user.username}
          userId={user.id ?? -1}
          token={token}
        />
      )}
    </div>
  );
};

export default SalaVivo;
