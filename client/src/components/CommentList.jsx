import CommentItem from "./CommentItem";

export default function CommentList({ comments }) {
	return comments.map((c) => <CommentItem key={c._id} comment={c} />);
}
