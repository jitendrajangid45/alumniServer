import { Brackets, DeepPartial, Not } from 'typeorm';
import { Connection } from '../data-source';
import { Job } from '../models/Jobs.model';
import { JobSeeker } from '../models/jobSeeker.models';
import { Reference } from '../models/jobSeeker.models';
import { ApplicationStatus, JobApplicant } from '../models/jobApplicants.models';



const jobRepository = Connection.getRepository(Job);
const jobSeekerRepository = Connection.getRepository(JobSeeker);
const jobApplicantRepository = Connection.getRepository(JobApplicant);

export default class JobRepository {

  // This function creates a new job record in the database.
  static createJob = async(data: Job) => {
    const job = await jobRepository.save(data);
    return job;
  };

  // This function retrieves job details based on a global search string with pagination.
  // It uses search criteria to filter jobs based on skills, job titles, and job locations.
  // It accepts 'globalSearch' as the search string, 'limit' for the number of records per page, and 'offset' for pagination. others
  static getJobDetails = async(globalSearch: string, limit: number, offset: number, userId: number, isVerified: number, batchName:string, collegeName:string, All:string) => {
    const collegeBatchType: string[] = [batchName, collegeName, All];

    // Create a copy of the query builder without the limit and offset
    const countQueryBuilder = jobRepository
      .createQueryBuilder('job')
      .where('job.userId != :user', { user: userId })
      .andWhere('job.isVerified = :isVerified', { isVerified:isVerified })
      .andWhere('job.visibleTo IN (:...visible)', { visible: [collegeBatchType] })
      .andWhere(
        new Brackets((qb) => {
          qb.where('job.skills LIKE :search', { search: `%${globalSearch}%` })
            .orWhere('job.jobTitle LIKE :search', {
              search: `%${globalSearch}%`,
            })
            .orWhere('job.jobLocation LIKE :search', {
              search: `%${globalSearch}%`,
            });
        })
      );

    // Execute the count query to get the total count of records
    const total = await countQueryBuilder.getCount();

    // Create the final query with limit and offset
    const jobDetails = await countQueryBuilder
      .limit(limit)
      .offset(offset)
      .getMany();

    return { total, jobDetails };
  };

  // This function retrieves job details based on a global search string with pagination.
  // It uses search criteria to filter jobs based on skills, job titles, and job locations.
  // It accepts 'globalSearch' as the search string, 'limit' for the number of records per page, and 'offset' for pagination. others
  static getAllJobDetails = async(globalSearch: string, limit: number, offset: number, userId: number, isVerified: number) => {

    // Create a copy of the query builder without the limit and offset
    const countQueryBuilder = jobRepository
      .createQueryBuilder('job')
      .where('job.userId != :user', { user: userId })
      .andWhere('job.isVerified = :isVerified', { isVerified:isVerified })
      .andWhere(
        new Brackets((qb) => {
          qb.where('job.skills LIKE :search', { search: `%${globalSearch}%` })
            .orWhere('job.jobTitle LIKE :search', {
              search: `%${globalSearch}%`,
            })
            .orWhere('job.jobLocation LIKE :search', {
              search: `%${globalSearch}%`,
            });
        })
      );

    // Execute the count query to get the total count of records
    const total = await countQueryBuilder.getCount();

    // Create the final query with limit and offset
    const jobDetails = await countQueryBuilder
      .limit(limit)
      .offset(offset)
      .getMany();

    return { total, jobDetails };
  };

  // This function retrieves a user's resume based on their user ID and a reference (e.g., 'user' or 'friend').
  // It accepts 'user_id' as the user's ID and 'reference' as the reference for the resume.
  static getResume = (user_id: number, reference: Reference) => {
    const resume = jobSeekerRepository.findOne({
      where: { user: { id: user_id }, reference: reference },
    });
    return resume;
  };

  // This function creates a new job applicant record in the database.
  // It takes a 'data' object as a parameter, which should contain the applicant's details.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static createApplicant = (data: any) => {
    const jobApplicant = jobApplicantRepository.save(data);
    return jobApplicant;
  };

  // This function retrieves job details posted by a specific user based on search criteria, with pagination.
  // It filters jobs based on skills, job titles, job locations, and company names.
  // It accepts 'searchText' as the search string, 'limit' for the number of records per page, and 'offset' for pagination.
  static getJobByUser = async(searchText: string, limit:number, offset:number, userId:number) => {
    const user_id = userId;
    const countQueryBuilder = jobRepository
      .createQueryBuilder('job')
      .where('job.userId = :user', { user: user_id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('job.skills LIKE :search', { search: `%${searchText}%` })
            .orWhere('job.jobTitle LIKE :search', { search: `%${searchText}%` })
            .orWhere('job.jobLocation LIKE :search', {
              search: `%${searchText}%`,
            })
            .orWhere('job.companyName LIKE :search', {
              search: `%${searchText}%`,
            });
        })
      );

    // Execute the count query to get the total count of records
    const totalCount = await countQueryBuilder.getCount();

    // Create the final query with limit and offset
    const jobData = await countQueryBuilder
      .limit(limit)
      .offset(offset)
      .getMany();

    return { totalCount, jobData };
  };

  // This function retrieves job seeker data based on a global search string with pagination.
  // It filters job seekers based on their email, full name, and relevant skills.
  // It accepts 'searchText' as the search string, 'limit' for the number of records per page,and 'offset' for pagination.
  static getJobSeekerData = async(searchText:string, limit:number, offset:number, userId:number) => {
    const countQueryBuilder = jobSeekerRepository
      .createQueryBuilder('jobSeeker')
      .where('jobSeeker.userId != :user', { user: userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('jobSeeker.applicantEmail LIKE :search', { search: `%${searchText}%` })
            .orWhere('jobSeeker.applicantFullName LIKE :search', { search: `%${searchText}%` })
            .orWhere('jobSeeker.applicantRelevantSkills LIKE :search', { search: `%${searchText}%` });
        })
      );

    // Execute the count query to get the total count of records
    const total = await countQueryBuilder.getCount();

    // Create the final query with limit and offset
    const jobSeekerData = await countQueryBuilder
      .limit(limit)
      .offset(offset)
      .getMany();

    return { total, jobSeekerData };
  };

  // This function creates a new resume record in the database.
  // It takes a 'data' object as a parameter, which should contain the job seeker's resume details.
  static createResume = async(data: JobSeeker) => {
    const resume = await jobSeekerRepository.save(data);
    return resume;
  };

  static findResume = async(userId:number, userType:Reference) => {
    const resumeData = await jobSeekerRepository.findOneBy(
      {
        user: { id: userId },
        reference: userType,
      }
    );
    return resumeData;
  };

  static updateResume = async(userId:number, userType:Reference, result:JobSeeker) => {
    const updateResumeData = await jobSeekerRepository.update(
      { user: { id: userId }, reference: userType },
      { applicantFullName: result.applicantFullName,
        applicantEmail: result.applicantEmail,
        mobileNumber: result.mobileNumber,
        applicantRelevantSkills: result.applicantRelevantSkills,
        noteForRecruiter:result.noteForRecruiter,
        reference: userType,
        applicantResumePath: result.applicantResumePath,
        user: { id:userId }
      }
    );
    return updateResumeData;
  };

  // This function retrieves job application data based on a specific job ID and search criteria, with pagination.
  // It filters job applications for a particular job based on applicant email, full name, and relevant skills.
  // It accepts 'job_id' as the job's ID, 'searchText' as the search string, 'limit' for the number of records per page,and 'offset' for pagination.
  static getJobAppliedData = async(job_id:string, searchText:string, limit:number, offset:number) => {

    const countQueryBuilder = jobApplicantRepository
      .createQueryBuilder('jobApplicant')
      .where('jobApplicant.jobId = :job', { job: job_id })
      .andWhere(
        new Brackets((qb) => {
          qb.where('jobApplicant.applicantEmail LIKE :search', { search: `%${searchText}%` })
            .orWhere('jobApplicant.applicantFullName LIKE :search', { search: `%${searchText}%` })
            .orWhere('jobApplicant.applicantRelevantSkills LIKE :search', { search: `%${searchText}%` });
        })
      );

    // Execute the count query to get the total count of records
    const total = await countQueryBuilder.getCount();

    // Create the final query with limit and offset
    const jobAppliedData = await countQueryBuilder
      .limit(limit)
      .offset(offset)
      .getMany();

    return { total, jobAppliedData };
  };

  // This function retrieves job application data for a specific user and a specific job, based on a reference.
  // It accepts the 'job_id' for the job's ID, 'reference' as the reference value, and 'user_id' for the user's ID.
  static getUserAppliedData = (jobId:number, reference:Reference, userId:number) => {
    const user_id = userId;

    const appliedData = jobApplicantRepository.find({
      where: {
        user: { id: user_id },
        job: { jobId: jobId },
        reference:reference
      },
    });
    return appliedData;
  };

  // This function delete the job Applicant who applied the job based on JobID
  static deleteJobApplicant = (jobId:number) => {

    const jobApplicant = jobApplicantRepository.delete({
      job: { jobId: jobId },
    });
    return jobApplicant;
  };

  //This Function delete the job based on JobID
  static deleteJobs = (jobId:number) => {

    const jobDelete = jobRepository.delete({
      jobId: jobId,
    });
    return jobDelete;
  };

  //This function remove the resume File name and make it empty based on userId and reference
  static deleteFileName = async(userId:number, reference:Reference) => {
    const resumeDelete = await jobSeekerRepository.findOneBy({
      user:{ id:userId },
      reference:reference
    });
    if (resumeDelete) resumeDelete.applicantResumePath = '';
    const removeResume = await jobSeekerRepository.save(resumeDelete as DeepPartial<JobSeeker>);
    return removeResume;
  };

  //This function get the data of job applied and their status
  static getAlumniAppliedJob = async(userId:number, globalSearch:string, limit:number, offset:number) => {
    // Create a copy of the query builder without the limit and offset
    const countQueryBuilder = jobApplicantRepository
      .createQueryBuilder('jobApplicant')
      .where('jobApplicant.user.id = :userId', { userId })
      .leftJoinAndSelect('jobApplicant.job', 'job')
      .andWhere(
        new Brackets((qb) => {
          qb.where('job.skills LIKE :search', { search: `%${globalSearch}%` })
            .orWhere('job.jobTitle LIKE :search', {
              search: `%${globalSearch}%`,
            })
            .orWhere('job.companyName LIKE :search', {
              search: `%${globalSearch}%`,
            })
            .orWhere('job.jobLocation LIKE :search', {
              search: `%${globalSearch}%`,
            });
        })
      );

    // Execute the count query to get the total count of records
    const total = await countQueryBuilder.getCount();

    const JobApplicant = await countQueryBuilder
      .limit(limit)
      .offset(offset)
      .getMany();
    return { JobApplicant, total };
  };

  static updateApplicationStatus = async(status:ApplicationStatus, jobApplicantId:number) => {
    const findData = await jobApplicantRepository.findOneBy({
      jobApplicantId: jobApplicantId,
    });
    if (findData) {
      findData.applicationStatus = status;
      const updateStatus = await jobApplicantRepository.save(findData as DeepPartial<JobApplicant>);
      return updateStatus;
    } else {
      return;
    }
  };

  static getStatisticData = async(userId : DeepPartial<JobRepository> ) => {
    const totalJob = await jobRepository.count({
      where: {
        user: Not(userId),
      },
    });

    const totalJobSeeker = await jobSeekerRepository.count({});

    const totalJobApplied = await jobApplicantRepository
      .createQueryBuilder('jobApplicant')
      .where('jobApplicant.user = :userId', { userId })
      .andWhere('jobApplicant.reference = :reference', { reference: 'user' })
      .getCount();

    return { totalJob, totalJobSeeker, totalJobApplied };
  };

  static verifyJob = async(jobId:number) => {
    const verifyJob = await jobRepository.update({ jobId:jobId }, { isVerified:1 });

    return verifyJob;
  };
}
