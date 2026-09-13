import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export function Navbar() {
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');
    const name = localStorage.getItem('name')

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
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>

                    <span className="navbar-username">Hi, {name}</span>
                    <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>

                </div>
            )}
        </nav>
    );
}