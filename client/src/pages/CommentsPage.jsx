import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getComments } from "../features/comments/commentSlice";
import CommentList from "../components/CommentList";
import CommentForm from "../components/CommentForm";
import SortSelect from "../components/SortSelect";
import Pagination from "../components/Pagination";

export default function CommentsPage() {
	const dispatch = useDispatch();
	const { list: comments, totalPages, currentPage, loading } = useSelector(
		(state) => state.comments
	);
	const [sort, setSort] = useState("newest");
	const [page, setPage] = useState(1);

	useEffect(() => {
		dispatch(getComments({ page, sort }));
	}, [dispatch, page, sort]);

	const handlePageChange = (newPage) => {
		setPage(newPage);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSortChange = (newSort) => {
		setSort(newSort);
		setPage(1); // Reset to page 1 when changing sort
	};

	return (
		<div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
			<h1>Comments</h1>

			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
				<SortSelect sort={sort} setSort={handleSortChange} />
			</div>

			<CommentForm />

			{loading ? (
				<p>Loading comments...</p>
			) : (
				<>
					<CommentList comments={comments} />
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				</>
			)}
		</div>
	);
}
