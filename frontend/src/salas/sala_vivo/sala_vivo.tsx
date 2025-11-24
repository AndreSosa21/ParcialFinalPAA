import { useParams, useNavigate } from "react-router-dom";
import "./sala_vivo.css";
import type { Room } from "../../App";
import Chat from "../chat/chat";

type User = {
  username: string;
  email: string;
};

type SalaVivoProps = {
  user: User;
  rooms: Room[];
};

const SalaVivo = ({ user, rooms }: SalaVivoProps) => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  const id = Number(roomId);
  const room = rooms.find((r) => r.id === id);

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

  return (
    <div className="sala-vivo-page">
      <header className="sala-vivo-header">
        <div>
          <p className="sala-vivo-kicker">🛎️ Sala activa</p>
          <h2 className="sala-vivo-title">{room.name}</h2>
          <p className="sala-vivo-subtitle">
            Tipo: {room.type === "public" ? "Pública 🌐" : "Privada 🔒"}
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

      <Chat roomName={room.name} username={user.username} />
    </div>
  );
};

export default SalaVivo;
