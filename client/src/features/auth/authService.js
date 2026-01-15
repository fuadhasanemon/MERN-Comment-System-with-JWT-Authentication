import api from "../../api/axios";

export const login = async (data) => {
	const res = await api.post("/auth/login", data);
	localStorage.setItem("token", res.data.token);
	localStorage.setItem("user", JSON.stringify(res.data.user));
	return res.data.user;
};

export const register = async (data) => {
	const res = await api.post("/auth/register", data);
	localStorage.setItem("token", res.data.token);
	localStorage.setItem("user", JSON.stringify(res.data.user));
	return res.data.user;
};
