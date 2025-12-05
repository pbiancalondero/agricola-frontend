import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { getUsuario, logout, isAdmin } from '../seguranca/Autenticacao';

function Menu() {
  const usuario = getUsuario();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <Navbar bg="success" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">🌾 Produção Agrícola</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/privado/produtores">Produtores</Nav.Link>
              <Nav.Link as={Link} to="/privado/cultivos">Cultivos</Nav.Link>
              <Nav.Link as={Link} to="/privado/safras">Safras</Nav.Link>
            </Nav>

            {usuario ? (
              <>
                <div className="text-white me-3">
                  {usuario.nome || usuario.email} {isAdmin() && <small className="ms-2"> (Admin)</small>}
                </div>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button as={Link} to="/login" variant="outline-light">Login</Button>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 👇 AQUI AS TELAS PRIVADAS VÃO APARECER */}
      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
}

export default Menu;
