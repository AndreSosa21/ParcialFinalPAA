import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

type User = {
  username: string;
  email: string;
};

type LoginProps = {
  onLogin: (user: User) => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !email || !password) {
      alert("Completa todos los campos ✋");
      return;
    }

    onLogin({ username, email });
    navigate("/salas");
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
            Usa un usuario de prueba y juega con las salas públicas y privadas.
            Más adelante este login hablará con tu API real.
          </p>

          <ul className="auth-list">
            <li>⚡ Mensajes en tiempo real via WebSocket.</li>
            <li>💾 Mensajes persistidos en la base de datos.</li>
            <li>🔐 Salas públicas y privadas con control de acceso.</li>
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
            Ingresa cualquier usuario de prueba para entrar al sistema.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label">
              Usuario
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
              />
            </label>

            <label className="auth-label">
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </label>

            <button type="submit" className="auth-submit">
              Entrar al chat 🚀
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
