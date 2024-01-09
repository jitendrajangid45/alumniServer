import { NextFunction, Request, Response } from 'express';
import ProfessionalRepository from '../services/professional.service';
import ApiSuccess from '../api-errors/api-success-util';


export default class ProfessionalController {

  static async addWorkingDetails(req:Request, res:Response, next:NextFunction):Promise<void> {
    try {
      const workDetails = req.body;
      workDetails.user = parseInt(req.query.userId as string, 10);
      if (req.body.workId !== undefined || null) {
        const updateWorkingDetails = await ProfessionalRepository.updateWorkingDetails(req.body);
        if (updateWorkingDetails.affected != 0) {
          return next(ApiSuccess.customSuccessResponse(201, 'updated Successfully'));
        }
        else {
          return next(ApiSuccess.customSuccessResponse(500, 'Error while updating'));
        }
      } else {

        const saveWorkingDetails = await ProfessionalRepository.saveWorkingDetails(workDetails);
        if (saveWorkingDetails) return next(ApiSuccess.customSuccessResponse(200, 'Working Details saved Successfully'));
      }
    } catch (error) {
      next(error);
    }
  }
  static async getProfessionalDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let userId;
      if (req.query.type === 'other') {
        userId = parseInt(req.query.user_id as string, 10);
      } else {
        userId = parseInt(req.query.userId as string, 10);
      }
      const getWorkingDetails = await ProfessionalRepository.getWorkingDetails(userId);
      // if (getWorkingDetails!==null) {
      //   const calculatedExp = getWorkingDetails;
      //   let totalExperience = 0;
      //   let total1: number = 0;
      //   let total2: number = 0;
      //   let experience;
      // Calculate experience in years for each object and add to totalExperience
      //   calculatedExp.forEach((entry) => {
      //     if (entry.joiningYear && entry.leavingYear) {
      //       const joiningYear = new Date(entry.joiningYear); // Assuming month is zero-indexed
      //       const leavingYear = new Date(entry.leavingYear);

      //       const yearDifference = leavingYear.getFullYear() - joiningYear.getFullYear();
      //       const monthDifference = leavingYear.getMonth() - joiningYear.getMonth();
      //       const totalMonths = yearDifference * 12 + monthDifference;

      //       experience = totalMonths / 12; // Experience in years with decimals
      //       total1 += experience;
      //     } else {
      //       experience = null;
      //     }


      //     if (entry.joiningYear && !entry.leavingYear) {
      //       const joiningYear = new Date(entry.joiningYear);
      //       const currentDate = new Date();

      //       // Calculate the difference in milliseconds between dates
      //       const joiningDateToNowMilliseconds = currentDate.getTime() - joiningYear.getTime();

      //       // Calculate the difference in years
      //       const millisecondsInYear = 1000 * 60 * 60 * 24 * 365; // Approximate number of milliseconds in a year
      //       const joiningDateToNowYears = joiningDateToNowMilliseconds / millisecondsInYear;

      //       // Round the experience to the nearest whole number
      //       const experience = Math.round(joiningDateToNowYears);

      //       total2 += experience;
      //     }

      //   });
      //   totalExperience = total1 + total2;
      //   const workingData = {
      //     overallWorkExperience: totalExperience,
      //     user: userId,
      //   };
      //   const experienceData=req.body
      //   const search=await workingRepository.getOverAllExperience(userId)

      //   const updatedExperience={profId:search[0].profId,
      //     overallWorkExperience: totalExperience,
      //     professionalSkills:search[0].professionalSkills,
      //     industriesWorkIn:search[0].industriesWorkIn,
      //     roles:search[0].roles
      //   }
      //   if(search?.length == 0){
      //   const saveOverAllExperience=workingRepository.saveOverAllExperience(workingData);
      //     }else{
      //        const updateOverAllExperience=workingRepository.updateExperience(updatedExperience)
      //     }
      //  }
      return next(ApiSuccess.customSuccessResponse(200, getWorkingDetails));
    } catch (error) {
      next(error);
    }
  }

  static async updateOverAllExperience(req:Request, res:Response, next:NextFunction):Promise<void> {
    const experienceDetails = await ProfessionalRepository.updateExperience(req.body);
    if (experienceDetails) return next(ApiSuccess.customSuccessResponse(200, experienceDetails));
  }

  // static async saveOverAllExperience(req:Request,res:Response,next:NextFunction):Promise<void>{
  //   const userId=req.body.profId
  //   const overAllExperience=req.body
  //   const findUser=await ProfessionalRepository.findOverAllExperience(userId)
  //   if(findUser.length==0){
  //     const saveOverAllExperience=ProfessionalRepository.saveOverAllExperience(overAllExperience)
  //     return next(ApiSuccess.customSuccessResponse(200,saveOverAllExperience))
  //   }
  //   else{
  //      const experienceDetails=ProfessionalRepository.updateExperience(overAllExperience)
  //      return next(ApiSuccess.customSuccessResponse(200,experienceDetails))
  //   }
  // }
  static async updateExperience(req:Request, res:Response, next:NextFunction):Promise<void> {
    try {
      const profDetails = req.body.profDetails;
      profDetails.user = parseInt(req.query.userId as string, 10);
      const saveOverAllExperience = ProfessionalRepository.updateExperience(profDetails);
      if (saveOverAllExperience) return next(ApiSuccess.customSuccessResponse(200, saveOverAllExperience));
    } catch (error) {
      next(error);
    }
  }
  static async getOverAllExperience(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let userId;
      if (req.query.type === 'other') {
        userId = parseInt(req.query.user_id as string, 10);
      } else {
        userId = parseInt(req.query.userId as string, 10);
      }
      const getOverAllExperience = await ProfessionalRepository.getOverAllExperience(userId);
      if (getOverAllExperience) return next(ApiSuccess.customSuccessResponse(200, getOverAllExperience));
    } catch (error) {
      next(error);
    }
  }
  static deleteWorkingDetail = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const workId = parseInt(req.query.workId as string, 10);
      const deleteWorkingDetail = await ProfessionalRepository.deleteWorkingDetail(workId as number);

      if (deleteWorkingDetail) return next(ApiSuccess.customSuccessResponse(200, 'Success'));
    } catch (error) {
      next(error);
    }
  };
}
