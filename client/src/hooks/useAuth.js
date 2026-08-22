import { useSelector, useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction } from '../store/authSlice';
import { storage } from '../utils/storage';

/**
 * Custom hook to manage authentication state and actions.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const login = (userData, token) => {
    dispatch(loginSuccess({ user: userData, token }));
    storage.setToken(token);
    storage.setItem('user', userData);
  };

  const logout = () => {
    dispatch(logoutAction());
    storage.clearToken();
    storage.removeItem('user');
    window.location.href = '/auth/login';
  };

  const setAuthError = (message) => {
    dispatch(loginFailure(message));
  };

  const startLoading = () => {
    dispatch(loginStart());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    setAuthError,
    startLoading,
  };
};
