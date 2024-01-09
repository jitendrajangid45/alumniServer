import { NextFunction, Request, Response } from 'express';
import UserRepository from '../services/user.service';
import ApiSuccess from '../api-errors/api-success-util';
import { Connection } from '../data-source';
import { User } from '../models/user.model';
import ApiError from '../api-errors/api-error.util';
import { userDetailsScheme } from '../utils/joi.util';
import collegeRepository from '../services/college.service';
import { customResponse } from '../api-errors/api-error.controller';
import userRepository from '../services/user.service';
const userConnection = Connection.getRepository(User);

class UserController {

  async getUpcomingBirthdays(req: Request, res: Response): Promise<void> {
    try {
      const upcomingBirthdays = await UserRepository.getUpcomingBirthdays();
      res.json({ status: 200, data: upcomingBirthdays });
    } catch (error) {
      res.json({ status: 400, msg: 'Internal server error' });
    }
  }
  async getUserDetails(req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
      let userId;
      if (req.query.type === 'other') {
        userId = parseInt(req.query.user_id as string, 10);
      } else {
        userId = parseInt(req.query.userId as string, 10);
      }
      const users = await userConnection.findOne({ where:{ id:userId } });
      if (users) {
        const user = await UserRepository.getUserDetails(userId);
        return next(ApiSuccess.customSuccessResponse(200, user));
      } else {
        return next(ApiError.customError(404, 'User not found'));
      }
    } catch (error) {
      next(error);
    }
  }
  async getAllUser(req:Request, res:Response, next:NextFunction):Promise<void> {
    try {
      const userId = parseInt(req.query.userId as string, 10);
      const inputValues = req.query.inputValues;
      const users = await UserRepository.getAllUsers(userId, inputValues as string);
      return next(ApiSuccess.customSuccessResponse(200, users));

    } catch (error) {
      next(error);
    }
  }
  async getAllUsers(req:Request, res:Response): Promise<void> {
    try {
      const { searchQuery, sender_id } = req.query;
      const u = await UserRepository.getAllUser(String(searchQuery));
      let user = JSON.stringify(u);
      const usermessage = await UserRepository.getAllUserMsg(user, Number(sender_id));
      user = JSON.stringify(usermessage);
      res.json({ status:200, 'data':user });
    } catch (error) {
      console.log('error', error);
      res.json({ status:400, 'msg':'internal server error' });
    }
  }


  async getUserById(req:Request, res:Response, next:NextFunction):Promise<void> {
    try {
      const userId = parseInt(req.query.userId as string, 10);
      const getUser = await UserRepository.getUserById(userId);
      return next(ApiSuccess.customSuccessResponse(200, getUser));

    } catch (err) {
      next(err);
    }
  }

  async uploadPic(req:Request, res:Response, next:NextFunction) {
    try {
      const userId = parseInt(req.query.userId as string, 10);
      const profilePic = req.body.newFileName;
      await UserRepository.saveProfilePic(profilePic as string, userId as number);

      return res.json({
        status:200,
        message:'success'
      });
    } catch (error) {
      next(error);
    }

  }

  async saveUserDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const userId = parseInt(req.query.userId as string, 10);
    const saveUser = {
      id: userId,
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middleName: req.body.middleName,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
    };
    const saveUserDetail = {
      detailsId: req.body.detailsId,
      homeTown: req.body.homeTown,
      bloodGroup: req.body.bloodGroup,
      address: req.body.address,
      location: req.body.location,
      postalCode: req.body.postalCode,
      mobileNo: req.body.mobileNo,
      countryCode: req.body.countryCode,
      currentCity: req.body.currentCity,
      homePhone: req.body.homePhone,
      workPhone: req.body.workPhone,
      alternateEmail: req.body.alternateEmail,
      websitePortfolioBlog: req.body.websitePortfolioBlog,
      facebookProfile: req.body.facebookProfile,
      linkedinProfile: req.body.linkedinProfile,
      youtubeChannel: req.body.youtubeChannel,
      instagramProfile: req.body.instagramProfile,
      twitterProfile: req.body.twitterProfile,
      relationshipStatus: req.body.relationshipStatus,
      aboutMe: req.body.aboutMe,
      user: userId,
    };
    await UserRepository.updateUser(saveUser);
    const detailsId = req.body.detailsId;
    const userDetail = await userDetailsScheme.validateAsync(saveUserDetail);
    if (detailsId === undefined) {
      await UserRepository.saveUserDetails(userDetail);
      return next(
        ApiSuccess.customSuccessResponse(200, 'User details save successfully')
      );
    } else {
      await UserRepository.updateUserDetails(userDetail);
      return next(
        ApiSuccess.customSuccessResponse(
          200,
          'User details updated successfully'
        )
      );
    }
  }

  async getColleges(req:Request, res:Response, next:NextFunction) {
    try {
      const colleges = await collegeRepository.getColleges();

      if (!colleges) {
        next(ApiError.notFound());
      }

      return customResponse(res, 200, colleges);
    } catch (err) {
      next(err);
    }
  }

  async getCollegeCourses(req:Request, res:Response, next:NextFunction) {
    try {
      const collegeCode = parseInt(req.query.collegeCode as string, 10);
      const courses = await collegeRepository.getCollegeCourses(collegeCode);

      if (!courses) return next(ApiError.notFound());

      return customResponse(res, 200, courses);
    } catch (err) {
      next(err);
    }
  }

  // getProfileData function to get data of profile details.
  async getProfileData(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = parseInt(req.query.userId as string, 10);
      const profileData = await userRepository.getProfileData(userId as number);

      return res.json({
        data:profileData,
        status:200
      });
    } catch (err) {
      next(err);
    }
  }
}



export const userController = new UserController();
