import React, { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { API_URL } from "../config";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  // Reglas de contraseña (mismas que suele usar el backend)
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  // 👉 OJO: solo cuenta como símbolo uno de estos: @ $ ! % * ? &
  const hasSymbol = /[@$!%*?&]/.test(password);

  const isStrongPassword =
    hasMinLength && hasUpper && hasLower && hasNumber && hasSymbol;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username || !email || !password || !password2) {
      setErrorMsg("Completa todos los campos.");
      return;
    }

    if (password !== password2) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    if (!isStrongPassword) {
      setErrorMsg(
        "La contraseña debe tener mínimo 8 caracteres, mayúscula, minúscula, número y un símbolo (@$!%*?&)."
      );
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        let msg = `Error ${res.status}`;

        try {
          const json = JSON.parse(text);
          if (json && typeof json.message === "string") {
            msg = json.message;
          } else if (text) {
            msg = text;
          }
        } catch {
          if (text) msg = text;
        }

        throw new Error(msg);
      }

      alert("Usuario registrado correctamente. Ahora inicia sesión.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "No se pudo registrar. Intenta de nuevo."
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
            <span>🧪 Cliente web</span>
            <span className="auth-badge-dot" />
            <span>REST + JWT</span>
          </div>
          <h2 className="auth-title">
            🆕 Crea tu usuario demo
            <br />
            para probar el sistema
          </h2>
          <p className="auth-subtitle">
            El registro se hace contra <code>/auth/register</code> en{" "}
            <code>{API_URL}</code>.
          </p>

          <ul className="auth-list">
            <li>🧑‍💻 Username + email + password.</li>
            <li>✅ Validación de contraseña alineada con el backend.</li>
            <li>🔁 Luego haces login y entras a las salas.</li>
          </ul>

          <p className="auth-footnote">
            ¿Ya tienes un usuario demo? 👉 <Link to="/login">Inicia sesión</Link>
          </p>
        </section>

        <section className="auth-side auth-side-form">
          <div className="auth-card-emoji">🧑‍💻</div>
          <h3 className="auth-form-title">Registro</h3>
          <p className="auth-form-subtitle">
            No se almacena nada fuera de tu backend. Es solo para el parcial.
          </p>

          {errorMsg && <p className="auth-error">{errorMsg}</p>}

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
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Ej: Sabana2025!*"
              />
            </label>

            <ul className="password-hints">
              <li className={hasMinLength ? "ok" : "bad"}>
                {hasMinLength ? "✅" : "⚠️"} Mínimo 8 caracteres
              </li>
              <li className={hasUpper ? "ok" : "bad"}>
                {hasUpper ? "✅" : "⚠️"} Al menos una mayúscula
              </li>
              <li className={hasLower ? "ok" : "bad"}>
                {hasLower ? "✅" : "⚠️"} Al menos una minúscula
              </li>
              <li className={hasNumber ? "ok" : "bad"}>
                {hasNumber ? "✅" : "⚠️"} Al menos un número
              </li>
              <li className={hasSymbol ? "ok" : "bad"}>
                {hasSymbol ? "✅" : "⚠️"} Símbolo permitido (@$!%*?&)
              </li>
            </ul>

            <label className="auth-label">
              Repetir contraseña
              <input
                type="password"
                value={password2}
                onChange={(e) => {
                  setPassword2(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Repite la contraseña"
              />
            </label>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Crear cuenta ✨"}
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
