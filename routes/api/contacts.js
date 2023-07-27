const express = require('express');

const ctrl = require('../../controllers/contacts');

const { validateBody, isValidId, validateBodyFavorite } = require("../../middleware");

const { schemas } = require("../../models/contact")

const router = express.Router();

// Маршрут для отримання списку всіх контактів.

router.get('/', ctrl.listContacts)

// Маршрут для отримання контакту за ідентифікатором

router.get('/:contactId', isValidId, ctrl.getContactById)

// Маршрут для додавання нового контакту.

router.post('/', validateBody(schemas.addSchema), ctrl.addContact)

// Маршрут для зміни контакту за ідентифікатором

router.put('/:contactId', isValidId, validateBody(schemas.addSchema), ctrl.changeContact)

// Маршрут для оновлення вказаного поля контакта

router.patch('/:contactId/favorite', isValidId, validateBodyFavorite(schemas.updateFavoriteSchema), ctrl.updateStatusContact)

// Маршрут для видалення контакту за ідентифікатором

router.delete('/:contactId', isValidId, ctrl.removeContact)


module.exports = router
