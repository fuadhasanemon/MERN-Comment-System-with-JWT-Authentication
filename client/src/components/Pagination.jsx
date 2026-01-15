export default function Pagination({ currentPage, totalPages, onPageChange }) {
	if (totalPages <= 1) return null;

	const pages = [];
	for (let i = 1; i <= totalPages; i++) {
		pages.push(i);
	}

	return (
		<div className="pagination" style={{ marginTop: "20px", display: "flex", gap: "5px", justifyContent: "center" }}>
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				style={{ padding: "8px 12px" }}
			>
				← Prev
			</button>

			{pages.map((page) => (
				<button
					key={page}
					onClick={() => onPageChange(page)}
					style={{
						padding: "8px 12px",
						backgroundColor: page === currentPage ? "#007bff" : "#fff",
						color: page === currentPage ? "#fff" : "#333",
						border: "1px solid #ddd",
						cursor: "pointer",
					}}
				>
					{page}
				</button>
			))}

			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				style={{ padding: "8px 12px" }}
			>
				Next →
			</button>
		</div>
	);
}
