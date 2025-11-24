import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { API_URL } from "../config";
import type { AuthUser } from "../App";

type LoginProps = {
  onLoginSuccess: (data: { token: string; user: AuthUser }) => void;
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // lo mandamos igual, el back puede usar uno u otro
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Ingresa al menos correo y contraseña.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // mandamos username por si el back lo usa, pero lo importante es email+password
        body: JSON.stringify({ email, password, username }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error ${res.status}`);
      }

      const data = (await res.json()) as {
        token: string;
        user: AuthUser;
      };

      onLoginSuccess({ token: data.token, user: data.user });
      navigate("/salas");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        "No se pudo iniciar sesión. Revisa las credenciales o que el backend esté corriendo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <section className="auth-side auth-side-info">
          <div className="auth-badge">
            <span>⚙️ Parcial III</span>
            <span className="auth-badge-dot" />
            <span>Patrones Arquitectónicos</span>
          </div>
          <h2 className="auth-title">
            👋 Bienvenido de nuevo,
            <br />
            entra a tus salas en segundos
          </h2>
          <p className="auth-subtitle">
            Usa un usuario registrado en la API
            <code> /auth/register </code> o crea uno ahora mismo.
          </p>

          <ul className="auth-list">
            <li>⚡ Login contra la API real (JWT).</li>
            <li>💬 Acceso a salas y mensajes.</li>
            <li>🔐 WebSocket autenticado con token.</li>
          </ul>

          <p className="auth-footnote">
            ¿Primera vez aquí? 👉{" "}
            <Link to="/register">Crea una cuenta demo</Link>
          </p>
        </section>

        <section className="auth-side auth-side-form">
          <div className="auth-card-emoji">💬</div>
          <h3 className="auth-form-title">Iniciar sesión</h3>
          <p className="auth-form-subtitle">
            Este formulario usa <code>/auth/login</code> del backend en
            <code> {API_URL}</code>.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label">
              Usuario (opcional)
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="tu_usuario"
              />
            </label>

            <label className="auth-label">
              Correo
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </label>

            <label className="auth-label">
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            {errorMsg && <p className="auth-error">{errorMsg}</p>}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Conectando..." : "Entrar al chat 🚀"}
            </button>
          </form>

          <p className="auth-switch">
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
