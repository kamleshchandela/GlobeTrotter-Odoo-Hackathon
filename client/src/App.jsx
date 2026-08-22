import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess, logout } from "./store/authSlice";
import Loader from "./components/shared/Loader";
import { API_BASE_URL } from "./config/env";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Backdrop, CircularProgress } from '@mui/material';

/* Route modules — each owns its own lazy imports */
import {
  ProtectedRoute,
  PublicRoutes,
  DashboardRoutes,
  HealthcareRoutes,
  TripRoutes,
  DiscoverRoutes,
  SafetyRoutes,
} from "./routes";

const theme = createTheme({
  palette: {
    primary: { main: '#E8640C' }, // Saffron
    secondary: { main: '#1B4332' }, // Banyan
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
  },
});

function App() {
  const dispatch = useDispatch();
  const { token, isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !isAuthenticated) {
      const fetchUser = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (res.ok) {
            dispatch(loginSuccess({ user: data, token }));
          } else {
            dispatch(logout());
          }
        } catch (err) {
          console.error("Failed to fetch user:", err);
          dispatch(logout());
        }
      };
      fetchUser();
    }
  }, [token, isAuthenticated, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      {/* MUI Integration Example: Global Auth Loader Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(4px)' }}
        open={token && !isAuthenticated && authLoading}
      >
        <div className="flex flex-col items-center gap-4">
          <CircularProgress color="primary" />
          <span className="font-jakarta text-charcoal font-medium">Securing your session...</span>
        </div>
      </Backdrop>

      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            {PublicRoutes()}
            <Route element={<ProtectedRoute />}>
              {DashboardRoutes()}
            </Route>
            {HealthcareRoutes()}
            {TripRoutes()}
            {DiscoverRoutes()}
            {SafetyRoutes()}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
