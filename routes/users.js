const express = require('express');
const ctrl = require("../controllers/users");

const { validateBody, authenticate } = require('../middleware');

const { schemas } = require("../models/user");

const router = express.Router();

// Маршрут для реєстрації користувача (signup routes)

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

// Маршрут для авторизації користувача (signin routes)

router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

// Маршрут для перевірки дійсності токена

router.get("/current", authenticate, ctrl.Current);

// Маршрут для розлогінення користувача

router.post("/logout", authenticate, ctrl.logout);

// Маршрут для оновлення підписки користувача

router.patch("/users", ctrl.updateStatusUser);

module.exports = router;