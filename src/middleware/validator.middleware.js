const { validationResult } = require("express-validator");

const validationHandler = (validations) => {
  return async (req, res, next) => {
    try {
      for (const validation of validations) {
        const result = await validation.run(req);
        if (!result.isEmpty()) break;
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        throw errors;
      }
      return next();
    } catch (e) {
      return next(e);
    }
  };
};

module.exports = validationHandler;
