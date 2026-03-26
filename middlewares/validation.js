const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const {
  validateCardBody,
  validateUserBody,
  validateAuth,
  validateId,
} = require("./middleware/validation");
const { validate } = require("../models/clothingItems");

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
    weather: Joi.string().required().messages({
      "string.empty": 'The "weather" field must be filled in',
    }),
  }),
});

module.exports.validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'The "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

module.exports.validateId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().required().hex().length(24).messages({
      "string.empty": 'The "itemId" parameter is required',
      "string.hex": 'The "itemId" must be a hexadecimal value',
      "string.length": 'The "itemId" must be 24 characters long',
    }),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24).messages({
      "string.empty": 'The "userId" parameter is required',
      "string.hex": 'The "userId" must be a hexadecimal value',
      "string.length": 'The "userId" must be 24 characters long',
    }),
  }),
});

module.exports = {
  validate,
  validateCardBody,
  validateUserBody,
  validateAuth,
  validateId,
};
