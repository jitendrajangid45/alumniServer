// Import necessary dependencies and entity models

// Import the Connection object for database access
import { Connection } from '../data-source';

// Import entity models representing database tables
import { EducationalDetails } from '../models/EducationalDetails.model';
import { ProfessionalDetails } from '../models/ProfessionalDetails.model';
import { WorkingDetails } from '../models/WorkingDetails.model';
import { User } from '../models/user.model';
import { emailOTPVerification } from '../models/emailOTPVerification.model';
import { ITempUserData } from '../types/auth.type';

// Get repositories for each entity
const userRepository = Connection.getRepository(User);
const professionalDetailsRepository = Connection.getRepository(ProfessionalDetails);
const workDetailsRepository = Connection.getRepository(WorkingDetails);
const educationalDetailsRepository = Connection.getRepository(EducationalDetails);
const emailOTPVerificationRepository = Connection.getRepository(emailOTPVerification);

// Define a class for authentication-related database operations
export default class AuthRepository {
  // Retrieve a user by their email
  static getUserByEmail = (email: string) => {
    return userRepository.findOneBy({ email });
  };

  // Save user data
  static saveUserData = (data: User) => {
    return userRepository.save(data);
  };

  // update user data by email
  static updateUserDataByEmail = (email: string, data: User) => {
    return userRepository.update({ email:email }, data);
  };

  // Save professional details
  static saveProfessionalDetails = (data: ProfessionalDetails) => {
    return professionalDetailsRepository.save(data);
  };

  // Save educational details
  static saveEducationalDetails = (data: EducationalDetails) => {
    return educationalDetailsRepository.save(data);
  };

  // Save work details
  static saveWorkDetails = (data: WorkingDetails) => {
    return workDetailsRepository.save(data);
  };

  // Create a new user
  static createUser = (data: User) => {
    return userRepository.save(data);
  };

  // Save temporary user data
  static async saveTempUser(data: ITempUserData) {
    return emailOTPVerificationRepository.save(data);
  }

  // Update temporary user data by email
  static updateTempUserByEmail(email: string) {
    return emailOTPVerificationRepository.update({ email:email }, { otp:'888888' });
  }

  // Delete temporary user data by email
  static deleteTempUserByEmail(email: string) {
    return emailOTPVerificationRepository.delete({ email:email });
  }

  // find temporary user data by email
  static findTempUserByEmail(data: {email:string, otp?:string}) {
    return emailOTPVerificationRepository.findOneBy(data);
  }

  //update user password
  static updateUserPassword(email: string, password: string) {
    return userRepository.update({ email }, { password });
  }
}
