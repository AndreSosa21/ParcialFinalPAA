import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

type User = {
  username: string;
  email: string;
};

type RegisterProps = {
  onRegister: (user: User) => void;
};

const Register: React.FC<RegisterProps> = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !email || !password || !password2) {
      alert("Completa todos los campos ✋");
      return;
    }

    if (password !== password2) {
      alert("Las contraseñas no coinciden 😅");
      return;
    }

    onRegister({ username, email });
    alert("Usuario registrado (simulado). Ahora inicia sesión.");
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <div className="auth-layout">
        <section className="auth-side auth-side-info">
          <div className="auth-badge">
            <span>🧪 Demo de cliente</span>
            <span className="auth-badge-dot" />
            <span>JWT + WebSocket</span>
          </div>
          <h2 className="auth-title">
            🆕 Crea tu usuario demo
            <br />
            para probar el sistema
          </h2>
          <p className="auth-subtitle">
            Esta UI está lista para conectarse al backend. De momento solo
            guarda el usuario en memoria para que puedas navegar por las salas.
          </p>

          <ul className="auth-list">
            <li>🧑‍💻 Usuario + email de prueba.</li>
            <li>🔑 Contraseña solo para validación visual.</li>
            <li>🧩 Luego se integrará con /auth/register real.</li>
          </ul>

          <p className="auth-footnote">
            ¿Ya tienes un usuario demo? 👉 <Link to="/login">Inicia sesión</Link>
          </p>
        </section>

        <section className="auth-side auth-side-form">
          <div className="auth-card-emoji">🧑‍💻</div>
          <h3 className="auth-form-title">Registro</h3>
          <p className="auth-form-subtitle">
            No te preocupes, es solo para este parcial. No se guarda en ningún
            servidor real.
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

            <label className="auth-label">
              Repetir contraseña
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                placeholder="••••••••"
              />
            </label>

            <button type="submit" className="auth-submit">
              Crear cuenta ✨
            </button>
          </form>

          <p className="auth-switch">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Register;
