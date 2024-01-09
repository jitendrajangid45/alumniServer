import { NextFunction, Request, Response } from 'express';
import DashBoardRepository from '../services/adminDashboard.service';


export default class DashBoardController {

  static getAlumniCount = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const getCount = await DashBoardRepository.getAlumniCount();

      return res.json({ status:200, data:getCount });
    } catch (error) {
      next(error);
    }
  };

  static getJobBoardCount = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.query.userId as string, 10);

      const getCount = await DashBoardRepository.getJobBoardCount(userId as number);

      return res.json({ status:200, data:getCount });
    } catch (error) {
      next(error);
    }
  };

  static getEventsCount = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const getCount = await DashBoardRepository.getEventsCount();

      return res.json({ status:200, data:getCount });
    } catch (error) {
      next(error);
    }
  };

  static getCollegeBatchCount = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const getCount = await DashBoardRepository.CollegeBatchCount();

      return res.json({ status:200, data:getCount });
    } catch (error) {
      next(error);
    }
  };

  static getPostNewsCount = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const getCount = await DashBoardRepository.getPostNewsCount();
      return res.json({ status:200, data:getCount });
    } catch (error) {
      next(error);
    }
  };
}