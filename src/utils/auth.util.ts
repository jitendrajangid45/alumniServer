import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import axios from 'axios';
import 'dotenv/config';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
import ApiError from '../api-errors/api-error.util';
import { DecodedToken } from '../types/auth.type';

// Generate a JSON Web Token (JWT) with an optional expiration time
export const generateJWT = (id: User, expiresIn?:string) => {
  const expiresInJwt = expiresIn ? expiresIn : '7d';
  const token = jwt.sign({ id }, process.env.JWT_SECRET || 'jwtsecrettoken', { expiresIn: expiresInJwt });
  return token;
};

// Verify a JWT from the request header and set email and token in the request query
export const verifyJWT = (req: Request, res: Response, next:NextFunction) => {
  try {
    if (req.headers.authorization) {

      const token = req.headers.authorization.split(' ')[1]; // Remove the "Bearer" prefix
      if (!token) {
        return next(ApiError.unAuthorized());
      }
      const decoded: DecodedToken = jwt.verify(token, process.env.JWT_SECRET || 'jwtsecrettoken') as DecodedToken;
      req.query.email = decoded.id.email;
      req.query.userId = String(decoded.id.id);
      req.query.token = token;
      next();
    }
  } catch (error) {
    next(error);
  }
};

// Hash a value using bcrypt
export const hash = (value:string) => {
  const hashedValue = bcrypt.hash(value, 12);
  return hashedValue;
};

// Compare a value with a previously hashed value
export const compare = (value:string, compareValue:string) => {
  const matchedValue = bcrypt.compare(value, compareValue);
  return matchedValue;
};

// Generate a random 6-digit OTP (One-Time Password)
export const generateOTP = () => {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp.toString();
};

// This function sends a POST request to LinkedIn's API to exchange the authorization code for an access token.
export const getLinkedinAccessToken = async(code:string) => {
  // Send a POST request to LinkedIn's access token endpoint with the provided authorization code.
  const tokenResponse = await axios.post(
    'https://www.linkedin.com/oauth/v2/accessToken',
    `grant_type=authorization_code&code=${code}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&scope=openid%20profile%20email%20r_liteprofile`,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );
  return tokenResponse;
};

// This function sends a GET request to LinkedIn's API to retrieve user data based on the provided access token.
export const getUserByLinkedin = async(accessToken:string) => {
  // Send a GET request to LinkedIn's API to fetch user data including their ID, first name, last name, and profile picture.
  const userDataResponse = await axios.get(
    'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return userDataResponse;
};

// This function sends a GET request to LinkedIn's API to retrieve the user's email address based on the provided access token.
export const getEmailByLinkedin = async(accessToken:string) => {
  // Send a GET request to LinkedIn's API to fetch the user's email address.
  const userEmailResponse = await axios.get(
    'https://api.linkedin.com/v2/userinfo',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return userEmailResponse;
};

// Generate a random password with 8 characters
export function generateRandomPassword() {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';

  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
}