import { DeepPartial, Like } from 'typeorm';
import { Connection } from '../data-source';
import { Batches } from '../models/Batches.model';
import { Colleges } from '../models/Colleges.model';

const BatchesConnRepository = Connection.getRepository(Batches);

export default class batchesRepository {
  static saveBatch = (data:DeepPartial<Batches>) => {
    return BatchesConnRepository.save(data);
  };

  static getBatches = async(collegeId:number, search:string) => {
    const batches = await BatchesConnRepository.find({
      where:[
        { collegeId:collegeId },
        { batchName:Like(`%${search}%`) }
      ]
    });
    return batches;

  };

  static getCollegeByName = (collegeCode:number) => {
    const batchesByCollegeName = BatchesConnRepository.find({ where:{ collegeId:collegeCode } });
    return batchesByCollegeName;
  };
  static findBatch = async(collegeId:number, courseName:string, batchYear:number) => {
    const checkBatch = await BatchesConnRepository.find({ where:{ collegeId:collegeId, courseName:courseName, batchYear:batchYear } });
    return checkBatch;
  };

  static getAllBatches() {
    return BatchesConnRepository.find();
  }
  static getBatchStudents = async(batchId:number, searchtext:string) => {
    let query = BatchesConnRepository
      .createQueryBuilder('batches')
      .leftJoinAndSelect('batches.user', 'user')
      .where('batches.batchId = :batchId', { batchId: batchId });

    if (searchtext !== 'undefined' || undefined) {
      query = query.andWhere('user.firstName LIKE :search', { search: `%${searchtext}%` });
    }

    const getStudents = await query.getMany();
    return getStudents;

  };

  static getYearwiseBatches = async(batchYear :number) => {
    const getYearwiseBatches = await BatchesConnRepository.find({ where:{ batchYear:batchYear } });
    return getYearwiseBatches;
  };

  static getBatchDetails = async() => {
    const data = await BatchesConnRepository.createQueryBuilder('batch')
      .select('batch.batchName', 'batchName')
      .distinct(true)
      .getRawMany();
    return data;
  };
}