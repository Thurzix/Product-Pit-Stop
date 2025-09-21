const Joi = require('joi');

// Schema de validação para registro de usuário
const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(255)
    .required()
    .messages({
      'string.base': 'Nome deve ser um texto',
      'string.empty': 'Nome é obrigatório',
      'string.min': 'Nome deve ter pelo menos 2 caracteres',
      'string.max': 'Nome deve ter no máximo 255 caracteres',
      'any.required': 'Nome é obrigatório'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email deve ser um texto',
      'string.empty': 'Email é obrigatório',
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    }),
  
  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      'string.base': 'Senha deve ser um texto',
      'string.empty': 'Senha é obrigatória',
      'string.min': 'Senha deve ter pelo menos 6 caracteres',
      'string.max': 'Senha deve ter no máximo 128 caracteres',
      'any.required': 'Senha é obrigatória'
    }),
  
  role: Joi.string()
    .valid('buyer', 'seller')
    .default('buyer')
    .messages({
      'any.only': 'Role deve ser "buyer" ou "seller"'
    })
});

// Schema de validação para login
const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email deve ser um texto',
      'string.empty': 'Email é obrigatório',
      'string.email': 'Email deve ter um formato válido',
      'any.required': 'Email é obrigatório'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'string.base': 'Senha deve ser um texto',
      'string.empty': 'Senha é obrigatória',
      'any.required': 'Senha é obrigatória'
    })
});

// Middleware de validação genérico
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true
    });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Dados inválidos',
        errors: errorMessages
      });
    }
    
    req.validatedData = value;
    next();
  };
};

module.exports = {
  validate,
  registerSchema,
  loginSchema
};