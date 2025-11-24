import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./crear_sala.css";
import type { Room } from "../../App";

type RoomType = Room["type"];

type CrearSalaProps = {
  onCreateRoom: (room: { name: string; type: RoomType }) => void;
};

const CrearSala = ({ onCreateRoom }: CrearSalaProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<RoomType>("public");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("La sala necesita un nombre ✋");
      return;
    }

    onCreateRoom({ name: name.trim(), type });
    navigate("/salas");
  };

  return (
    <div className="crear-sala-page">
      <header className="crear-sala-header">
        <h2>✨ Crear nueva sala</h2>
        <p>
          Define un nombre y el tipo de sala. Más adelante esto se conectará al
          endpoint <code>/rooms</code> real.
        </p>
      </header>

      <section className="crear-sala-card">
        <div className="crear-sala-emoji">🏗️</div>

        <form className="crear-sala-form" onSubmit={handleSubmit}>
          <label className="crear-sala-label">
            Nombre de la sala
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="General, Proyecto PAA, etc."
            />
          </label>

          <div className="crear-sala-label">
            Tipo de sala
            <div className="crear-sala-toggle">
              <button
                type="button"
                className={
                  type === "public"
                    ? "crear-sala-toggle-btn is-active"
                    : "crear-sala-toggle-btn"
                }
                onClick={() => setType("public")}
              >
                🌐 Pública
              </button>
              <button
                type="button"
                className={
                  type === "private"
                    ? "crear-sala-toggle-btn is-active"
                    : "crear-sala-toggle-btn"
                }
                onClick={() => setType("private")}
              >
                🔒 Privada
              </button>
            </div>
          </div>

          <div className="crear-sala-actions">
            <button
              type="button"
              className="crear-sala-cancel"
              onClick={() => navigate("/salas")}
            >
              Cancelar
            </button>
            <button type="submit" className="crear-sala-submit">
              Crear sala 🚀
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CrearSala;
