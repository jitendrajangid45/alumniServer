import { NextFunction, Request, Response } from 'express';
import batchesRepository from '../services/batch.service';
import ApiSuccess from '../api-errors/api-success-util';
import ApiError from '../api-errors/api-error.util';
import { customResponse } from '../api-errors/api-error.controller';



export default class BatchController {
  static async addBatch(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = parseInt(req.query.userId as string, 10);
      const { collegeCode, courseName, batchYear, batchId } = req.body;
      const findBatch = await batchesRepository.findBatch(collegeCode, courseName, batchYear);
      if (findBatch.length == 0 && (batchId == undefined || batchId == null || batchId == '') ) {
        const batchData = {
          collegeId:collegeCode,
          batchName:'Batch of ' + courseName + ',' + batchYear,
          courseName:courseName,
          batchYear:batchYear,
          userId:userId
        };
        await batchesRepository.saveBatch(batchData);
        return next(ApiSuccess.customSuccessResponse(201, 'success'));
      } else {
        return next(ApiSuccess.customSuccessResponse(200, 'Already exist'));
      }

    } catch (error) {
      next(error);

    }

  }
  static async getBatches(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const collegeId = parseInt(req.query.collegeCode as string, 10);
      const search = req.query.search;
      const getBatches = await batchesRepository.getBatches(collegeId, search as string);
      return next(ApiSuccess.customSuccessResponse(200, getBatches));
    }
    catch (error) {
      next(error);
    }
  }


  static async getYearwiseBatches(req:Request, res:Response, next:NextFunction):Promise<void> {
    try {
      const batchYear = parseInt(req.query.batchYear as string, 10);
      const batches = await batchesRepository.getYearwiseBatches(batchYear as number);
      if (batches) return next(ApiSuccess.customSuccessResponse(200, batches));

    }
    catch (error) {
      next(error);
    }
  }
  static async getCollegeByName(req:Request, res:Response, next:NextFunction):Promise<void> {
    try {
      const collegeCode = parseInt(req.query.college_code as string, 10);
      const getCollegeByName = await batchesRepository.getCollegeByName(collegeCode);
      return next(ApiSuccess.customSuccessResponse(200, getCollegeByName));
    }
    catch (error) {
      next(error);
    }
  }

  static async getAllBatches(req:Request, res:Response, next:NextFunction) {
    try {
      const batches = await batchesRepository.getAllBatches();

      if (!batches) {
        next(ApiError.notFound());
      }

      return customResponse(res, 200, batches);
    } catch (error) {
      next(error);
    }
  }

  static async getBatchStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const batchId = parseInt(req.query.batchId as string, 10);
      const searchText = req.query.searchText;
      const getStudents = await batchesRepository.getBatchStudents(batchId, searchText as string);
      if (getStudents) return next(ApiSuccess.customSuccessResponse(200, getStudents));

    } catch (err) {
      next(err);
    }
  }

  static async getBatchData(req: Request, res: Response, next: NextFunction) {
    try {

      const batchDetails = await batchesRepository.getBatchDetails();

      return res.json({ status:200, data:batchDetails });

    } catch (error) {
      next(error);
    }
  }
}