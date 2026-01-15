import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addComment } from "../features/comments/commentSlice";
import { useNavigate } from "react-router-dom";

export default function CommentForm() {
	const user = useSelector((state) => state.auth.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);

	if (!user) {
		return (
			<div style={{ 
				padding: "20px", 
				backgroundColor: "#f8f9fa", 
				borderRadius: "8px", 
				marginBottom: "20px",
				textAlign: "center"
			}}>
				<p>
					Please{" "}
					<button 
						onClick={() => navigate("/login")}
						style={{ 
							background: "none", 
							border: "none", 
							color: "#007bff", 
							textDecoration: "underline",
							cursor: "pointer",
							font: "inherit"
						}}
					>
						login
					</button>{" "}
					to post a comment.
				</p>
			</div>
		);
	}

	const submit = async (e) => {
		e.preventDefault();

		if (!content.trim()) return;

		setLoading(true);
		try {
			await dispatch(addComment({ content })).unwrap();
			setContent("");
		} catch (err) {
			alert(err.message || "Failed to post comment");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={submit} style={{ marginBottom: "20px" }}>
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Write a comment..."
				style={{ 
					width: "100%", 
					minHeight: "100px", 
					padding: "12px",
					borderRadius: "8px",
					border: "1px solid #ddd",
					fontSize: "14px",
					resize: "vertical"
				}}
			/>
			<button 
				disabled={loading || !content.trim()}
				style={{ 
					marginTop: "10px",
					padding: "10px 20px",
					backgroundColor: "#007bff",
					color: "#fff",
					border: "none",
					borderRadius: "4px",
					cursor: loading ? "not-allowed" : "pointer",
					opacity: loading || !content.trim() ? 0.6 : 1
				}}
			>
				{loading ? "Posting..." : "Post Comment"}
			</button>
		</form>
	);
}
