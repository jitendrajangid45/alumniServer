import { Connection } from '../data-source';
import { WorkingDetails } from '../models/WorkingDetails.model';
import { ProfessionalDetails } from '../models/ProfessionalDetails.model';
import { DeepPartial } from 'typeorm';

const WorkingConnRepository = Connection.getRepository(WorkingDetails);
const OverConnRepository = Connection.getRepository(ProfessionalDetails);
export default class ProfessionalRepository {

  static findWorkingDetails = (workId:number) => {
    const workingDetails = WorkingConnRepository.find({ where:{ workId:workId } });
    return workingDetails;
  };

  static findOverAllExperience = (userId:number) => {
    const overallWorkExperience = OverConnRepository.find({ where:{ user:{ id:userId } } });
    return overallWorkExperience;
  };

  static saveWorkingDetails = async(workingDetails:WorkingDetails) => {

    const saveWorkingDetails = await WorkingConnRepository.save(workingDetails);
    return saveWorkingDetails;
  };
  static getWorkingDetails = async(userId:number) => {
    const workingDetails = WorkingConnRepository.find({ where:{ user:{ id:userId } } });
    return workingDetails;
  };

  static saveOverAllExperience = (exp:ProfessionalDetails) => {
    const saveOverallExperience = OverConnRepository.save(exp);
    return saveOverallExperience;
  };

  static updateWorkingDetails = async(work:DeepPartial<WorkingDetails>) => {
    const workId = work.workId;
    const updateWorkingDetails = await WorkingConnRepository
      .createQueryBuilder()
      .update(WorkingDetails)
      .set({
        companyName:work.companyName,
        position:work.position,
        isWorking:work.isWorking,
        joiningMonth:work.joiningMonth,
        joiningYear:work.joiningYear,
        leavingMonth:work.leavingMonth,
        leavingYear:work.leavingYear
      })
      .where({ workId:workId })
      .execute();
    return updateWorkingDetails;
  };

  static updateExperience = async(exp:DeepPartial<ProfessionalDetails>) => {
    const profId = exp.profId;

    const updateOverAllExp = await OverConnRepository
      .createQueryBuilder()
      .update(ProfessionalDetails)
      .set({
        'overallWorkExperience':exp.overallWorkExperience,
        'professionalSkills':  exp.professionalSkills,
        'industriesWorkIn': exp.industriesWorkIn,
        'roles':exp.roles,
      })
      .where('profId = :profId', { profId: profId })
      .execute();
    return updateOverAllExp;
  };

  static getOverAllExperience = async(userId:number) => {
    const getOverAllExperience = await OverConnRepository.find({ where:{ user:{ id:userId } } });
    return getOverAllExperience;
  };

  static deleteWorkingDetail = (workId:number) => {

    const deleteWorkingDetail = WorkingConnRepository.delete({
      workId: workId,
    });
    return deleteWorkingDetail;
  };

}