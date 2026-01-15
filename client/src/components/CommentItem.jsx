import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	like,
	dislike,
	editComment,
	deleteComment,
	addComment,
	getReplies,
	addReplyToState,
} from "../features/comments/commentSlice";

export default function CommentItem({ comment, depth = 0 }) {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.auth.user);
	const replies = useSelector((state) => state.comments.replies[comment._id] || []);

	const [isEditing, setIsEditing] = useState(false);
	const [editContent, setEditContent] = useState(comment.content);
	const [isReplying, setIsReplying] = useState(false);
	const [replyContent, setReplyContent] = useState("");
	const [showReplies, setShowReplies] = useState(false);

	const isAuthor = user && comment.author && user._id === comment.author._id;

	const handleLike = () => {
		if (!user) return alert("Please login to like");
		dispatch(like(comment._id));
	};

	const handleDislike = () => {
		if (!user) return alert("Please login to dislike");
		dispatch(dislike(comment._id));
	};

	const handleEdit = () => {
		if (!editContent.trim()) return;
		dispatch(editComment({ id: comment._id, content: editContent }));
		setIsEditing(false);
	};

	const handleDelete = () => {
		if (window.confirm("Are you sure you want to delete this comment?")) {
			dispatch(deleteComment(comment._id));
		}
	};

	const handleReply = () => {
		if (!replyContent.trim()) return;
		dispatch(addComment({ content: replyContent, parentComment: comment._id }))
			.unwrap()
			.then((newReply) => {
				dispatch(addReplyToState({ parentId: comment._id, reply: newReply }));
				setReplyContent("");
				setIsReplying(false);
				setShowReplies(true);
			});
	};

	const toggleReplies = () => {
		if (!showReplies && replies.length === 0) {
			dispatch(getReplies(comment._id));
		}
		setShowReplies(!showReplies);
	};

	const hasLiked = user && comment.likes?.includes(user._id);
	const hasDisliked = user && comment.dislikes?.includes(user._id);

	return (
		<div className={`comment-item ${depth > 0 ? "reply" : ""}`} style={{ marginLeft: depth * 20 + "px" }}>
			<div className="comment-header">
				<strong>{comment.author?.username || "Unknown"}</strong>
				<small>{new Date(comment.createdAt).toLocaleDateString()}</small>
			</div>

			{isEditing ? (
				<div className="edit-form">
					<textarea
						value={editContent}
						onChange={(e) => setEditContent(e.target.value)}
						className="form-control"
					/>
					<div className="actions">
						<button className="btn-primary" onClick={handleEdit}>Save</button>
						<button className="btn-secondary" onClick={() => setIsEditing(false)}>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<p className="comment-content">{comment.content}</p>
			)}

			<div className="comment-actions">
				<button
					className={`btn-action ${hasLiked ? "active-like" : ""}`}
					onClick={handleLike}
				>
					👍 {comment.likes?.length || 0}
				</button>

				<button
					className={`btn-action ${hasDisliked ? "active-dislike" : ""}`}
					onClick={handleDislike}
				>
					👎 {comment.dislikes?.length || 0}
				</button>

				{user && (
					<button className="btn-action" onClick={() => setIsReplying(!isReplying)}>
						💬 Reply
					</button>
				)}

				{isAuthor && !isEditing && (
					<>
						<button className="btn-action edit" onClick={() => setIsEditing(true)}>
							✏️ Edit
						</button>
						<button className="btn-action delete" onClick={handleDelete}>
							🗑️ Delete
						</button>
					</>
				)}

				{depth === 0 && (comment.replyCount > 0 || replies.length > 0) && (
					<button
						className="btn-link"
						onClick={toggleReplies}
					>
						{showReplies ? "Hide Replies" : `View Replies (${comment.replyCount || replies.length})`}
					</button>
				)}
			</div>

			{isReplying && (
				<div className="reply-form">
					<textarea
						value={replyContent}
						onChange={(e) => setReplyContent(e.target.value)}
						placeholder="Write a reply..."
						className="form-control"
					/>
					<div className="actions">
						<button className="btn-primary" onClick={handleReply}>Post Reply</button>
						<button className="btn-secondary" onClick={() => setIsReplying(false)}>
							Cancel
						</button>
					</div>
				</div>
			)}

			{showReplies && replies.length > 0 && (
				<div className="replies-list">
					{replies.map((reply) => (
						<CommentItem key={reply._id} comment={reply} depth={depth + 1} />
					))}
				</div>
			)}
		</div>
	);
}
