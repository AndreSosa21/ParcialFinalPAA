import "./salas.css";
import { useNavigate, Link } from "react-router-dom";
import type { Room } from "../../App";

type User = {
  username: string;
  email: string;
};

type SalasProps = {
  user: User;
  rooms: Room[];
};

const Salas = ({ user, rooms }: SalasProps) => {
  const navigate = useNavigate();

  const handleGoToCreate = () => {
    navigate("/salas/crear");
  };

  const handleEnterRoom = (id: number) => {
    navigate(`/salas/${id}`);
  };

  const getEmojiForRoom = (type: Room["type"]) =>
    type === "public" ? "🌐" : "🔒";

  return (
    <div className="salas-page">
      <header className="salas-header">
        <div>
          <p className="salas-kicker">🗂️ Tus espacios de conversación</p>
          <h2 className="salas-title">Salas de chat</h2>
          <p className="salas-subtitle">
            Elige una sala, entra y empieza a chatear en tiempo real.
          </p>
        </div>

        <div className="salas-header-right">
          <span className="salas-user-pill">🧑‍💻 {user.username}</span>
          <button className="salas-create-button" onClick={handleGoToCreate}>
            + Crear nueva sala
          </button>
        </div>
      </header>

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
              <span className="salas-chip">💬 Historial listo</span>
              <button
                className="salas-enter-button"
                onClick={() => handleEnterRoom(room.id)}
              >
                Entrar
              </button>
            </div>
          </article>
        ))}

        {rooms.length === 0 && (
          <div className="salas-empty">
            <p>😴 No hay salas creadas todavía.</p>
            <p>
              Sé el primero en crear una 👉{" "}
              <Link to="/salas/crear">Crear sala</Link>
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Salas;
