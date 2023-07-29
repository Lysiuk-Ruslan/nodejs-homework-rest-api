const express = require('express');

const ctrl = require('../../controllers/contacts');

const { validateBody, isValidId, validateBodyFavorite, authenticate } = require("../../middleware");

const { schemas } = require("../../models/contact")

const router = express.Router();

// Маршрут для отримання списку всіх контактів.

router.get('/', authenticate, ctrl.listContacts)

// Маршрут для отримання контакту за ідентифікатором

router.get('/:contactId', authenticate, isValidId, ctrl.getContactById)

// Маршрут для додавання нового контакту.

router.post('/', authenticate, validateBody(schemas.addSchema), ctrl.addContact)

// Маршрут для зміни контакту за ідентифікатором

router.put('/:contactId', authenticate, isValidId, validateBody(schemas.addSchema), ctrl.changeContact)

// Маршрут для оновлення вказаного поля контакта

router.patch('/:contactId/favorite', authenticate, isValidId, validateBodyFavorite(schemas.updateFavoriteSchema), ctrl.updateStatusContact)

// Маршрут для видалення контакту за ідентифікатором

router.delete('/:contactId', authenticate, isValidId, ctrl.removeContact)


module.exports = router
