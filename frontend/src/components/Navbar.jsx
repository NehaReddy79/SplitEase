import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    function handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    }

    return (
        <nav className="app-navbar">
            <Link to={isLoggedIn ? "/dashboard" : "/login"} className="navbar-logo">
                <span>SplitEase</span>
            </Link>
            {isLoggedIn && (
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            )}
        </nav>
    );
}