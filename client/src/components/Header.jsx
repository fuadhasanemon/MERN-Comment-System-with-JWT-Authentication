import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Header() {
	const user = useSelector((state) => state.auth.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logout());
		navigate("/login");
	};

	return (
		<header className="app-header">
			<div className="container">
				<Link to="/" className="brand">TechZu Comments</Link>

				<nav className="nav-links">
					{!user ? (
						<>
							<Link to="/login" className="nav-item">Login</Link>
							<Link to="/register" className="nav-item">Register</Link>
						</>
					) : (
						<div className="user-info">
							<span className="username">Hi, {user.username}</span>
							<button onClick={handleLogout} className="btn-logout">Logout</button>
						</div>
					)}
				</nav>
			</div>
		</header>
	);
}
