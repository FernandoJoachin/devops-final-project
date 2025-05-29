import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Toast } from "../components/Toast";

export const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const baseRoute = import.meta.env.VITE_API_URL;

    try {
      const res = await fetch(`${baseRoute}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      const token = data.token;

      localStorage.setItem("authToken", token);

      onLogin({ email });
      showToast("¡Inicio de sesión exitoso!", "success");

      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      console.error("Login error:", err);
      showToast("Credenciales incorrectas o error de red.", "error");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-auto">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white text-black p-8 rounded-2xl shadow-lg w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-purple-800 text-center">
          Iniciar Sesión
        </h2>

        <input
          type="email"
          placeholder="Correo"
          className="w-full p-2 mb-4 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 mb-4 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800"
        >
          Entrar
        </button>

        <p className="text-sm mt-4 text-center">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
};
