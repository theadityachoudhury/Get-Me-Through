const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const { JWT_SECRET, JWT_REFRESH_TOKEN_SECRET } = require("../../config/db");
const { signupSchema } = require("../../Validators/Auth/auth-val");
const User = require("../../Models/Auth/users");
const RefreshToken = require("../../Models/Auth/refreshTokens");

//Response Messages
const Login_MSG = {
	usernameNotExist: "Username is not found. Invalid login credentials.",
	wrongRole: "Please make sure this is your identity.",
	loginSuccess: "You are successfully logged in.",
	wrongPassword: "Incorrect password.",
	loginError: "Oops! Something went wrong.",
};

const Register_MSG = {
	usernameExists: "Username is already taken.",
	emailExists: "Email is already registered.",
	signupSuccess: "You are successfully signed up.",
	signupError: "Unable to create your account.",
};

//OTP Generator
const otpgen = (length) => {
	const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	const digits = "0123456789";
	let otp = "";

	let alphabetCount = 0;
	let hasMinimumOneAlphabet = false;

	for (let i = 0; i < length; i++) {
		let randomIndex;

		if (
			(alphabetCount < 2 && Math.random() < 0.5) ||
			(i === length - 1 && !hasMinimumOneAlphabet)
		) {
			// If the current count of alphabets is less than 2 and random condition is met,
			// or if it is the last character and there has not been minimum one alphabet yet,
			// ensure the character is an alphabet.
			randomIndex = Math.floor(Math.random() * alphabets.length);
			otp += alphabets[randomIndex];
			alphabetCount++;
			hasMinimumOneAlphabet = true;
		} else {
			// Otherwise, add a random digit.
			randomIndex = Math.floor(Math.random() * digits.length);
			otp += digits[randomIndex];
		}
	}

	return otp;
};

//Automatic Password Generator
const passgen = (length) => {
	const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
	const numbers = "0123456789";
	const specialCharacters = "!@#$%^&*()_";

	const getRandomChar = (characters) => {
		const randomIndex = Math.floor(Math.random() * characters.length);
		return characters[randomIndex];
	};

	let password = "";

	// Generate one random character from each category
	password += getRandomChar(uppercaseLetters);
	password += getRandomChar(lowercaseLetters);
	password += getRandomChar(numbers);
	password += getRandomChar(specialCharacters);

	// Generate remaining characters randomly
	const remainingLength = length - password.length;
	const allCharacters =
		uppercaseLetters + lowercaseLetters + numbers + specialCharacters;

	for (let i = 0; i < remainingLength; i++) {
		password += getRandomChar(allCharacters);
	}

	// Shuffle the password to randomize the order of characters
	password = password
		.split("")
		.sort(() => 0.5 - Math.random())
		.join("");
	return password;
};

//Hashing the forget otp
function hashString(string) {
	const hash = crypto.createHash("sha256");
	hash.update(string);
	return hash.digest("hex");
}

//Public API functions

//Register API
const register = async (req, res, next) => {
	try {
		const role = 1;
		const signupRequest = signupSchema.validateAsync(req.body);
		let emailRegistered = await validateEmail(signupRequest);
		if (emailRegistered) {
			return res.status(400).json({
				message: Register_MSG.emailExists,
				success: false,
			});
		}

		let { password } = signupRequest;
		password = await bcrypt.hash(pass, 12);
		const newUser = new User({
			...signupRequest,
			password,
			role,
		});
		await newUser.save();
		return res.status(201).json({
			message: Register_MSG.signupSuccess,
			success: true,
		});
	} catch {
		let errorMsg = Register_MSG.signupError;
		if (err.isJoi === true) {
			err.status = 403;
			errorMsg = err.message;
		}
		console.log(err);
		return res.status(err.status || 500).json({
			message: errorMsg,
			success: false,
		});
	}
};

const login = async (req, res, next) => {
	try {
		const loginRequest = await loginSchema.validateAsync(req.body);
		const user = User.findOne({ email: loginRequest.email });
		if (!user) {
			return res.status(404).json({
				success: false,
				message: Login_MSG.usernameNotExist,
			});
		}
		if (user.deleted) {
			return res.status(404).json({
				reason: "username",
				message: Login_MSG.usernameNotExist,
				success: false,
			});
		}
		let isMatch = await bcrypt.compare(password, user.password);
		if (isMatch) {
			const refreshTokenColl = await refreshToken.findOne({
				email: loginRequest.email,
			});
			let token = jwt.sign(
				{
					user_id: user._id,
					verified: user.verified,
					email: user.email,
					deleted: user.deleted,
				},
				JWT_SECRET,
				{ expiresIn: "3m" }
			);

			let refreshToken = jwt.sign(
				{
					user_id: user._id,
					verified: user.verified,
					email: user.email,
					deleted: user.deleted,
				},
				JWT_REFRESH_TOKEN_SECRET
			);

			if (!refreshTokenColl) {
				const newRefreshTokenColl = new RefreshToken({
					email: loginRequest.email,
					refreshToken,
				});
			} else {
				RefreshToken.updateOne(
					{ email: loginRequest.email },
					{ $push: { refreshToken: refreshToken } }
				)
					.then((result) => {})
					.catch((err) => {
						console.error(err);
						return res.status(406).json({
							reason: "username",
							message: "Unable to generate refresh token",
							success: false,
						});
					});
			}

			res.cookie("token", token);
			res.cookie("refreshToken", refreshToken);

			let result = {
				token: token,
				refreshToken: refreshToken,
			};

			return res
				.status(200)
				.json({ ...result, message: Login_MSG.loginSuccess, success: true });
		} else {
			return res.status(401).json({
				reason: "password",
				message: Login_MSG.wrongPassword,
				success: false,
			});
		}
	} catch (err) {
		let errorMsg = Login_MSG.loginError;
		if (err.isJoi === true) {
			err.status = 403;
			errorMsg = err.message;
		}
		console.log(err);
		return res.status(err.status || 500).json({
			message: errorMsg,
			success: false,
		});
	}
};
