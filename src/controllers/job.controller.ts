import { NextFunction, Request, Response } from 'express';
import { postJobSchema, postResumeSchema } from '../utils/joi.util';
import JobRepository from '../services/job.service';
import ApiError from '../api-errors/api-error.util';
import ApiSuccess from '../api-errors/api-success-util';
import { Reference } from '../models/jobSeeker.models';
import moment from 'moment';
import { Job } from '../models/Jobs.model';
import { ApplicationStatus } from '../models/jobApplicants.models';
import EventRepository from '../services/event.service';

interface JobDetailsOthers {
  total: number;
  jobDetails?: Job[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postedJobDetails?: any[];
}
interface JobDetailsSelf {
  totalCount: number;
  jobData?: Job[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postedJobDetails?: any[];
}
export default class JobController {

  // This function handles the creation of a job using data from the request.
  static postJob = async(req: Request, res: Response, next: NextFunction) => {
    try {

      const jobData = JSON.parse(req.body.data); // Parse the JSON data from the request body.
      jobData.filePath = req.body?.newFileName; // Add the new file path and user information to the job data.
      jobData.user = req.query.userId;
      jobData.jobType = req.body.dest;

      // Validate the job data against a predefined schema.
      const result = await postJobSchema.validateAsync(jobData);

      const postJob = await JobRepository.createJob(result);

      // If an error occurs during creating a Job, return a 500 error.
      if (!postJob) return next(ApiError.customError(500, 'Error occurred while Creating a job'));

      return next(ApiSuccess.customSuccessResponse(200, 'Success')); //success response
    } catch (error) {
      next(error);
    }
  };

  // This function handles the retrieval of job details based on the provided search criteria.
  static getJob = async(req: Request, res:Response, next: NextFunction) => {
    try {
      const { globalSearch, page, isVerified } = req.query;
      const limit = 6;
      const offset = (parseInt(page as string, 10) - 1) * limit;
      const userId = parseInt(req.query.userId as string, 10);
      const verified = parseInt(isVerified as string, 10);

      const getCollegeAndBatch = await EventRepository.getCollegeBatchData(userId as number);

      const { batchName, collegeName } = getCollegeAndBatch;

      const jobDetails:JobDetailsOthers = await JobRepository.getJobDetails(globalSearch as string, limit as number, offset as number, userId as number, verified as number, batchName as string, collegeName as string, 'All' as string );

      const data = jobDetails.jobDetails;
      const postedJobDetails = data?.map((Job) => {
        const createdAt = Job.createdAt;
        const timeAgo = moment(createdAt).fromNow(); // Calculate the time difference
        return {
          ...Job,
          timeAgo,
        };
      });
      delete jobDetails.jobDetails;
      jobDetails.postedJobDetails = postedJobDetails;

      if (jobDetails) return next(ApiSuccess.customSuccessResponse(200, jobDetails));

      return next(ApiError.customError(400, 'An error occurred while getting job details'));

    } catch (error) {
      next(error);
    }
  };

  // This function handles the retrieval of job details based on the provided search criteria admin side.
  static getAllJob = async(req: Request, res:Response, next: NextFunction) => {
    try {
      const { globalSearch, page, isVerified } = req.query;
      const limit = 6;
      const offset = (parseInt(page as string, 10) - 1) * limit;
      const userId = parseInt(req.query.userId as string, 10);
      const verified = parseInt(isVerified as string, 10);

      const jobDetails:JobDetailsOthers = await JobRepository.getAllJobDetails(globalSearch as string, limit as number, offset as number, userId as number, verified as number);

      const data = jobDetails.jobDetails;
      const postedJobDetails = data?.map((Job) => {
        const createdAt = Job.createdAt;
        const timeAgo = moment(createdAt).fromNow(); // Calculate the time difference
        return {
          ...Job,
          timeAgo,
        };
      });
      delete jobDetails.jobDetails;
      jobDetails.postedJobDetails = postedJobDetails;

      if (jobDetails) return next(ApiSuccess.customSuccessResponse(200, jobDetails));

      return next(ApiError.customError(400, 'An error occurred while getting job details'));

    } catch (error) {
      next(error);
    }
  };

  // This function handles the job application process for a user. It checks if the user's resume exists
  static applyForJob = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const userId = parseInt(req.query.userId as string, 10);
      const jobId = req.body.job_id;

      const reference = req.body.reference;
      const resumeData = await JobRepository.getResume(userId, reference);
      if (!resumeData) return res.json({
        code: 404,
        error: `Your ${reference} resume was not found. Please upload resume before applying for the job.`,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { jobApplicantId, deletedAt, updatedAt, createdAt, ...finalData } = resumeData; // Destructure the resume data, excluding some unnecessary fields.

      const applicantData = { ...finalData, job: jobId as number, user: userId as number }; // Added userId and jobId in the applicantData object

      const createJobApplicant = await JobRepository.createApplicant(applicantData);

      // If an error occurs during creating a applicant, return a 500 error.
      if (!createJobApplicant) return next(ApiError.customError(500, 'Error occurred while Applying for the job'));

      return next(ApiSuccess.customSuccessResponse(200, reference)); //success response

    } catch (error) {
      next(error);
    }
  };

  // This function handles the retrieval of job details posted by a specific user based on search criteria. self
  static getUserJob = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const { searchText, page } = req.query;
      const limit = 6;
      const offset = (parseInt(page as string, 10) - 1) * limit;
      const userId = parseInt(req.query.userId as string, 10);

      const getPostedJobDetails:JobDetailsSelf = await JobRepository.getJobByUser(searchText as string, limit as number, offset as number, userId as number);
      const data = getPostedJobDetails.jobData;
      const postedJobDetails = data?.map((Job) => {
        const createdAt = Job.createdAt;
        const timeAgo = moment(createdAt).fromNow(); // Calculate the time difference
        return {
          ...Job,
          timeAgo,
        };
      });
      delete getPostedJobDetails.jobData;
      getPostedJobDetails.postedJobDetails = postedJobDetails;
      if (getPostedJobDetails) return next(ApiSuccess.customSuccessResponse(200, getPostedJobDetails));

      return next(ApiError.customError(400, 'An error occurred while getting job details'));
    } catch (error) {
      next(error);
    }
  };

  // This function handles the retrieval of job seeker details based on search criteria.
  static getJobSeeker = async(req:Request, res:Response, next:NextFunction) => {
    try {
      const { searchText, page } = req.query;
      const limit = 6;
      const offset = (parseInt(page as string, 10) - 1) * limit;
      const userId = parseInt(req.query.userId as string, 10);
      const jobSeekerDetails = await JobRepository.getJobSeekerData(searchText as string, limit as number, offset as number, userId as number);

      if (jobSeekerDetails) return next(ApiSuccess.customSuccessResponse(200, jobSeekerDetails));

      return next(ApiError.customError(400, 'An error occurred while getting job details'));
    } catch (error) {
      next(error);
    }
  };

  // This function handles the submission of a resume. It expects a JSON payload with resume data
  static postResume = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const resumeData = JSON.parse(req.body.data);
      resumeData.applicantResumePath = req.body.newFileName;
      resumeData.user = parseInt(req.query.userId as string, 10);

      const findResume = await JobRepository.findResume(resumeData.user as number, resumeData.reference as Reference);

      if (findResume) {
        if (resumeData.applicantResumePath === undefined) resumeData.applicantResumePath = findResume.applicantResumePath;

        const updateResume = await JobRepository.updateResume(resumeData.user as number, resumeData.reference as Reference, resumeData);

        // If an error occurs during creating a applicant, return a 500 error.
        if (!updateResume) return next(ApiError.customError(500, 'Error occurred while Updating the Resume'));

      } else {
        const result = await postResumeSchema.validateAsync(resumeData);

        const postResume = await JobRepository.createResume(result);

        // If an error occurs during creating a applicant, return a 500 error.
        if (!postResume) return next(ApiError.customError(500, 'Error occurred while Submitting the Resume'));

      }

      return next(ApiSuccess.customSuccessResponse(200, 'Success')); //success response
    } catch (error) {
      next(error);
    }
  };

  // This function handles the retrieval of job data for applied jobs based on search criteria.
  static getAppliedJobData = async(req:Request, res: Response, next: NextFunction) => {
    try {
      const { job_id, page, searchText } = req.query;

      const limit = 6;
      const offset = (parseInt(page as string, 10) - 1) * limit;

      const jobAppliedData = await JobRepository.getJobAppliedData(job_id as string, searchText as string, limit as number, offset as number);

      if (jobAppliedData) return next(ApiSuccess.customSuccessResponse(200, jobAppliedData));

    } catch (error) {
      next(error);
    }

  };

  // This function retrieves job application data for a specific job, both by the user and their friends.
  static getUserAppliedJob = async(req:Request, res: Response, next: NextFunction) => {
    try {
      const { job_id } = req.query;
      const jobId = parseInt(job_id as string, 10);
      const reference = 'user';
      const userId = parseInt(req.query.userId as string, 10);

      const getUserAppliedJobByUser = await JobRepository.getUserAppliedData(jobId as number, reference as Reference, userId as number);
      const referenceFriend = 'friend';
      const getUserAppliedJobByFriend = await JobRepository.getUserAppliedData(jobId as number, referenceFriend as Reference, userId as number);
      if (getUserAppliedJobByUser || getUserAppliedJobByFriend) return next(ApiSuccess.customSuccessResponse(200, { getUserAppliedJobByUser, getUserAppliedJobByFriend }));
    } catch (error) {
      next(error);
    }
  };

  //This function retrieves Resume Data of alumni and friends of the alumni.
  static getResumeData = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.query.userId as string, 10);
      const reference = 'user';
      const resumeData = await JobRepository.getResume(userId as number, reference as Reference);
      const referenceFriend = 'friend';
      const resumeDataFriend = await JobRepository.getResume(userId as number, referenceFriend as Reference);

      if (resumeData || resumeDataFriend) return next(ApiSuccess.customSuccessResponse(200, { resumeData, resumeDataFriend }));
    } catch (error) {
      next(error);
    }
  };

  //This function delete the job Data using JobId.
  static deleteJobData = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = parseInt(req.query.jobId as string, 10);

      await JobRepository.deleteJobApplicant(jobId as number);

      const deleteJobDetails = await JobRepository.deleteJobs(jobId as number);

      if (deleteJobDetails) return next(ApiSuccess.customSuccessResponse(200, 'Success'));
    } catch (error) {
      next(error);
    }
  };

  //This function delete the Resume file Name.
  static deleteResumeFile = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.query.userId as string, 10);
      const reference = req.query.reference;

      const deleteFileName = await JobRepository.deleteFileName(userId as number, reference as Reference);

      if (deleteFileName) return next(ApiSuccess.customSuccessResponse(200, 'Success'));

    } catch (error) {
      next(error);
    }
  };

  //get alumni applied job data with pagination
  static getAlumniAppliedJobData = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.query.userId as string, 10);
      const { searchText, page } = req.query;
      const limit = 6 ;
      const offset = (parseInt(page as string, 10) - 1) * limit;
      const getAlumniJobData = await JobRepository.getAlumniAppliedJob(userId as number, searchText as string, limit as number, offset as number);

      return res.json({ status:200, data:getAlumniJobData });
    } catch (error) {
      next(error);
    }
  };

  //updating the status of applicant applied job status.
  static updateApplicationStatus = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, jobApplicantId } = req.body;

      const updateStatus = await JobRepository.updateApplicationStatus(status as ApplicationStatus, jobApplicantId as number);

      return res.json({ status: 200, message: 'successfully Updated!', data:updateStatus });

    } catch (error) {
      next(error);
    }
  };

  static getStatisticDetails = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.query.userId as string, 10);
      const statisticData = await JobRepository.getStatisticData(userId);

      return res.json({ data: statisticData, status:200 });

    } catch (error) {
      next(error);
    }
  };

  static verifyJob = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const jobId = parseInt(req.body.jobId as string, 10);
      await JobRepository.verifyJob(jobId);
      return res.json({
        status: 200,
        data: 'This Job has been verified successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}

