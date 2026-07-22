import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Services from "../pages/Services";
import ServiceDetail from "../pages/ServiceDetail";

function AppRoutes() {
  return (
    <MainLayout>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />

        <Route
          path="/services/:id"
          element={
            <ProtectedRoute>
              <ServiceDetail />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
      </Routes>
    </MainLayout>
  );
}

export default AppRoutes;