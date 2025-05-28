import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { SideBar } from "./components/Sidebar";
import { PrivateRoute } from "./components/PrivateRoute";

import "./index.css";

export const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white">
      <BrowserRouter>
        <Routes>
          {/* Public routes */}

          {/* Protected routes */}
          {user ? (
            <Route element={<PrivateRoute />}>
              <Route element={<SideBar />}>
              </Route>
            </Route>
          ) : (
            <Route path="*" element={<Navigate to="/login" />} />
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
