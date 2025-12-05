// WithAuth.jsx
import { Navigate } from 'react-router-dom';
import { getToken } from './Autenticacao';

const WithAuth = (Component) => {
  const AuthRoute = () => {
    try {
      const isAuth = !!getToken();
      if (isAuth) {
        return <Component />;
      } else {
        return <Navigate to="/login" />;
      }
    } catch (err) {
      // token expirado ou inválido -> redireciona
      return <Navigate to="/login" />;
    }
  };
  return AuthRoute;
};

export default WithAuth;
