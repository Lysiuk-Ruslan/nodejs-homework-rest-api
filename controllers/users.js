const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require("../models/user");

const { HttpError, ctrlWrapper } = require("../utils");

const { SECRET_KEY } = process.env;

// Функція яка обробляє запит POST для реєстрації користувача.

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });
    const userRegister = { email: newUser.email, subscription: newUser.subscription };
    const object = { user: userRegister };

    res.status(201).json(object);
};

// Функція яка обробляє запит POST для авторизації користувача.

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        throw HttpError(401, "Email or password invalid.");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid.");
    }

    const payload = {
        id: user.id,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" })
    res.json({
        token,
    })


}


module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
}


