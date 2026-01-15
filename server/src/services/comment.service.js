const Comment = require("../models/Comment.model");

exports.create = async (data, userId) => {
	return Comment.create({
		content: data.content,
		author: userId,
		parentComment: data.parentComment || null,
	});
};

exports.like = async (commentId, userId) => {
	const comment = await Comment.findById(commentId);

	comment.dislikes.pull(userId);

	if (comment.likes.includes(userId)) {
		comment.likes.pull(userId);
	} else {
		comment.likes.push(userId);
	}

	return comment.save();
};

exports.dislike = async (commentId, userId) => {
	const comment = await Comment.findById(commentId);

	comment.likes.pull(userId);

	if (comment.dislikes.includes(userId)) {
		comment.dislikes.pull(userId);
	} else {
		comment.dislikes.push(userId);
	}

	return comment.save();
};

exports.remove = async (commentId, userId) => {
	const comment = await Comment.findById(commentId);

	if (comment.author.toString() !== userId) {
		throw new Error("Forbidden");
	}

	await comment.deleteOne();
};

exports.edit = async (commentId, userId, newContent) => {
	const comment = await Comment.findById(commentId);

	if (!comment) {
		throw new Error("Comment not found");
	}

	if (comment.author.toString() !== userId) {
		throw new Error("Forbidden");
	}

	comment.content = newContent;
	await comment.save();

	return comment.populate("author", "username");
};
