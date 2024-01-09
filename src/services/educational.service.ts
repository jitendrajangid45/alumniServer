import { DeepPartial } from 'typeorm';
import { Connection } from '../data-source';
import { EducationalDetails } from '../models/EducationalDetails.model';

const EducationalConnRepository = Connection.getRepository(EducationalDetails);

export default class EducationalRepository {
  static findEducationId = async(eduId:number) => {
    const educationId = await EducationalConnRepository.find({ where:{ eduId:eduId } });
    return educationId;
  };
  static getEducationalDetails = async(userId:number) => {
    const educationDetails = await EducationalConnRepository.find({ where:{ user:{ id:userId } } });
    return educationDetails;
  };
  static saveEducationalDetails = async(eduDetails:DeepPartial<EducationalDetails>) => {
    const saveEducationalDetails = await EducationalConnRepository.save(eduDetails);
    return saveEducationalDetails;
  };
  static updateEducationalDetails = async(eduDetails:DeepPartial<EducationalDetails>) => {
    const id = eduDetails.eduId;
    const updateEducationalDetails = await EducationalConnRepository
      .createQueryBuilder()
      .update(EducationalDetails)
      .set({
        universityInstitute:eduDetails.universityInstitute,
        stream:  eduDetails.stream,
        location: eduDetails.location,
        collageName:eduDetails.collageName,
        startYear:eduDetails.startYear,
        endYear:eduDetails.endYear,
        programDegree:eduDetails.programDegree
      })
      .where('eduId = :eduId', { eduId: id })
      .execute();
    // const updateEducationalDetails=await EducationalConnRepository.save(educationForm)
    return updateEducationalDetails;
  };

  static deleteEducation = (eduId:number) => {
    const deleteEducation = EducationalConnRepository.delete({
      eduId:eduId,
    });
    return deleteEducation;
  };
}