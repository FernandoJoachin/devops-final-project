import { useState } from "react";
import { Toast } from "../../components/Toast";
import { FiGift } from "react-icons/fi";

const baseRoute = import.meta.env.VITE_API_URL;

export const InvitationRequest = () => {
  const [code, setCode] = useState(null);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchInvitationCode = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseRoute}/api/auth/invitations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      if (!res.ok) throw new Error("The code could not be obtained.");

      const data = await res.json();
      setCode(data.code || "Code not available.");
      showToast("¡Code obtained successfully!", "success");
    } catch (err) {
      showToast(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-white to-purple-200 p-4">
      {toast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-auto">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}

      <div className="bg-white max-w-md w-full p-6 rounded-2xl shadow-lg flex flex-col items-center gap-6">
        <FiGift className="text-purple-600 text-5xl" />
        <h2 className="text-2xl font-semibold text-gray-800">Request your invitation code</h2>

        <button
          onClick={fetchInvitationCode}
          disabled={loading}
          className="bg-purple-700 text-white px-6 py-2 rounded-full shadow-md hover:bg-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Requesting..." : "Get code"}
        </button>

        {code && (
          <div className="w-full text-center bg-purple-50 border border-purple-200 rounded-xl p-4 font-mono text-purple-800 shadow-sm">
            <p className="text-sm mb-1">Your invitation code is:</p>
            <p className="text-xl font-bold tracking-wide">{code}</p>
          </div>
        )}
      </div>
    </div>
  );
};
