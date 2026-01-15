import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearError } from "../features/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, error, loading } = useSelector((state) => state.auth);

	useEffect(() => {
		if (user) {
			navigate("/");
		}
	}, [user, navigate]);

	useEffect(() => {
		// Clear any previous errors when component mounts
		dispatch(clearError());
	}, [dispatch]);

	const submit = async (e) => {
		e.preventDefault();

		const result = await dispatch(
			loginUser({
				email: e.target.email.value,
				password: e.target.password.value,
			})
		);

		// Only navigate if login was successful
		if (loginUser.fulfilled.match(result)) {
			navigate("/");
		}
	};

	return (
		<div className="auth-container">
			<form onSubmit={submit} className="auth-form">
				<h2>Login</h2>
				{error && <p className="error-message">{error}</p>}
				<div className="form-group">
					<input name="email" type="email" placeholder="Email" required className="form-control" />
				</div>
				<div className="form-group">
					<input name="password" type="password" placeholder="Password" required className="form-control" />
				</div>
				<button disabled={loading} className="btn-primary block">
					{loading ? "Logging in..." : "Login"}
				</button>
				
				<p className="auth-link">
					Don't have an account? <Link to="/register">Register</Link>
				</p>
			</form>
		</div>
	);
}
