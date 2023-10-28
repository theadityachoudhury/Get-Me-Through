const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { JWT_SECRET, JWT_REFRESH_TOKEN_SECRET } = require("../../config/db");
const { signupSchema, validateEmail, validateUsername, loginSchema, PasswordSchema } = require("../Validators/Auth/validators");
const Users = require("../../models/Users");
const RefreshToken = require("../../models/refreshToken");
const Auth = require("../../models/auth");
const { mailer } = require("../Mailer/mailer");


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


//Public API functions starts here
const register = async (req, res, next) => {
    try {
        const signupRequest = await signupSchema.validateAsync(req.body);
        let emailNotTaken = await validateEmail(signupRequest.email);
        if (!emailNotTaken) {
            return res.status(400).json({
                message: Register_MSG.emailExists,
                success: false,
            });
        }
        let usernameNotTaken = await validateUsername(signupRequest.username);
        if (!usernameNotTaken) {
            return res.status(400).json({
                message: Register_MSG.usernameExists,
                success: false,
            });
        }

        const password = await bcrypt.hash(signupRequest.password, 12);
        const newUser = new Users({
            ...signupRequest,
            password: password,
        });

        await newUser.save({ writeConcern: { w: 'majority' } });

        res.status(201).json({
            message: Register_MSG.signupSuccess,
            success: true,
        });

        mailer(signupRequest.email, "Account Created | Get-Me-Through", `Your Account has been created in the Get-Me-Through portal.<br>To verify your account click on the link:- <a href="https://localhost:5173/verify" target="_blank">https://localhost:5173/verify</a>`, signupRequest.username, "acc_creation");

        return;
    } catch (e) {
        // console.log(e);
        let errMsg = Register_MSG.signupError;
        if (e.isJoi === true) {
            e.status = 403;
            errMsg = e.message;
        }

        return res.status(e.status || 500).json({
            message: errMsg,
            success: false,
        });
    }
};

const login = async (req, res, next) => {
    try {
        const loginRequest = await loginSchema.validateAsync(req.body);
        let user;
        let refreshTokenColl;
        user = await Users.findOne({ username: loginRequest.username });
        if (!user) {
            return res.status(404).json({
                reason: "username",
                message: Login_MSG.usernameNotExist,
                success: false,
            });
        }
        if (user.deleted) {
            return res.status(404).json({
                reason: "username",
                message: Login_MSG.usernameNotExist,
                success: false,
            });
        }

        refreshTokenColl = await RefreshToken.findOne({ username: loginRequest.username });
        let isMatch = await bcrypt.compare(loginRequest.password, user.password);
        if (isMatch) {
            let token = jwt.sign(
                {
                    user_id: user._id,
                    role: user.role,
                    username: user.username,
                    email: user.email,
                    verified: user.verified,
                },
                JWT_SECRET,
                { expiresIn: "10m" }
            );

            let refreshToken = jwt.sign(
                {
                    user_id: user._id,
                    role: user.role,
                    username: user.username,
                    email: user.email,
                    verified: user.verified,
                },
                JWT_REFRESH_TOKEN_SECRET
            );

            if (!refreshTokenColl) {
                const newRefreshTokenColl = new RefreshToken({
                    username: loginRequest.username,
                    refreshToken,
                });
                newRefreshTokenColl.save();
            }

            if (refreshTokenColl) {
                RefreshToken.updateOne(
                    { username: user.username },
                    { $push: { refreshToken: refreshToken } }
                )
                    .then((result) => {
                        // console.log('Successfully updated the refresh token');
                    })
                    .catch((err) => {
                        return res.status(406).json({
                            reason: "username",
                            message: "Unable to generate refresh token",
                            success: false,
                        });
                        // console.error(err);
                    });
            }

            res.cookie("token", token);
            res.cookie("refreshToken", refreshToken);

            let result = {
                token: token,
                refreshToken: refreshToken,
            };

            return res.status(200).json({
                ...result,
                data: user,
                message: Login_MSG.loginSuccess,
                success: true,
            });
        } else {
            return res.status(401).json({
                reason: "password",
                message: Login_MSG.wrongPassword,
                success: false,
            });
        }

    } catch (e) {
        // console.log(e);
        let errorMsg = Login_MSG.loginError;
        if (e.isJoi === true) {
            e.status = 403;
            errorMsg = e.message;
        }
        return res.status(e.status || 500).json({
            reason: "server",
            message: errorMsg,
            success: false,
        });
    }
}

const getuser = async (req, res, next) => {
    let user;
    if (req._id) {
        const userid = req._id;
        try {
            user = await Users.findById(userid, "-password");
        } catch (err) {
            return new Error(err);
        }
    } else if (req.email) {
        const email = req.body.email;
        try {
            user = await Users.findOne({ email: email });
        } catch (err) {
            return new Error(err);
        }
    }
    if (!user) {
        return res.status(200).json(null);
    }
    let r;
    if (req.token) {
        let token = req.token;
        r = {
            token,
            user,
        };
    } else {
        r = user;
    }
    return res.status(200).json({ data: user });
}


const verifytoken = (req, res, next) => {
    const { token, refreshToken } = req.cookies;
    if (!token) {
        return res.status(200).json(null);
    }

    jwt.verify(String(token), JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(200).json(null);
        } else {
            req._id = user.user_id;
            req.username = user.username;
            req.token = token;
            req.email = user.email;
            req.role = user.role;
            req.verified = user.verified;
            next();
        }
    });
};

const refresh = async (req, res, next) => {
    let refreshTokenColl;
    var username = req.username;
    // console.log(username);
    refreshTokenColl = await RefreshToken.findOne({ username });
    const user = await Users.findById(req._id);

    if (!refreshTokenColl) {
        return res.status(200).json(null);
    } else {
        let token = jwt.sign(
            {
                user_id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                verified: user.verified,
            },
            JWT_SECRET,
            { expiresIn: "10m" }
        );
        res.cookie("token", token);
        return res.status(200).json({
            token,
            message: Login_MSG.loginSuccess,
            success: true,
        });
    }
};

const verifyRefreshToken = async (req, res, next) => {
    const { refreshToken } = req.cookies;
    const token = refreshToken;

    if (!token) {
        return res.status(200).json(null);
    }

    // console.log(token);

    jwt.verify(String(token), JWT_REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            // console.log(err);
            return res.status(200).json(null);
        } else {
            req._id = user.user_id;
            req.username = user.username;
            req.email = user.email;
            req.role = user.role;
            req.verified = user.verified;
            next();
        }
    });
};


const logout = async (req, res, next) => {
    const { refreshToken } = req.cookies;
    const token = refreshToken;

    res.clearCookie("token");
    res.clearCookie("refreshToken");

    if (!token) {
        return res.status(200).json(null);
    }

    // if (!token) {
    // 	return res.status(200).json({
    // 		reason: "unauthorized",
    // 		message: "token not found",
    // 		success: false,
    // 	});
    // }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(200).json(null);
        } else {
            RefreshToken.findOne({ refreshToken: refreshToken })
                .then((foundToken) => {
                    // console.log(foundToken);
                    if (!foundToken) {
                        throw new Error("Invalid refreshToken");
                    }

                    // console.log("the email is :- " + user.username);

                    return RefreshToken.updateOne(
                        { username: user.username },
                        { $pull: { refreshToken: refreshToken } }
                    );
                })
                .then((result) => {
                    if (result.nModified === 0) {
                        throw new Error("Failed to remove refreshToken");
                    }

                    // console.log("Successfully removed the refreshToken from the array");
                    return res.status(200).json(null);
                })
                .catch((err) => {
                    // console.error(err.message);
                    return res.status(200).json(null);
                });
        }
    });
};


const generate = async (req, res, next) => {
    const otp_len = 6;
    const auth_type = "acc_verify";
    let otp;
    const email = req.email;
    const username = req.body.username;

    let auth;
    try {
        auth = await Auth.findOne({ username, auth_type: auth_type });
    } catch (err) {
        return res.status(500).json({
            reason: "error",
            message: "Internal Server Error! Cannot generate OTP!",
            success: false,
        });
    }
    if (auth) {
        otp = auth.otp;
    } else {
        otp = otpgen(otp_len);
        auth = new Auth({
            email,
            username,
            auth_type,
            otp,
        });

        try {
            await auth.save();
        } catch (err) {
            console.log(err);
            return res.status(500).json({
                reason: "error",
                message: "Internal Server Error! Cannot generate OTP!",
                success: false,
            });
        }
    }

    try {
        mailer(
            email,
            "Account Verification OTP | Get-Me-Through",
            `Your account verification OTP is :- ${otp}`,
            username,
            auth_type
        );
    } catch (e) {
        return res.status(500).json({
            reason: "error",
            message: "Internal Server Error! Unable to send E-Mail!! Mailer Error",
            success: false,
        });
    }

    return res.status(200).json({
        otp: otp,
        message: "OTP generated successfully and sent to registered E-Mail",
        success: true,
    });
};

const verifyUser = async (username, verified) => {
    let user = await Users.findOne({ username });
    user.verified = verified;
    await user.save();
};

const verify = async (req, res, next) => {
    const auth_type = "acc_verify";
    const { username, otp } = req.body;
    if (validateUsername(username)) {
        let auth = await Auth.findOne({ username, auth_type: auth_type });
        if (auth) {
            if (auth.otp === otp) {
                verifyUser(username, true);
                await Auth.findByIdAndDelete(auth._id);
                // console.log(req._id);
                res.clearCookie("token");
                res.clearCookie("refreshToken");
                res.status(200).json({
                    message: "Account verified successfully",
                    success: true,
                });

                mailer(
                    req.email,
                    "Account Verification Successful | Get-Me-Through",
                    `Your account has been successfully verified and activated.`,
                    username,
                    auth_type
                );

            } else {
                return res.status(401).json({
                    reason: "otp",
                    message: "OTP is wrong",
                    success: false,
                });
            }
        } else {
            return res.status(403).json({
                reason: "otp",
                message: "First generate otp then try verifying the account!",
                success: false,
            });
        }
    }
};

const forget = async (req, res, next) => {
    const auth_type = "pass_reset";
    const { email } = req.body;
    const user = await Users.findOne({ email: email });
    if (!user) {
        return res.status(404).json({
            reason: "email",
            message: "Account associated with this E-Mail Id not found!!",
            success: false,
        });
    }
    const username = user.username;

    let auth = await Auth.findOne({ email: email, auth_type: auth_type });
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
    const salt = crypto.randomBytes(16).toString("hex"); // Generate a random salt
    const stringToHash = currentDate + email + username + salt;
    const otp = hashString(stringToHash);
    if (auth) {
        auth.otp = otp;
    } else {
        auth = new Auth({
            email,
            username,
            auth_type,
            otp,
        });
    }
    await auth.save();
    mailer(
        email,
        "Password Reset Link | Get-Me-Through",
        `To reset your password click this link:- <a href="http://localhost:5173/forget/${otp}" target="_blank">http://localhost:5173/forget/${otp}</a>`,
        username,
        auth_type
    );
    return res.status(200).json({
        message: "Password Reset Link Sent to the E-Mail ID",
        success: true,
    });
};

const forgetIsValid = async (req, res, next) => {
    const auth_type = "pass_reset";
    const { otp } = req.params;
    const auth = await Auth.findOne({ otp: otp, auth_type: auth_type });
    // console.log(auth);

    return auth ? res.status(200).json() : res.status(404).json();
};

const forget_save = async (req, res, next) => {
    const auth_type = "pass_reset";
    const { password, otp } = req.body;
    try {
        const LoginRequest = await PasswordSchema.validateAsync(req.body);
        const auth = await Auth.findOne({ otp: otp, auth_type: auth_type });
        if (!auth) {
            return res.status(404).json();
        }
        const user = await Users.findOne({
            username: auth.username,
            email: auth.email,
        });
        if (!user) {
            return res.status(404).json();
        }
        user.password = await bcrypt.hash(password, 12);
        await user.save();
        await Auth.findByIdAndDelete(auth._id);
        return res.json();
    } catch (err) {
        // console.log(err);
        return res
            .status(400)
            .json("Please try again with password with min. 8 characters");
    }
};


const updateUser = async (req, res, next) => {
    try {
        const user = await Users.findById(req._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "No user found!!", reason: "user" });
        }

        user.name = req.body.name || user.name;
        user.mobile = req.body.mobile || user.mobile;
        user.address = req.body.address || user.address;

        await user.save();
        return res.status(200).json();
    } catch (err) {
        return res.status(500).json();
    }
}


module.exports = {
    register,
    login,
    getuser,
    verifytoken,
    refresh,
    verifyRefreshToken,
    logout,
    generate,
    verify,
    forget,
    forgetIsValid,
    forget_save,
    updateUser
};
