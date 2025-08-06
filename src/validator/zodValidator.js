import handleCommonErrors from "../utils/errors/handleCommonErrors.js";

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      try {
        handleCommonErrors(error);
      } catch (customError) {
        next(customError); 
      }
    }
  };
};
