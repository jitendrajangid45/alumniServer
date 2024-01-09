
import { NextFunction, Request, Response } from 'express';
import AuthRepository from '../services/auth.service';
import { compare, getLinkedinAccessToken, getUserByLinkedin, getEmailByLinkedin, generateOTP, hash } from '../utils/auth.util';

import { generateJWT } from '../utils/auth.util';
import { loginSchema, mainSchema, registerFormSchema } from '../utils/joi.util';
import ApiError from '../api-errors/api-error.util';
import { customResponse } from '../api-errors/api-error.controller';
import { ITempUserData, emailSchema, passwordSchema, shopRegisterSchema, verifyOtpSchema } from '../types/auth.type';
import logger from '../logger';
export default class AuthController {
  /**
   * Log in a user using their email and password.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
  static login = async(req: Request, res: Response, next: NextFunction) => {

    try {
      // 1. Log the request headers for debugging purposes.
      // 2. Validate the request body to ensure it contains a valid email and password.
      const result = await loginSchema.validateAsync(req.body);
      const { email, password, portalType } = result;

      // 3. Check if the user exists in the database.
      const user = await AuthRepository.getUserByEmail(email);

      // 4. If the user doesn't exist, return a 422 Unprocessable Entity error.
      if (!user)
        return next(
          ApiError.customError(422, 'email or password is incorrect')
        );

      if (!(portalType === 'shop')) {
        if (user && user.role === 'shop') return next(ApiError.customError(422, 'email or password is incorrect'));
      }

      if (user.loginType !== 'normal') {
        return next(ApiError.customError(403, 'Access forbidden for authenticated users'));
      }

      // 5. Compare the provided password with the user's stored password.
      const passwordMatch = await compare(password, user.password);

      // 6. If the passwords don't match, return a 422 Unprocessable Entity error.
      if (!passwordMatch)
        return next(
          ApiError.customError(422, 'email or password is incorrect')
        );

      // 7. Remove the password from the user object to avoid exposing it.
      user.password = '';

      // 8. Generate a JSON Web Token (JWT) for user authentication.
      // generating the JWT token

      const JWT = generateJWT(user);

      // 9. Return a success response with the JWT for user authentication.
      return customResponse(res, 200, JWT);
    } catch (error) {
      // 10. Handle and pass on any errors that may occur during this process.
      next(error);
    }
  };

  /**
   * Register a new user and save their information to the database.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
  static register = async(req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. data for send response.
      let data = null;
      // 2. Validate the user input against the mainSchema.
      const result = await mainSchema.validateAsync(req.body);
      // 3. Extract user registration data.
      const register = result.registerForm;

      const { email } = register;
      const foundUser = await AuthRepository.getUserByEmail(email);

      if (foundUser && foundUser.role !== 'shop') {
        return next(ApiError.customError(409, 'User already exists'));
      }
      //removing conform password before saving database
      delete register.confirmPassword;

      // 4. Hash the user's password for security.
      register.password = await hash(register.password);

      let user;

      if (foundUser) {
        await AuthRepository.updateUserDataByEmail(email, register);
        user = await AuthRepository.getUserByEmail(email);
      } else {
        // 5. Save user registration data to the database.
        user = await AuthRepository.saveUserData(register);
      }

      // 6. Check if user registration was successful.
      if (user) {
        // 7. Extract alumni or faculty educational details.
        const eduDetails = result.alumniOrFacultyInfo;
        eduDetails.user = user.id;
        // 8. Save educational details for alumni or faculty based on their role.
        const alumniOrFacultyInfo =
          user.role == 'alumni'
            ? await AuthRepository.saveEducationalDetails(eduDetails)
            : '';
        // 9. Log alumniOrFacultyInfo for debugging purposes.
        if (alumniOrFacultyInfo) {
          // 10. Extract alumni work details.
          const workDetails = result.alumniWorkDetails;
          workDetails.user = user.id;
          // 11. Save alumni work details to the database.
          await AuthRepository.saveWorkDetails(workDetails);
          // 12. Save alumni professional details to the database.
          await AuthRepository.saveProfessionalDetails(workDetails);
          // 13. Return a success response if registration is successful.
          if (user.loginType === 'linkedin') {
            // 7. Remove the password from the user object to avoid exposing it.
            user.password = '';

            // 8. Generate a JSON Web Token (JWT) for user authentication.
            // generating the JWT token
            const JWT = generateJWT(user);
            data = JWT;
          }
          // 3. Delete any existing temporary user data associated with the email.
          await AuthRepository.deleteTempUserByEmail(email);

          //sending response
          return customResponse(res, 201, data);
        }
      }
    } catch (error) {
      // 14. Handle and pass on any errors that may occur during the registration process.
      next(error);
    }
  };

  // This function handles the LinkedIn login process.
  static linkedinLogin = async(
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { code } = req.query;
      let data = null;

      // Get the access token from LinkedIn
      const linkedInAccessToken = await getLinkedinAccessToken(code as string);
      const accessToken = linkedInAccessToken.data.access_token;

      // Fetch user data from LinkedIn
      const userLinkedInData = await getUserByLinkedin(accessToken as string);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const userData = userLinkedInData.data;

      // Fetch user email from LinkedIn
      const userLinkedInEmail = await getEmailByLinkedin(accessToken as string);

      const email = userLinkedInEmail.data.email;

      // Check if the user already exists
      const checkUser = await AuthRepository.getUserByEmail(email);

      if (checkUser) {
        //check if the user login with linkedin
        if (checkUser?.loginType !== 'linkedin') {
          return next(
            ApiError.customError(
              403,
              'Access forbidden for authenticated users'
            )
          );
        }

        // if user exist generate JWT
        checkUser.password = '';
        const JWT = generateJWT(checkUser);
        data = JWT;
      }

      const redirectUrl = checkUser ? '/pages/dashboard' : '/auth/register';

      return res.json({
        status: 200,
        data: email,
        token:data,
        redirectUrl: redirectUrl,
      });
    } catch (error) {
      next(error);
    }
  };

  static async googleLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const user = await AuthRepository.getUserByEmail(email);
      if (!user) {
        return res
          .status(200)
          .json({ status: 'redirect', data: '/auth/register' });
      }
      user.password = '';
      const JWT = generateJWT(user);
      return res
        .status(200)
        .json({ status: 'setJwt', jwt: JWT, data: '/auth/profile' });
    } catch (error) {
      next(error);
      logger.error('Error', error);
    }
  }

  /**
   * Send an OTP (One-Time Password) to a user's email for authentication.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
  static async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {

      // 1. Validate the request body to ensure it contains a valid email address.
      const result = await shopRegisterSchema.validateAsync(req.body);
      const { email, userRole } = result;

      // 2. Check if the user with the given email already exists. If so, return a 409 conflict error.
      const user = await AuthRepository.getUserByEmail(email);
      if (user && user.role !== 'shop') return next(ApiError.customError(409, 'User already exists'));

      if (user && user.role === userRole) return next(ApiError.customError(409, 'User already exists'));

      // 3. Delete any existing temporary user data associated with the email.
      await AuthRepository.deleteTempUserByEmail(email);

      // 4. Generate a new OTP (One-Time Password) and set an expiration time for it.
      const otp = generateOTP();
      const expirationTime = new Date(Date.now() + 600000);

      // 5. Save the OTP and email with an expiration time as temporary user data.
      const tempUserData: ITempUserData = { otp, email, expirationTime };
      const tempUser = await AuthRepository.saveTempUser(tempUserData);

      // 6. Return a success response with the generated OTP if the process is successful.
      if (!tempUser) {
        return next(ApiError.badRequest());
      }

      // 7. Send a Otp email to the user.

      // sending success response
      return customResponse(res, 200, 'otp send successful');

    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify an OTP (One-Time Password) sent to a user's email for authentication.
   *
   * @param {Request} req - Express request object.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
  static async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validate the request body to ensure it contains a valid email and OTP.
      const result = await verifyOtpSchema.validateAsync(req.body);
      const { email, otp } = result;

      // 2. Find the temporary user data associated with the provided email and OTP.
      const tempUser = await AuthRepository.findTempUserByEmail({ email, otp });

      // 4. Check if a valid temporary user was found. If not, return an unauthorized error.
      if (!tempUser) {
        return next(ApiError.badRequest());
      }

      // 6. If the OTP is still valid, return a success response.
      if (tempUser.expirationTime > new Date()) {
        // sending success response
        return customResponse(res, 200, 'OTP verification successful');
      } else {
        // 7. If the OTP has expired, return an unauthorized error.
        return next(ApiError.customError(419, 'OTP has expired'));
      }
    } catch (error) {
      // 8. Handle and pass on any errors that may occur during this process.
      next(error);
    }
  }

  /**
   * Initiate the password reset process by sending a password reset link to the user's email.
   *
   * @param {Request} req - Express request object containing the user's email.
   * @param {Response} res - Express response object.
   * @param {NextFunction} next - Express next middleware function.
   */
  static async forgetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validate the request body to ensure it contains a valid email.
      const result = await shopRegisterSchema.validateAsync(req.body);
      const { email, userRole } = result;

      // 2. Check if the user exists.
      const user = await AuthRepository.getUserByEmail(email);

      if (!user) {
        // 3. Return an error response if the email is not found.
        return next(ApiError.notFound());
      }

      if (userRole === 'alumni' && user.role === 'shop') {
        return next(ApiError.notFound());
      }

      // 4. Remove the password from the user object to avoid exposing it.
      user.password = '';
      user.resetPasswordToken = '';

      // 5. Generate a password reset token (JWT).
      const JWT = generateJWT(user, '900s'); // 900 seconds for 15 minutes.

      user.resetPasswordToken = JWT;
      const saveUser = await AuthRepository.saveUserData(user);

      let clientBaseUrl;
      if (userRole === 'shop') {
        clientBaseUrl = process.env.clientUrlShop;
      } else {
        clientBaseUrl = process.env.clientUrl;
      }
      if (saveUser) {
        // 6. Construct the password reset link.
        const url = `${clientBaseUrl}/auth/set-password/${JWT}`;

        logger.info(url);

        // 7. Send Email a password reset email to the user.
        // Example: sendPasswordResetEmail(user.email, url);

        // 8. Return a success response.
        return customResponse(res, 200, 'A password reset link has been sent to your email address. Please check your inbox.');
      }
    } catch (error) {
      // 9. Handle and pass on any errors that may occur during this process.
      next(error);
    }
  }

  /**
   * Set a new password for a user based on a valid email and a password reset link to the user's email.
   */

  static async setPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Validate the request body to ensure it contains a valid email and OTP.
      const result = await emailSchema.validateAsync({
        email: req.query.email,
      });
      const { email } = result;

      // 2. Validate the new password from the request body.
      const { password } = await passwordSchema.validateAsync(req.body);

      // 3. Hash the new password for security.
      const hashPassword = await hash(password);

      // 4. Check if the user exists and the provided token matches.
      const user = await AuthRepository.getUserByEmail(email);

      if (user && user.resetPasswordToken == req.query.token) {
        // 5. Update the user's password and reset the token.
        user.password = hashPassword;
        user.resetPasswordToken = '';

        // 6. Save the updated user data.
        const saveUser = await AuthRepository.saveUserData(user);

        if (!saveUser) {
          // 7. Handle a bad request if the user data couldn't be saved.
          return next(ApiError.badRequest());
        }

        // 8. Password update was successful.
        return customResponse(res, 200, 'Your password has been successfully updated.');
      } else {
        // 9. If the user or token is not found, return a "not found" error.
        return next(ApiError.notFound());
      }
    } catch (error) {
      // 10. Handle and pass on any errors that may occur during this process.
      next(error);
    }
  }

  /**
   * verifying token
   */
  static async isTokenValid(req: Request, res: Response, next: NextFunction) {
    // Extract email and token from the query parameters.
    const email = req.query.email as string;
    const token = req.query.token;

    // 1. Check if the user exists in the database.
    const user = await AuthRepository.getUserByEmail(email);

    // 2. If a valid token and user exist, it's a valid token.
    if (token && user && user.resetPasswordToken == token) {
      // Return a success response with a message.
      return customResponse(res, 200, 'Valid token');

    }

    // 3. If no valid token or user, return a "not found" error response.
    return next(ApiError.notFound());
  }

  // A function for implementing role-based route access
  static async roleBasedRouteAccess(req: Request, res: Response, next: NextFunction) {
    try {
    // Log the message indicating role-based route access and include the request query
      logger.log('Role-based route access', req.query);

      // Assume that the route access is granted, and return a success response
      return customResponse(res, 200, 'Access granted');

    } catch (error) {
    // If an error occurs, pass it to the error-handling middleware
      next(error);
    }
  }

  /**
   * @author : Shani Maurya
   * @description : Route for Shop Auth API.
   */

  static async registerInShop(req: Request, res: Response, next: NextFunction) {
    try {
      // Log the message indicating role-based route access and include the request query

      // 2. Validate the user input against the mainSchema.
      const result = await registerFormSchema.validateAsync(req.body);

      //3. removing conform password before saving database
      delete result.confirmPassword;

      // 4. Hash the user's password for security.
      result.password = await hash(result.password);

      // 5. Save user registration data to the database.
      await AuthRepository.saveUserData(result);

      // 3. Delete any existing temporary user data associated with the email.
      await AuthRepository.deleteTempUserByEmail(result.email);

      // 6 Assume that the route access is granted, and return a success response
      return customResponse(res, 201, 'User Created Success');
    } catch (error) {
      // If an error occurs, pass it to the error-handling middleware
      next(error);
    }
  }
}