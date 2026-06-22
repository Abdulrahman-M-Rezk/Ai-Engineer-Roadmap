import { Navigate } from 'react-router';
import { useApp } from '../context/AppContext';

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
