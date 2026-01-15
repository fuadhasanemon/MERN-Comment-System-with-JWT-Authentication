import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";

export default function Register() {
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
			registerUser({
				username: e.target.username.value,
				email: e.target.email.value,
				password: e.target.password.value,
			})
		);

		// Only navigate if registration was successful
		if (registerUser.fulfilled.match(result)) {
			navigate("/");
		}
	};

	return (
		<div className="auth-container">
			<form onSubmit={submit} className="auth-form">
				<h2>Register</h2>
				{error && <p className="error-message">{error}</p>}
				<div className="form-group">
					<input name="username" placeholder="Username" required className="form-control" />
				</div>
				<div className="form-group">
					<input name="email" type="email" placeholder="Email" required className="form-control" />
				</div>
				<div className="form-group">
					<input name="password" type="password" placeholder="Password" required className="form-control" />
				</div>
				<button disabled={loading} className="btn-primary block">
					{loading ? "Registering..." : "Register"}
				</button>

				<p className="auth-link">
					Already have an account? <Link to="/login">Login</Link>
				</p>
			</form>
		</div>
	);
}
