import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./crear_sala.css";
import { API_URL } from "../../config";
import type { RoomType } from "../../App";

type CrearSalaProps = {
  token: string;
};

const CrearSala = ({ token }: CrearSalaProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<RoomType>("public");
  const [roomPassword, setRoomPassword] = useState("");
  const [roomPassword2, setRoomPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("La sala necesita un nombre.");
      return;
    }

    // Validaciones extra solo si es privada
    if (type === "private") {
      if (!roomPassword) {
        setErrorMsg("Las salas privadas necesitan una contraseña.");
        return;
      }
      if (roomPassword !== roomPassword2) {
        setErrorMsg("Las contraseñas de la sala no coinciden.");
        return;
      }
    }

    try {
      setLoading(true);

      const body: any = {
        name: name.trim(),
        type,
      };

      // Solo enviamos password si es privada
      if (type === "private") {
        body.password = roomPassword;
      }

      const res = await fetch(`${API_URL}/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
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

      // Si el backend devuelve la sala, la podrías usar.
      await res.json().catch(() => null);

      navigate("/salas");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "No se pudo crear la sala. Revisa el backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crear-sala-page">
      <header className="crear-sala-header">
        <h2>✨ Crear nueva sala</h2>
        <p>
          Este formulario hace POST a <code>/rooms</code> en la API. Para salas
          privadas se enviará una contraseña que el backend encripta.
        </p>
      </header>

      <section className="crear-sala-card">
        <div className="crear-sala-emoji">
          {type === "public" ? "🌐" : "🔒"}
        </div>

        {errorMsg && <p className="crear-sala-error">{errorMsg}</p>}

        <form className="crear-sala-form" onSubmit={handleSubmit}>
          <label className="crear-sala-label">
            Nombre de la sala
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
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
                onClick={() => {
                  setType("public");
                  setRoomPassword("");
                  setRoomPassword2("");
                  if (errorMsg) setErrorMsg(null);
                }}
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
                onClick={() => {
                  setType("private");
                  if (errorMsg) setErrorMsg(null);
                }}
              >
                🔒 Privada
              </button>
            </div>
          </div>

          {type === "private" && (
            <div className="crear-sala-private-box">
              <p className="crear-sala-private-hint">
                Esta contraseña se usará cuando alguien quiera unirse a la sala.
              </p>
              <label className="crear-sala-label">
                Contraseña de la sala
                <input
                  type="password"
                  value={roomPassword}
                  onChange={(e) => {
                    setRoomPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Define una clave para la sala"
                />
              </label>
              <label className="crear-sala-label">
                Repetir contraseña
                <input
                  type="password"
                  value={roomPassword2}
                  onChange={(e) => {
                    setRoomPassword2(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="Repite la clave de la sala"
                />
              </label>
            </div>
          )}

          <div className="crear-sala-actions">
            <button
              type="button"
              className="crear-sala-cancel"
              onClick={() => navigate("/salas")}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="crear-sala-submit"
              disabled={loading}
            >
              {loading ? "Creando…" : "Crear sala 🚀"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CrearSala;
