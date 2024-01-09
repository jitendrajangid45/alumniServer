import { NextFunction, Request, Response, } from 'express';
import EducationalRepository from '../services/educational.service';
import ApiSuccess from '../api-errors/api-success-util';

export default class EducationalController {
  static async getEducationalDetails(req: Request, res: Response, next:NextFunction): Promise<void> {
    try {
      let userId;
      if (req.query.type === 'other') {
        userId = parseInt(req.query.user_id as string, 10);
      } else {
        userId = parseInt(req.query.userId as string, 10);
      }


      const getEducationalDetails = await EducationalRepository.getEducationalDetails(userId);
      if (getEducationalDetails) return next(ApiSuccess.customSuccessResponse(200, getEducationalDetails));
    } catch (error) {
      next(error);
    }
  }
  static async saveEducationalDetails(req:Request, res:Response, next:NextFunction):Promise<void> {
    try {
      const eduDetail = req.body;
      eduDetail.user = parseInt(req.query.userId as string, 10);

      const eduId = req.body.eduId;
      if (eduId != undefined) {

        const updateEducationalDetails = await EducationalRepository.updateEducationalDetails(eduDetail);
        if (updateEducationalDetails) return next(ApiSuccess.customSuccessResponse(201, updateEducationalDetails));
      }
      else {
        const saveEducationalDetails = await EducationalRepository.saveEducationalDetails(eduDetail);
        if (saveEducationalDetails) return next(ApiSuccess.customSuccessResponse(200, saveEducationalDetails));

      }
    } catch (error) {
      next(error);
    }
  }

  static deleteEducation = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const eduId = parseInt(req.query.eduId as string, 10);
      const deleteEducation = await EducationalRepository.deleteEducation(eduId as number);
      if (deleteEducation) return next(ApiSuccess.customSuccessResponse(200, 'Success'));
    } catch (error) {
      next(error);
    }
  };
}