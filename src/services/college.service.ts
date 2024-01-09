import { DeepPartial } from 'typeorm';
import { Connection } from '../data-source';
import { Colleges } from '../models/Colleges.model';
import { Courses } from '../models/Courses.model';
const collegeConnRepository = Connection.getRepository(Colleges);
const coursesConnRepository = Connection.getRepository(Courses);
export default class collegeRepository {
  static saveCollege = (collegeData:DeepPartial<Colleges>) => {
    return collegeConnRepository.save(collegeData);
  };

  static updateCollege = async(collegeData:Colleges) => {
    const updateCollege = await collegeConnRepository
      .createQueryBuilder()
      .update(Colleges)
      .set({
        collegeName:collegeData.collegeName,
        collegeCode:  collegeData.collegeCode,
        collegeLogoPath: collegeData.collegeLogoPath,
      })
      .where('collegeId = :collegeId', { collegeId: collegeData.collegeId })
      .execute();
    return updateCollege;
  };

  static addCourse = async(courseDetails:Courses) => {
    return await coursesConnRepository.save(courseDetails);
  };

  static updateCourse = async(courseDetails:DeepPartial<Courses>) => {
    const updateCourse = await collegeConnRepository
      .createQueryBuilder()
      .update(Courses)
      .set({
        collegeCode:courseDetails.collegeCode,
        courseName:courseDetails.courseName,
      })
      .where('courseId=:courseId', { courseId:courseDetails.courseId })
      .execute();

    return updateCourse;
  };
  static findCollege = async(collegeCode:number) => {
    const college = await collegeConnRepository.find({ where: { collegeCode: collegeCode } });
    return college;
  };

  static findCourse = async(collegeCode:number, courseName:string) => {
    const findCourse = await coursesConnRepository.find({
      where: {
        collegeCode: collegeCode,
        courseName: courseName
      }
    });

    return findCourse;
  };

  static getColleges = async() => {
    const getColleges = await collegeConnRepository.find();
    return getColleges;
  };

  static getCollegeCourses = async(CollegeCode:number) => {
    const getCollegeCourses = await coursesConnRepository.find({ where:{ collegeCode:CollegeCode } });
    return getCollegeCourses;
  };

  static deleteCollegeLogo = async(collegeId:number) => {

    const deleteLogo = await collegeConnRepository
      .createQueryBuilder()
      .update(Colleges)
      .set({
        collegeLogoPath:null
      })
      .where('collegeId = :id', { id:collegeId })
      .execute();
    return deleteLogo;
  };

  static deleteCourse = async(courseId :number) => {
    const deleteCourse = await coursesConnRepository.delete({
      courseId:courseId
    });
    return deleteCourse;
  };

}
