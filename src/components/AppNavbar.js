import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../context/UserContext';
import '../index.css'; // Create this CSS file for animations

export default function AppNavbar() {
    const { user } = useContext(UserContext);

    return (
        <Navbar expand="lg" className="bg-light shadow-sm">
            <Container fluid className="ms-0">
                <Navbar.Brand href="#home" className="d-flex align-items-center">
                    <span className="logo-icon">📱</span>
                    <span className="logo-text ms-2">HK Mobile</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="align-items-lg-center">
                        <Nav.Link 
                            as={NavLink} 
                            to="/" 
                            exact="true"
                            className="nav-link-custom"
                        >
                            Home
                        </Nav.Link>
                        {user.id !== null && (
                            <>
                                {!user.isAdmin && (
                                    <Nav.Link 
                                        as={NavLink} 
                                        to="/products" 
                                        exact="true"
                                        className="nav-link-custom"
                                    >
                                        Products
                                    </Nav.Link>
                                )}

                                {!user.isAdmin && (
                                    <Nav.Link 
                                        as={NavLink} 
                                        to="/cart" 
                                        exact="true"
                                        className="nav-link-custom"
                                    >
                                        Cart
                                    </Nav.Link>
                                )}
                                {!user.isAdmin && (
                                    <Nav.Link 
                                        as={NavLink} 
                                        to="/order" 
                                        exact="true"
                                        className="nav-link-custom"
                                    >
                                        Orders
                                    </Nav.Link>
                                )}
                                {user.isAdmin && (
                                    <Nav.Link 
                                        as={NavLink} 
                                        to="/adminDashboard" 
                                        exact="true"
                                        className="nav-link-custom"
                                    >
                                        Dashboard
                                    </Nav.Link>
                                )}
                            </>
                        )}

                        {user.id !== null ? (
                            <Nav.Link 
                                as={NavLink} 
                                to="/logout" 
                                exact="true"
                                className="nav-link-custom logout-link"
                            >
                                Logout
                            </Nav.Link>
                        ) : (
                            <>
                                <Nav.Link 
                                    as={NavLink} 
                                    to="/register" 
                                    exact="true"
                                    className="nav-link-custom"
                                >
                                    Register
                                </Nav.Link>
                                <Nav.Link 
                                    as={NavLink} 
                                    to="/login" 
                                    exact="true"
                                    className="nav-link-custom login-link"
                                >
                                    Login
                                </Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}