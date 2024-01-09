import Joi from 'joi';
import { User } from '../models/user.model';

//Interface for Temp user data
export interface ITempUserData{
    email: string;
    otp: string;
    expirationTime :Date;
}

// Define a schema for check valid email object
export const emailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid Email',
  })
});

export const shopRegisterSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid Email',
  }),
  userRole: Joi.string().valid('alumni', 'shop').required(),
});

// Define a schema for check valid email object
export const passwordSchema = Joi.object({
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  })
});

// Define a schema for check valid email or otp object
export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email is required',
    'string.email': 'Invalid Email',
  }),
  otp: Joi.string().required().messages({
    'any.required': 'Otp is required',
  })
});

// Decoded tokens type
export interface DecodedToken {
  id: User;
  iat: number; // Issued at (timestamp)
  exp: number; // Expiration time (timestamp)
}