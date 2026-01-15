import api from "../../api/axios";

export const fetchComments = async ({ page = 1, sort = "newest" }) => {
	const res = await api.get(`/comments?page=${page}&sort=${sort}`);
	return res.data;
};

export const createComment = async ({ content, parentComment = null }) => {
	const res = await api.post("/comments", { content, parentComment });
	return res.data;
};

export const editComment = async ({ id, content }) => {
	const res = await api.put(`/comments/${id}`, { content });
	return res.data;
};

export const deleteComment = async (id) => {
	const res = await api.delete(`/comments/${id}`);
	return res.data;
};

export const likeComment = async (id) => {
	const res = await api.post(`/comments/${id}/like`);
	return res.data;
};

export const dislikeComment = async (id) => {
	const res = await api.post(`/comments/${id}/dislike`);
	return res.data;
};

export const fetchReplies = async (commentId) => {
	const res = await api.get(`/comments/${commentId}/replies`);
	return res.data;
};
