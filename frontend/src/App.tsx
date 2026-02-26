import React from 'react';
import {
  createRouter,
  createRoute,
  createRootRoute,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ListingDetailPage from './pages/ListingDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ListingsManagementPage from './pages/ListingsManagementPage';
import OrdersDashboardPage from './pages/OrdersDashboardPage';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { Toaster } from '@/components/ui/sonner';

// Root route with public layout
const rootRoute = createRootRoute({
  component: () => (
    <AdminAuthProvider>
      <Outlet />
      <Toaster theme="dark" />
    </AdminAuthProvider>
  ),
});

// Public layout wrapper
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public-layout',
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: HomePage,
});

const listingDetailRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/listing/$id',
  component: ListingDetailPage,
});

// Admin routes (no public layout)
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminLoginPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: AdminDashboardPage,
});

const adminListingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/listings',
  component: ListingsManagementPage,
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders',
  component: OrdersDashboardPage,
});

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    homeRoute,
    listingDetailRoute,
  ]),
  adminLoginRoute,
  adminDashboardRoute,
  adminListingsRoute,
  adminOrdersRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
