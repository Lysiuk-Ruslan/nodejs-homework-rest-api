const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../utils");



const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: String,
    avatarURL: String,
}, { versionKey: false });

userSchema.post("save", handleMongooseError)

const registerSchema = Joi.object({
    password: Joi.string().min(8).required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "uk", "ca"] } })
        .required(),
    subscription: Joi.string(),
});

const loginSchema = Joi.object({
    password: Joi.string().min(8).required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "uk", "ca"] } })
        .required(),

});

const schemas = {
    registerSchema,
    loginSchema,
}

const User = model("user", userSchema);

module.exports = {
    User,
    schemas,
}