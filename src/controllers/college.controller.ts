import { Request, Response, NextFunction } from 'express';
import ApiSuccess from '../api-errors/api-success-util';
import { customResponse } from '../api-errors/api-error.controller';
import ApiError from '../api-errors/api-error.util';
import collegeRepository from '../services/college.service';
import { addCollegeSchema, addCourseScheme } from '../utils/joi.util';

export class CollegeController {
  static getColleges = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const colleges = await collegeRepository.getColleges();

      if (!colleges) {
        next(ApiError.notFound());
      }

      return customResponse(res, 200, colleges);
    } catch (err) {
      next(err);
    }
  };

  static getCollegeCourses = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const collegeCode = parseInt(req.query.collegeCode as string, 10);
      const getCollegeCourses = await collegeRepository.getCollegeCourses(collegeCode);
      return next(ApiSuccess.customSuccessResponse(200, getCollegeCourses));
    } catch (err) {
      next(err);
    }
  };
  static addCollege = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const collegeData = JSON.parse(req.body.data);
      collegeData.collegeLogoPath = req.body.newFileName;
      const collegeCode = parseInt(collegeData.collegeCode as string, 10);
      const collegeId = collegeData.collegeId ;
      const findCollege = await collegeRepository.findCollege(collegeCode);
      if (findCollege.length == 0 && (collegeId === null || collegeId === undefined)) {
        const collegeDetails = await addCollegeSchema.validateAsync(collegeData);
        const collegede = await collegeRepository.saveCollege(collegeDetails);
        if (collegede) return next(ApiSuccess.customSuccessResponse(201, 'College saved Successfully'));

      } else {
        const updateDetails = await collegeRepository.updateCollege(collegeData);
        if (updateDetails) return next(ApiSuccess.customSuccessResponse(200, 'College Updated Successfully'));
      }

    } catch (error) {
      next(error);
    }
  };

  static addCourse = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const collegeCode = parseInt(req.body.collegeCode as string, 10);
      const courseName = req.body.courseName;
      const courseId = req.body.courseId;
      const findCourse = await collegeRepository.findCourse(collegeCode, courseName);
      if (findCourse.length == 0 && (courseId == undefined || courseId === null)) {
        const { collegeCode, courseName } = req.body;
        const data = {
          collegeCode:collegeCode,
          courseName:courseName
        };
        const courseDetails = await addCourseScheme.validateAsync(data);
        const course = await collegeRepository.addCourse(courseDetails);
        if (course) return next(ApiSuccess.customSuccessResponse(201, 'Course saved Successfully'));
      }
      else {
        const updateCourse = await collegeRepository.updateCourse(req.body);
        if (updateCourse) return next(ApiSuccess.customSuccessResponse(200, 'Course Updated Successfully'));
      }
    } catch (error) {
      next(error);
    }
  };

  static deleteCollegeLogo = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const collegeId = parseInt(req.query.collegeId as string, 10);
      const deleteLogo = await collegeRepository.deleteCollegeLogo(collegeId as number);
      if (deleteLogo) return next(ApiSuccess.customSuccessResponse(200, 'College Logo Deleted Successfully'));
    } catch (error) {
      next(error);
    }
  };

  static deleteCourse = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const courseId = parseInt(req.query.courseId as string, 10);
      const deleteCourse = await collegeRepository.deleteCourse(courseId as number);
      if (deleteCourse) return next(ApiSuccess.customSuccessResponse(200, 'Course Deleted Successfully'));
    } catch (error) {
      next(error);
    }
  };

}

