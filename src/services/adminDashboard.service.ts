import { Job } from '../models/Jobs.model';
import { JobSeeker } from '../models/jobSeeker.models';
import { Connection } from '../data-source';
import { User, role } from '../models/user.model';
import { EventType, Events } from '../models/Events.model';
import { Colleges } from '../models/Colleges.model';
import { Courses } from '../models/Courses.model';
import { News } from '../models/News.model';
import { Posts } from '../models/Posts.model';
import { Batches } from '../models/Batches.model';

const jobRepository = Connection.getRepository(Job);
const jobSeekerRepository = Connection.getRepository(JobSeeker);
const userRepository = Connection.getRepository(User);
const eventRepository = Connection.getRepository(Events);
const collegeRepository = Connection.getRepository(Colleges);
const courseRepository = Connection.getRepository(Courses);
const batchRepository = Connection.getRepository(Batches);
const newsRepository = Connection.getRepository(News);
const postRepository = Connection.getRepository(Posts);


export default class DashBoardRepository {

  static getAlumniCount = async() => {

    const totalAlumni = await userRepository.count({
      where:{
        role:'alumni' as role
      }
    });

    const totalFaculty = await userRepository.count({
      where: {
        role: 'faculty' as role,
      },
    });

    const totalVerifiedAlumni = await userRepository.count({
      where:{
        isVerified: 1,
        role:'alumni' as role
      }
    });

    const totalUnverifiedAlumni = await userRepository.count({
      where:{
        isVerified: 0,
        role:'alumni' as role
      }
    });

    return { totalAlumni, totalFaculty, totalVerifiedAlumni, totalUnverifiedAlumni };
  };

  static getJobBoardCount = async(userId:number) => {

    const totalJob = await jobRepository.count({});

    const totalJobSeeker = await jobSeekerRepository.count({});

    const totalJobPosted = await jobRepository.count({
      where:{ user:{ id:userId } }
    });

    return { totalJob, totalJobSeeker, totalJobPosted };

  };

  static getEventsCount = async() => {

    const totalEvents = await eventRepository.count({
      where: {
        eventType: 'Event' as EventType,
      },
    });


    const totalReunion = await eventRepository.count({
      where:{
        eventType:'Reunion' as EventType
      }
    });

    const totalWebinar = await eventRepository.count({
      where: {
        eventType: 'Webinar' as EventType,
      },
    });

    return { totalEvents, totalReunion, totalWebinar };
  };

  static CollegeBatchCount = async() => {
    const totalCollege = await collegeRepository.count({});

    const totalCourses = await courseRepository.count({});

    const totalBatch = await batchRepository.count({});

    return { totalCollege, totalBatch, totalCourses };
  };

  static getPostNewsCount = async() => {
    const newsCount = await newsRepository.count({});

    const postCount = await postRepository.count({});

    return { newsCount, postCount };
  };
}
