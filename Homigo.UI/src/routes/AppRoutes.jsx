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
import BecomeProvider from "../pages/BecomeProvider";
import AdminProviderApplications from "../pages/AdminProviderApplications";
import Categories from "../pages/Categories";
import ProviderServices from "../pages/ProviderServices";
import CreateService from "../pages/CreateService";
import EditService from "../pages/EditService";
import AdminProviders from "../pages/AdminProviders";

function AppRoutes() {
  return (
    <MainLayout>
      <Routes>

        {/* ---------- Public ---------- */}

       <Route path="/" element={<Home />} />

<Route path="/categories" element={<Categories />} />

<Route path="/services" element={<Services />} />

<Route path="/services/:id" element={<ServiceDetail />} />

<Route path="/providers" element={<Providers />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ---------- Customer ---------- */}

        <Route
          path="/booking"
          element={
            <ProtectedRoute roles={["Customer"]}>
              <Booking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/addresses"
          element={
            <ProtectedRoute roles={["Customer"]}>
              <Addresses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute roles={["Customer"]}>
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/become-provider"
          element={
            <ProtectedRoute roles={["Customer"]}>
              <BecomeProvider />
            </ProtectedRoute>
          }
        />

        {/* ---------- Provider ---------- */}

        <Route
          path="/provider/orders"
          element={
            <ProtectedRoute roles={["Provider"]}>
              <ProviderOrders />
            </ProtectedRoute>
          }
        />

        {/* ---------- Admin ---------- */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminCategories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/services"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminServices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/provider-applications"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminProviderApplications />
            </ProtectedRoute>
          }
        />
          <Route
  path="/provider/services"
  element={
    <ProtectedRoute roles={["Provider"]}>
      <ProviderServices />
    </ProtectedRoute>
  }
/>

<Route
  path="/provider/services/create"
  element={
    <ProtectedRoute roles={["Provider"]}>
      <CreateService />
    </ProtectedRoute>
  }
/>

<Route
  path="/provider/services/edit/:id"
  element={
    <ProtectedRoute roles={["Provider"]}>
      <EditService />
    </ProtectedRoute>
  }
/>

<Route
  path="/provider/orders"
  element={
    <ProtectedRoute roles={["Provider"]}>
      <ProviderOrders />
    </ProtectedRoute>
  }
  
/>
<Route
  path="/admin/providers"
  element={
    <ProtectedRoute>
      <AdminProviders />
    </ProtectedRoute>
  }
/>
      </Routes>
    </MainLayout>
  );
}

export default AppRoutes;