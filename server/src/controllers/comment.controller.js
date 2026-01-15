const commentService = require("../services/comment.service");
const Comment = require("../models/Comment.model");

exports.createComment = async (req, res) => {
	try {
		const { content, parentComment } = req.body;

		if (typeof content !== "string" || !content.trim()) {
			return res.status(400).json({ message: "Content must be a non-empty string" });
		}

		const comment = await Comment.create({
			content,
			author: req.user.id,
			parentComment: parentComment || null,
		});

		const populated = await comment.populate("author", "username");
		res.status(201).json(populated);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.editComment = async (req, res) => {
	try {
		const { content } = req.body;

		if (typeof content !== "string" || !content.trim()) {
			return res.status(400).json({ message: "Content must be a non-empty string" });
		}

		const comment = await commentService.edit(req.params.id, req.user.id, content);
		res.json(comment);
	} catch (err) {
		if (err.message === "Forbidden") {
			return res.status(403).json({ message: "You can only edit your own comments" });
		}
		if (err.message === "Comment not found") {
			return res.status(404).json({ message: err.message });
		}
		res.status(500).json({ message: err.message });
	}
};

exports.likeComment = async (req, res) => {
	try {
		const comment = await commentService.like(req.params.id, req.user.id);
		const populated = await comment.populate("author", "username");
		res.json(populated);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.dislikeComment = async (req, res) => {
	try {
		const comment = await commentService.dislike(req.params.id, req.user.id);
		const populated = await comment.populate("author", "username");
		res.json(populated);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.deleteComment = async (req, res) => {
	try {
		await commentService.remove(req.params.id, req.user.id);
		res.json({ message: "Deleted", _id: req.params.id });
	} catch (err) {
		if (err.message === "Forbidden") {
			return res.status(403).json({ message: "You can only delete your own comments" });
		}
		res.status(500).json({ message: err.message });
	}
};

exports.getComments = async (req, res) => {
	try {
		const { page = 1, limit = 10, sort = "newest" } = req.query;
		const pageNum = Number(page);
		const limitNum = Number(limit);

		// Get total count for pagination
		const totalCount = await Comment.countDocuments({ parentComment: null });
		const totalPages = Math.ceil(totalCount / limitNum);

		// Use aggregation pipeline for sorting by array length
		const sortStages = {
			newest: { $sort: { createdAt: -1 } },
			likes: { $sort: { likesCount: -1, createdAt: -1 } },
			dislikes: { $sort: { dislikesCount: -1, createdAt: -1 } },
		};

		const comments = await Comment.aggregate([
			{ $match: { parentComment: null } },
			{
				$addFields: {
					likesCount: { $size: "$likes" },
					dislikesCount: { $size: "$dislikes" },
				},
			},
			{
				$lookup: {
					from: "comments",
					localField: "_id",
					foreignField: "parentComment",
					as: "replies",
				},
			},
			{
				$addFields: {
					replyCount: { $size: "$replies" },
				},
			},
			{ $project: { replies: 0 } }, // Remove the large replies array, keep only count
			sortStages[sort] || sortStages.newest,
			{ $skip: (pageNum - 1) * limitNum },
			{ $limit: limitNum },
			{
				$lookup: {
					from: "users",
					localField: "author",
					foreignField: "_id",
					as: "authorData",
				},
			},
			{
				$addFields: {
					author: {
						$arrayElemAt: [
							{
								$map: {
									input: "$authorData",
									as: "a",
									in: { _id: "$$a._id", username: "$$a.username" },
								},
							},
							0,
						],
					},
				},
			},
			{ $project: { authorData: 0 } },
		]);

		res.json({
			comments,
			totalCount,
			totalPages,
			currentPage: pageNum,
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

exports.getReplies = async (req, res) => {
	try {
		const replies = await Comment.find({ parentComment: req.params.id })
			.populate("author", "username")
			.sort({ createdAt: 1 });

		res.json(replies);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};
