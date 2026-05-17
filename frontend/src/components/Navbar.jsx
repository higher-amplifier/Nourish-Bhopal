import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🌿 Nourish</Link>
      <div className="navbar-links">
        <Link to="/impact">
          <button className="btn btn-outline btn-sm">Impact</button>
        </Link>
        {user ? (
          <>
            <Link to="/dashboard">
              <button className="btn btn-outline btn-sm">Dashboard</button>
            </Link>
            {user.role === 'donor' && (
              <Link to="/create">
                <button className="btn btn-primary btn-sm">+ Post Food</button>
              </Link>
            )}
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            <span className="badge badge-volunteer" style={{ marginLeft: 4 }}>{user.name.split(' ')[0]}</span>
          </>
        ) : (
          <>
            <Link to="/login"><button className="btn btn-outline btn-sm">Login</button></Link>
            <Link to="/register"><button className="btn btn-primary btn-sm">Join</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}
