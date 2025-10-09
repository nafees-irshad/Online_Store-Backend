const joi = require("joi");

const userSchema = joi.object({
  name: joi
    .string()
    .max(30)
    .messages({ "string.empty": "Name field cannot be empty." }),
  email: joi.string().email().required(),
  password: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{6,12}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be between 6 to 12 characters long and contain only letters and numbers.",
      "string.empty": "Password cannot be empty.",
    }),
});

const verificationSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.empty": "Email field cannot be empty.",
    "string.email": "Enter a valid email address",
  }),
  code: joi.string().required().messages({
    "string.empty": "Verification code field cannot be empty.",
  }),
});

const changePasswordSchema = joi.object({
  currentPassword: joi.string().required().messages({
    "string.empty": "Current password cannot be empty.",
  }),
  newPassword: joi
    .string()
    .pattern(new RegExp("^[a-zA-Z0-9]{6,12}$"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must be between 6 to 12 characters long and contain only letters and numbers.",
      "string.empty": "Password cannot be empty.",
    }),
  passwordConfirmation: joi
    .any()
    .valid(joi.ref("newPassword"))
    .messages({
      "any.only": "Password confirmation does not match the new password.",
    })
    .required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.empty": "Email can not be empty",
    "string.email": "Enter a valid email address",
  }),
  password: joi.string().required().messages({
    "string.empty": "Plz enter password",
  }),
});

const updateSchema = joi
  .object({
    name: joi.string().max(30).optional().messages({
      "string.empty": "Name field can not be empty",
    }),
    email: joi.string().email().optional().messages({
      "string.empty": "Email field can not be empty",
      "string.email": "Enter a valid email address",
    }),
    address: joi.string().optional().messages({
      "string.empty": "Address field can not be empty",
    }),
  })
  .or("name", "email", "address");

module.exports = {
  userSchema,
  verificationSchema,
  loginSchema,
  changePasswordSchema,
  updateSchema,
};
