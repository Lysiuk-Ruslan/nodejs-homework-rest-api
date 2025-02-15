const { Contact } = require("../models/contact");

const { HttpError, ctrlWrapper } = require("../utils");



// Функція яка обробляє запит GET для отримання списку всіх контактів.

const listContacts = async (req, res) => {
    const { _id: owner } = req.user;

    // const { page = 1, limit = 20 } = req.query;
    // const skip = (page - 1) * limit;

    // const filter = { owner };
    // if (favorite && favorite === "true") {
    //     filter.favorite = true;
    // };
    // const result = await Contact.find({ owner }, { skip, limit });

    const result = await Contact.find({ owner });
    res.json(result)
}

// Функція яка обробляє запит GET для отримання контакту за ідентифікатором

const getContactById = async (req, res) => {

    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
        throw HttpError(404, "Not Found");
    }
    res.json(result)



}

// Функція яка обробляє запит POST для додавання нового контакту.

const addContact = async (req, res) => {
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
    if (!result) {
        throw HttpError(404, "Not Found");
    }
    res.status(201).json(result);

}

// Функція яка обробляє запит PUT для зміни контакту за ідентифікатором

const changeContact = async (req, res) => {

    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
    if (!result) {
        throw HttpError(404, "Not Found");
    }
    res.json(result);
}

// Функція яка обробляє запит PATCH для оновлення вказаного поля контакта

const updateStatusContact = async (req, res) => {

    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
    if (!result) {
        throw HttpError(404, "Not Found");
    }
    res.json(result);

}


// Функція яка обробляє запит DELETE для видалення контакту за ідентифікатором

const removeContact = async (req, res) => {

    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
        throw HttpError(404, "Not Found");
    }
    res.json({
        message: "Delete Contact"
    })
}



module.exports = {
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    addContact: ctrlWrapper(addContact),
    changeContact: ctrlWrapper(changeContact),
    updateStatusContact: ctrlWrapper(updateStatusContact),
    removeContact: ctrlWrapper(removeContact),
};