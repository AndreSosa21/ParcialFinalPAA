import "./salas.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { AuthUser, RoomType } from "../../App";
import { API_URL } from "../../config";

export type Room = {
  id: number;
  name: string;
  type: RoomType;
};

type ApiRoom = {
  id: number;
  name: string;
  type?: string;
  room_type?: string;
  roomType?: string;
  is_private?: boolean;
};

type SalasProps = {
  user: AuthUser;
  token: string;
};

const Salas = ({ user, token }: SalasProps) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const fetchRooms = async () => {
      try {
        if (!isActive) return;
        setErrorMsg(null);

        const res = await fetch(`${API_URL}/rooms`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `Error ${res.status}`);
        }

        const data = (await res.json()) as ApiRoom[];

        const mapped: Room[] = data.map((r) => {
          const rawType =
            r.type ??
            r.room_type ??
            r.roomType ??
            (r.is_private !== undefined
              ? r.is_private
                ? "private"
                : "public"
              : undefined);

          const raw = (rawType ?? "").toString().toLowerCase();
          const normalized: RoomType = raw.includes("pub")
            ? "public"
            : "private";

          return {
            id: r.id,
            name: r.name,
            type: normalized,
          };
        });

        if (isActive) {
          setRooms(mapped);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isActive) {
          setErrorMsg(
            "No se pudieron cargar las salas. Revisa el backend o el token."
          );
          setLoading(false);
        }
      }
    };

    void fetchRooms();
    const intervalId = setInterval(fetchRooms, 3000); // auto refresh

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [token]);

  const handleGoToCreate = () => {
    navigate("/salas/crear");
  };

  const handleEnterRoom = (room: Room) => {
    navigate(`/salas/${room.id}`, { state: { room } });
  };

  const getEmojiForRoom = (type: RoomType) =>
    type === "public" ? "🌐" : "🔒";

  return (
    <div className="salas-page">
      <header className="salas-header">
        <div>
          <p className="salas-kicker">🗂️ Tus espacios de conversación</p>
          <h2 className="salas-title">Salas de chat</h2>
          <p className="salas-subtitle">
            Lista cargada desde el endpoint <code>/rooms</code>.
          </p>
        </div>

        <div className="salas-header-right">
          <span className="salas-user-pill">🧑‍💻 {user.username}</span>
          <button className="salas-create-button" onClick={handleGoToCreate}>
            + Crear nueva sala
          </button>
        </div>
      </header>

      {loading && <p className="salas-loading">Cargando salas…</p>}
      {errorMsg && <p className="salas-error">{errorMsg}</p>}

      <section className="salas-grid">
        {rooms.map((room) => (
          <article key={room.id} className="salas-card">
            <div className="salas-card-emoji">
              {getEmojiForRoom(room.type)}
            </div>
            <h3 className="salas-card-title">{room.name}</h3>
            <p className="salas-card-type">
              {room.type === "public" ? "Sala pública" : "Sala privada"}
            </p>

            <div className="salas-card-footer">
              <span className="salas-chip">
                {room.type === "public" ? "🌐 Acceso abierto" : "🔒 Con clave"}
              </span>
              <button
                className="salas-enter-button"
                onClick={() => handleEnterRoom(room)}
              >
                Entrar
              </button>
            </div>
          </article>
        ))}

        {!loading && rooms.length === 0 && !errorMsg && (
          <div className="salas-empty">
            <p>😴 No hay salas creadas todavía.</p>
            <p>
              Sé el primero en crear una 👉{" "}
              <button
                type="button"
                onClick={handleGoToCreate}
                style={{
                  background: "none",
                  border: "none",
                  color: "#60a5fa",
                  cursor: "pointer",
                  textDecoration: "underline",
                  padding: 0,
                  fontSize: "inherit",
                }}
              >
                Crear sala
              </button>
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Salas;
