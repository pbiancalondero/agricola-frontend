import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, Outlet } from 'react-router-dom';

function MenuPublico() {
    return (
        <>
            <Navbar expand="lg" bg="success" variant="dark">
                <Container>
                    <NavLink className="navbar-brand text-white" to="/">
                        🌾 Produção Agrícola
                    </NavLink>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />

                    <Navbar.Collapse className="justify-content-end">
                        <NavLink className="nav-link text-white" to="/login">
                            Login
                        </NavLink>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Outlet />
        </>
    );
}
export default MenuPublico;
