import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Menu from './componentes/Menu';
import MenuPublico from './componentes/MenuPublico';

import Produtores from './telas/Produtores';
import Cultivos from './telas/Cultivos';
import Safras from './telas/Safras';
import Login from './telas/Login';
import Cadastro from './seguranca/Cadastro';

import WithAuth from './seguranca/WithAuth';

import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  return <h2 className="text-center mt-4">🌾 Bem-vindo ao Sistema de Produção Agrícola</h2>;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MenuPublico />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "criar-conta", element: <Cadastro /> },
    ],
  },

  {
    path: "/privado",
    element: <Menu />,
    children: [
      {
        path: "produtores",
        element: WithAuth(Produtores)(),
      },
      {
        path: "cultivos",
        element: WithAuth(Cultivos)(),
      },
      {
        path: "safras",
        element: WithAuth(Safras)(),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
