import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./login/login";
import Register from "./register/register";
import Salas from "./salas/salas/salas";
import CrearSala from "./salas/crear_sala/crear_sala";
import SalaVivo from "./salas/sala_vivo/sala_vivo";
import "./index.css";

export type AuthUser = {
  id?: number;
  username: string;
  email: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
};

export type RoomType = "public" | "private";

function App() {
  const [auth, setAuth] = useState<AuthState>({ user: null, token: null });

  useEffect(() => {
    const raw = localStorage.getItem("paa_chat_auth");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as AuthState;
      if (parsed?.user && parsed?.token) {
        setAuth(parsed);
      }
    } catch {
      localStorage.removeItem("paa_chat_auth");
    }
  }, []);

  const handleLoginSuccess = (data: { token: string; user: AuthUser }) => {
    const next: AuthState = { user: data.user, token: data.token };
    setAuth(next);
    localStorage.setItem("paa_chat_auth", JSON.stringify(next));
  };

  const handleLogout = () => {
    setAuth({ user: null, token: null });
    localStorage.removeItem("paa_chat_auth");
  };

  const isLoggedIn = Boolean(auth.user && auth.token);

  return (
    <div className="app-root">
      <header className="app-header">
        <Link to="/" className="app-logo">
          <span className="app-logo-emoji">💬</span>
          <span className="app-logo-text">
            PAA Chat
            <span className="app-logo-sub">Realtime rooms</span>
          </span>
        </Link>

        <nav className="app-nav">
          {isLoggedIn && auth.user ? (
            <>
              <span className="app-user-pill">🧑‍💻 {auth.user.username}</span>
              <Link to="/salas" className="app-nav-link">
                Salas
              </Link>
              <button className="app-nav-button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="app-nav-link">
                Iniciar sesión
              </Link>
              <Link to="/register" className="app-nav-pill">
                Crear cuenta
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="app-main">
        <div className="app-main-shell">
          <div className="app-main-emoji app-main-emoji-left">✨</div>
          <div className="app-main-emoji app-main-emoji-right">⚡</div>

          <div className="app-main-content">
            <Routes>
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <Navigate to="/salas" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/login"
                element={<Login onLoginSuccess={handleLoginSuccess} />}
              />

              <Route path="/register" element={<Register />} />

              <Route
                path="/salas"
                element={
                  isLoggedIn && auth.user && auth.token ? (
                    <Salas user={auth.user} token={auth.token} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/salas/crear"
                element={
                  isLoggedIn && auth.token ? (
                    <CrearSala token={auth.token} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/salas/:roomId"
                element={
                  isLoggedIn && auth.user && auth.token ? (
                    <SalaVivo
                      user={auth.user}
                      token={auth.token}
                    />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <span>💻 Parcial III · Patrones Arquitectónicos Avanzados</span>
        <span className="app-footer-tag">Chat demo · WebSockets & Broker</span>
      </footer>
    </div>
  );
}

export default App;
