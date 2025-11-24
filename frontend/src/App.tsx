import { useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./login/login";
import Register from "./register/register";
import Salas from "./salas/salas/salas";
import CrearSala from "./salas/crear_sala/crear_sala";
import SalaVivo from "./salas/sala_vivo/sala_vivo";
import "./index.css";

type User = {
  username: string;
  email: string;
};

type RoomType = "public" | "private";

export type Room = {
  id: number;
  name: string;
  type: RoomType;
};

const initialRooms: Room[] = [
  { id: 1, name: "General 💬", type: "public" },
  { id: 2, name: "Privada PAA 🔐", type: "private" },
];

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleRegister = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleCreateRoom = (roomData: { name: string; type: RoomType }) => {
    const nextId = rooms.length ? Math.max(...rooms.map((r) => r.id)) + 1 : 1;
    const newRoom: Room = {
      id: nextId,
      name: roomData.name,
      type: roomData.type,
    };
    setRooms((prev) => [...prev, newRoom]);
  };

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
          {user ? (
            <>
              <span className="app-user-pill">🧑‍💻 {user.username}</span>
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
                  user ? (
                    <Navigate to="/salas" replace />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route
                path="/register"
                element={<Register onRegister={handleRegister} />}
              />

              <Route
                path="/salas"
                element={
                  user ? (
                    <Salas user={user} rooms={rooms} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/salas/crear"
                element={
                  user ? (
                    <CrearSala onCreateRoom={handleCreateRoom} />
                  ) : (
                    <Navigate to="/login" replace />
                  )
                }
              />

              <Route
                path="/salas/:roomId"
                element={
                  user ? (
                    <SalaVivo user={user} rooms={rooms} />
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
