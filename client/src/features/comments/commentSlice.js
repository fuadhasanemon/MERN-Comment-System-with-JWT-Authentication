import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as service from "./commentService";

export const getComments = createAsyncThunk(
	"comments/get",
	async ({ page = 1, sort = "newest" }) => {
		return await service.fetchComments({ page, sort });
	}
);

export const addComment = createAsyncThunk(
	"comments/add",
	async ({ content, parentComment = null }) => {
		return await service.createComment({ content, parentComment });
	}
);

export const editComment = createAsyncThunk(
	"comments/edit",
	async ({ id, content }) => {
		return await service.editComment({ id, content });
	}
);

export const deleteComment = createAsyncThunk(
	"comments/delete",
	async (id) => {
		await service.deleteComment(id);
		return id;
	}
);

export const like = createAsyncThunk("comments/like", async (id) => {
	return await service.likeComment(id);
});

export const dislike = createAsyncThunk("comments/dislike", async (id) => {
	return await service.dislikeComment(id);
});

export const getReplies = createAsyncThunk(
	"comments/getReplies",
	async (commentId) => {
		const replies = await service.fetchReplies(commentId);
		return { commentId, replies };
	}
);

const commentSlice = createSlice({
	name: "comments",
	initialState: {
		list: [],
		totalCount: 0,
		totalPages: 0,
		currentPage: 1,
		replies: {}, // { commentId: [replies] }
		loading: false,
	},
	reducers: {
		addReplyToState: (state, action) => {
			const { parentId, reply } = action.payload;
			if (!state.replies[parentId]) {
				state.replies[parentId] = [];
			}
			state.replies[parentId].unshift(reply);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getComments.pending, (state) => {
				state.loading = true;
			})
			.addCase(getComments.fulfilled, (state, action) => {
				state.list = action.payload.comments;
				state.totalCount = action.payload.totalCount;
				state.totalPages = action.payload.totalPages;
				state.currentPage = action.payload.currentPage;
				state.loading = false;
			})
			.addCase(addComment.fulfilled, (state, action) => {
				// If it's a top-level comment, add to list
				if (!action.payload.parentComment) {
					state.list.unshift(action.payload);
					state.totalCount += 1;
				}
			})
			.addCase(editComment.fulfilled, (state, action) => {
				const index = state.list.findIndex(
					(c) => c._id === action.payload._id
				);
				if (index !== -1) {
					state.list[index] = action.payload;
				}
				// Also update in replies
				for (const parentId in state.replies) {
					const replyIndex = state.replies[parentId].findIndex(
						(c) => c._id === action.payload._id
					);
					if (replyIndex !== -1) {
						state.replies[parentId][replyIndex] = action.payload;
					}
				}
			})
			.addCase(deleteComment.fulfilled, (state, action) => {
				state.list = state.list.filter((c) => c._id !== action.payload);
				state.totalCount -= 1;
				// Also remove from replies
				for (const parentId in state.replies) {
					state.replies[parentId] = state.replies[parentId].filter(
						(c) => c._id !== action.payload
					);
				}
			})
			.addCase(like.fulfilled, (state, action) => {
				const index = state.list.findIndex(
					(c) => c._id === action.payload._id
				);
				if (index !== -1) {
					state.list[index] = action.payload;
				}
				// Also update in replies
				for (const parentId in state.replies) {
					const replyIndex = state.replies[parentId].findIndex(
						(c) => c._id === action.payload._id
					);
					if (replyIndex !== -1) {
						state.replies[parentId][replyIndex] = action.payload;
					}
				}
			})
			.addCase(dislike.fulfilled, (state, action) => {
				const index = state.list.findIndex(
					(c) => c._id === action.payload._id
				);
				if (index !== -1) {
					state.list[index] = action.payload;
				}
				// Also update in replies
				for (const parentId in state.replies) {
					const replyIndex = state.replies[parentId].findIndex(
						(c) => c._id === action.payload._id
					);
					if (replyIndex !== -1) {
						state.replies[parentId][replyIndex] = action.payload;
					}
				}
			})
			.addCase(getReplies.fulfilled, (state, action) => {
				state.replies[action.payload.commentId] = action.payload.replies;
			});
	},
});

export const { addReplyToState } = commentSlice.actions;
export default commentSlice.reducer;
