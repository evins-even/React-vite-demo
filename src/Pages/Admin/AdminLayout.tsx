import { Outlet, useLocation, Navigate } from 'react-router-dom';
import './style/AdminLayout.less';
import { useLogin } from './Login/hooks/useLogin';
import FullLoading from '../../common/components/FullLoading';
import { useAuth } from '../../common/hooks/useAuth';

function AdminLayout() {
  const { isAuthenticated, checking } = useAuth();
  const location = useLocation();

  if (checking) return <FullLoading />;

  // 如果访问 /admin，重定向到登录页或首页
  if (location.pathname === '/admin') {
    return <Navigate to={isAuthenticated ? '/admin/dashboard' : '/admin/login'} replace />;
  }

  // 如果不是登录页且未登录，重定向到登录页
  if (!isAuthenticated && location.pathname !== '/admin/login') {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="AdminLayout">
      <Outlet />
    </div>
  );
}
export default AdminLayout;