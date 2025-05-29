/**
 * @file App.jsx
 * @description Componente principal de la aplicación React.
 * Este archivo define la estructura de enrutamiento de la aplicación utilizando
 * `react-router-dom`. Contiene la lógica para la autenticación básica (`user` state)
 * y renderiza rutas públicas (login, registro) y rutas protegidas (dashboard,
 * gestión de asignaciones, vehículos, conductores, rutas) que requieren que el
 * usuario esté autenticado.
 * También establece el diseño global con un fondo de gradiente.
 * @author Equipo 3
 * @version 1.0.0
 */
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
// Importación de componentes de autenticación
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import { Logout } from "./auth/Logout";
// Importación de componentes de diseño y utilidad
import { SideBar } from "./components/Sidebar"; // Barra lateral de navegación
import { PrivateRoute } from "./components/PrivateRoute"; // Componente para proteger rutas
// Importación de componentes de página (vistas principales)
import { Dashboard } from "./dashboard/Dashboard";
import { AssignmentIndex } from "./pages/assignments/AssignmentIndex";
import { VehicleIndex } from "./pages/vehicles/VehicleIndex";
import { RouteIndex } from "./pages/routes/RouteIndex";
import { DriverIndex } from "./pages/drivers/DriverIndex";
// Importación de componentes para edición/creación
import { EditAssignment } from "./pages/assignments/EditAssignment";
import { EditVehicle } from "./pages/vehicles/EditVehicle";
import { EditRoute } from "./pages/routes/EditRoute";
import { EditDriver } from "./pages/drivers/EditDriver";

import "./index.css";

export const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} /> 
          <Route path="/register" element={<Register />} /> 
          <Route path="/logout" element={<Logout />} /> 

          {user ? (
            <Route element={<PrivateRoute />}>
              <Route element={<SideBar />}>
                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/assignment" element={<AssignmentIndex />} />
                <Route path="/assignment/new" element={<EditAssignment />} /> 
                <Route path="/assignment/:id/edit" element={<EditAssignment />} /> 
                
                <Route path="/vehicle" element={<VehicleIndex />} /> 
                <Route path="/vehicle/new" element={<EditVehicle />} /> 
                <Route path="/vehicle/:id/edit" element={<EditVehicle />} /> 

                <Route path="/driver" element={<DriverIndex />} />
                <Route path="/driver/new" element={<EditDriver />} /> 
                <Route path="/driver/:id/edit" element={<EditDriver />} /> 

                <Route path="/route" element={<RouteIndex />} /> 
                <Route path="/route/new" element={<EditRoute />} /> 
                <Route path="/route/:id/edit" element={<EditRoute />} /> 
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