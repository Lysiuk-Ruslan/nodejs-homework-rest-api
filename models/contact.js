const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../utils");

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
}, { versionKey: false });

contactSchema.post("save", handleMongooseError)

const addSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "uk", "ca"] } })
        .required(),
    phone: Joi.number().required(),
    favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required(),
});

const schemas = {
    addSchema,
    updateFavoriteSchema,
}

const Contact = model("Contact", contactSchema);

module.exports = { Contact, schemas };