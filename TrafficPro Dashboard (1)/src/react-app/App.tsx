import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import Login from "@/react-app/pages/Login";
import Dashboards from "@/react-app/pages/Dashboards";
import CreateDashboard from "@/react-app/pages/CreateDashboard";
import Dashboard from "@/react-app/pages/Dashboard";
import PublicDashboard from "@/react-app/pages/PublicDashboard";
import ProtectedRoute from "@/react-app/components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/public/dashboard/:id" element={<PublicDashboard />} />
        <Route 
          path="/dashboards" 
          element={
            <ProtectedRoute>
              <Dashboards />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/new" 
          element={
            <ProtectedRoute>
              <CreateDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/:id" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
