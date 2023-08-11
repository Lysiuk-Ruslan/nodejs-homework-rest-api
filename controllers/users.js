const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
const { nanoid } = require('nanoid');

const { User } = require("../models/user");

const { HttpError, ctrlWrapper, sendEmail } = require("../utils");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

// Функція яка обробляє запит POST для реєстрації користувача.

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();


    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationToken });
    const userRegister = { email: newUser.email, subscription: newUser.subscription };
    const object = { user: userRegister };

    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}"> Click to verify email</a>`
    }

    await sendEmail(verifyEmail);

    res.status(201).json(object);
};

// Функція яка обробляє запит GET для верифікації користувача.

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

    res.json({
        message: "Verification successful"
    })
};

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email not found");
    }
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
        to: email,
        subject: 'Verify email',
        html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}"> Click to verify email</a>`
    }

    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email sent"
    })
}

// Функція яка обробляє запит POST для авторизації користувача.

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password wrong.");
    }

    if (!user.verify) {
        throw HttpError(401, "Email not verify");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password wrong.");
    }

    const userLogin = { email: user.email, subscription: user.subscription };

    const payload = {
        id: user.id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
        token,
        user: userLogin
    })
}

// Функція для перевірки дійсності токена

const Current = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({ email, subscription })
}

// Функція для розлогінення користувача

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204, "No content").json();
}

// Функція яка обробляє запит PATCH для оновлення підписки користувача

const updateStatusUser = async (req, res) => {
    const { _id, subscription } = req.body;
    const validSubscription = ["starter", "pro", "business"];
    if (!validSubscription.includes(subscription)) {
        throw HttpError(400, "Invalid subscription value");
    }

    const user = await User.findByIdAndUpdate(_id, { subscription }, { new: true });
    if (!user) {
        throw HttpError(400, "User not found");
    }

    res.json(user);
}

const updateAvatarsUser = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, filename } = req.file;
    const avatarName = `${_id}_${filename}`;
    const resultUpload = path.join(avatarsDir, avatarName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", avatarName);
    await User.findByIdAndUpdate(_id, { avatarURL });
    const avatarImage = await Jimp.read(resultUpload);
    await avatarImage.resize(250, 250).write(resultUpload);
    res.json({ avatarURL });

}

module.exports = {
    register: ctrlWrapper(register),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    Current: ctrlWrapper(Current),
    logout: ctrlWrapper(logout),
    updateStatusUser: ctrlWrapper(updateStatusUser),
    updateAvatarsUser: ctrlWrapper(updateAvatarsUser),
}


