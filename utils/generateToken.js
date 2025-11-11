import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});

	res.cookie("jwt", token, {
		httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 30,
        partitioned: true,
	});

	return token;
};

// maxAge: 15 * 24 * 60 * 60 * 1000, //MS
// httpOnly: true, // prevent XSS attacks cross-site scripting attacks
// sameSite: "none", // CSRF attacks cross-site request forgery attacks
// secure: true,
// partitioned: true,