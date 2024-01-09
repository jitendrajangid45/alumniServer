import { Router } from 'express';
import AuthController from '../controllers/auth.controller';
import { verifyJWT } from '../utils/auth.util';

/**
 * Set up the routes for user authentication and registration.
 *
 * This router defines the following routes:
 * - POST /login: Log in a user.
 * - POST /register: Register a new user.
 * - POST /googleLogin: Log in using Google (Assuming it's related to authentication with Google).
 * - POST /sendOtp: Send a one-time password (OTP) for authentication.
 * - POST /verifyOtp: Verify an OTP for authentication.
 * - POST /forgetPassword: send URL on email to forget password.
 * - POST /setPassword: setting new password to user.
 * - get /isTokenValid: checking is token valid.
*/
/**
 * @author : Shani Maurya
 * @description : Authentication
 */
/** Initializing Router */
const router = Router();

router.post('/login', AuthController.login);

router.post('/register', AuthController.register);

router.post('/googleLogin', AuthController.googleLogin);

router.post('/sendOtp', AuthController.sendOtp);

router.post('/verifyOtp', AuthController.verifyOtp);

router.post('/forgetPassword', AuthController.forgetPassword);

router.post('/setPassword', verifyJWT, AuthController.setPassword);

router.get('/isTokenValid', verifyJWT, AuthController.isTokenValid);

router.get('/roleBasedRouteAccess', AuthController.roleBasedRouteAccess);

/**
 * @author : Karthik Ganesan
 * @description : Route for LinkedIn login.
 * @method : GET
 * @endpoint : /api/auth/linkedinLogin
 */
router.get('/linkedinLogin', AuthController.linkedinLogin);

router.post('/registerInShop', AuthController.registerInShop);

export default router;
