import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { Login } from "./auth/Login";
import { Logout } from "./auth/Logout";
import { Register } from "./auth/Register";
import { SideBar } from "./components/Sidebar"; 
import { PrivateRoute } from "./components/PrivateRoute"; 
import { AssignmentIndex } from "./pages/assignments/AssignmentIndex";
import { VehicleIndex } from "./pages/vehicles/VehicleIndex";
import { RouteIndex } from "./pages/routes/RouteIndex";
import { DriverIndex } from "./pages/drivers/DriverIndex";
import { EditAssignment } from "./pages/assignments/EditAssignment";
import { EditVehicle } from "./pages/vehicles/EditVehicles";
import { EditRoute } from "./pages/routes/EditRoute";
import { EditDriver } from "./pages/drivers/EditDriver";
import { Dashboard } from "./dashboard/Dashboard";
import { InvitationRequest } from "./pages/invitation/InvitationRequest";

import "./index.css";

export const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login onLogin={setUser} />} /> 
          {<Route path="/register" element={<Register />} />}
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

                <Route path="/invitation" element={<InvitationRequest />} />

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