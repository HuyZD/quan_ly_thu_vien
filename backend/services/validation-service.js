import Joi from "joi";

/* DEFINE CUSTOM MESSAGES */
const customErrorMessages = {
  "any.required": "{{#label}} yêu cầu.",
  "number.base": "{{#label}} nhập số.",
  "number.integer": "{{#label}}Nhập số nguyên.",
  "number.min": "{{#label}} không nhỏ hơn {{#limit}}.",
  "number.max": "{{#label}} không lớn hơn{{#limit}}.",
  "string.pattern.base":
    "{{#label}} Chỉ chứa kí tự chữ cái.",
};

/* BOOK VALIDATION SCHEMA */

const bookValidationSchema = Joi.object({
  ISBN: Joi.string().required().max(10),
  title: Joi.string().required().max(200),
  author: Joi.string().required().max(60),
  category: Joi.string().required(),
  almirah: Joi.string().required(),
  shelf: Joi.string().optional(),
  publisher: Joi.string().optional(),
  edition: Joi.string().optional(),
  description: Joi.string().optional().empty(),
  tags: Joi.string().optional(),
  status: Joi.string().optional(),
  image: Joi.string().optional(),
});

/* TEACHER VALIDATION SCHEMA */
const teacherValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .max(30)
    .pattern(/^[A-Za-z\s]+$/),
  email: Joi.string().required().email(),
}).messages(customErrorMessages);

const contactUsValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .max(30)
    .pattern(/^[A-Za-z\s]+$/),
  email: Joi.string().required().email(),
  message: Joi.string().required(),
}).messages(customErrorMessages);

/* STUDENT VALIDATION SCHEMA */
const studentValidationSchema = Joi.object({
  name: Joi.string()
    .required()
    .max(30)
    .pattern(/^[A-Za-z\s]+$/),
  email: Joi.string().required().email(),
  rollNumber: Joi.string().required(),
  accountStatus: Joi.boolean().optional(),
}).messages(customErrorMessages);

const issuedBookSchema = Joi.object({
  userID: Joi.string().required(),
  bookID: Joi.string().required(),
});

const renewBookSchema = Joi.object({
  transactionID: Joi.string().required(),
  renewalDays: Joi.number().min(1).max(7).required(),
});

const renewHandleSchema = Joi.object({
  transactionID: Joi.string().required(),
  renewalStatus: Joi.string().valid("Accepted", "Rejected").required(),
});

/* CATEGORY VALIDATION SCEHMA */
const categoryValidationSchema = Joi.object({
  name: Joi.string().required().max(30),
  description: Joi.string().allow("", null).optional(),
}).messages(customErrorMessages);

/* ALMIRAH VALIDATION SCEHMA */
const almirahValidationSchema = Joi.object({
  subject: Joi.string().required().max(20),
  number: Joi.string().required(),
});

const loginValidationSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required(),
}).messages(customErrorMessages);

const forgetPasswordValidationSchema = Joi.object({
  email: Joi.string().required().email(),
}).messages(customErrorMessages);

export {
  teacherValidationSchema,
  loginValidationSchema,
  forgetPasswordValidationSchema,
  studentValidationSchema,
  categoryValidationSchema,
  almirahValidationSchema,
  bookValidationSchema,
  issuedBookSchema,
  contactUsValidationSchema,
  renewBookSchema,
  renewHandleSchema,
};
