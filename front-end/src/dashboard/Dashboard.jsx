import { useEffect, useState } from "react";
import { Card } from "../components/Card";

export const Dashboard = () => {
  const [data, setData] = useState({
    users: 0,
    vehicles: 0,
    drivers: 0,
    routesToday: 0,
  });

  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard/metrics`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard data.");
      }

      const result = await response.json();

      setData({
        users: result.users || 0,
        vehicles: result.vehicles || 0,
        drivers: result.drivers || 0,
        routesToday: result.routesToday || 0,
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setError("Failed to load dashboard data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-300">Dashboard</h1>

      {error ? (
        <div className="bg-red-600 text-white p-4 rounded mb-4">
          {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Users created" value={data.users} />
          <Card title="Trips today" value={data.routesToday} />
          <Card title="Vehicles created" value={data.vehicles} />
          <Card title="Drivers created" value={data.drivers} />
        </div>
      )}
    </div>
  );
};