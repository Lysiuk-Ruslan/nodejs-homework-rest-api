const validateBodyFavorite = (schema) => {
    const func = (req, res, next) => {
        if (Object.keys(req.body).length === 0 && req.body.constructor === Object) {
            res.status(400).json({
                message: "missing field favorite",
            });
            return;
        }

        const { error } = schema.validate(req.body);

        if (error) {
            res.status(400).json({
                message: `missing required ${error.details[0].context.key} field`,
            });
            return;
        }
        next();
    };
    return func;
};



module.exports = validateBodyFavorite;