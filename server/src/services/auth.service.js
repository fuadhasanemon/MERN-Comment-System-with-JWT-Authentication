const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const generateToken = require("../utils/generateToken");

exports.register = async (data) => {
	const exists = await User.findOne({ email: data.email });
	if (exists) throw new Error("User already exists");

	const hashedPassword = await bcrypt.hash(data.password, 10);

	const user = await User.create({
		username: data.username,
		email: data.email,
		password: hashedPassword,
	});

	return {
		user,
		token: generateToken(user._id),
	};
};

exports.login = async (data) => {
	const user = await User.findOne({ email: data.email });
	if (!user) throw new Error("Invalid credentials");

	const match = await bcrypt.compare(data.password, user.password);
	if (!match) throw new Error("Invalid credentials");

	return {
		user,
		token: generateToken(user._id),
	};
};
