export default function SortSelect({ sort, setSort }) {
	return (
		<select 
			value={sort}
			onChange={(e) => setSort(e.target.value)}
			style={{
				padding: "8px 12px",
				borderRadius: "4px",
				border: "1px solid #ddd",
				fontSize: "14px",
				cursor: "pointer"
			}}
		>
			<option value="newest">Newest First</option>
			<option value="likes">Most Liked</option>
			<option value="dislikes">Most Disliked</option>
		</select>
	);
}
