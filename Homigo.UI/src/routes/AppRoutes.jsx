import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Services from "../pages/Services";
import ServiceDetail from "../pages/ServiceDetail";
import Providers from "../pages/Providers";
import Booking from "../pages/Booking";
import Addresses from "../pages/Addresses";
import MyOrders from "../pages/MyOrders";
import ProviderOrders from "../pages/ProviderOrders";
import AdminServices from "../pages/AdminServices";
import AdminDashboard from "../pages/AdminDashboard";
import AdminCategories from "../pages/AdminCategories";

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

        <Route
          path="/providers"
          element={
            <ProtectedRoute>
              <Providers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addresses"
          element={
            <ProtectedRoute>
              <Addresses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
  path="/provider/orders"
  element={
    <ProtectedRoute>
      <ProviderOrders />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/services"
  element={
    <ProtectedRoute>
      <AdminServices />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/admin/categories"
  element={
    <ProtectedRoute>
      <AdminCategories />
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