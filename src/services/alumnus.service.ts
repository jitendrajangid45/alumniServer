import { Connection } from '../data-source';
import { User } from '../models/user.model';
// Get repositories for each entity
const userRepository = Connection.getRepository(User);
export default class AlumnusRepository {
  // getting alumnus
  static async getAlumnus(pageNumber: number, searchTerm?: string) {
    const pageSize = 10;
    const skip = (pageNumber - 1) * pageSize;
    // creating query builder of user model
    const queryBuilder = userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: 'alumni' })
      .leftJoinAndSelect('user.batch', 'batch')
      .leftJoinAndSelect('user.collage', 'collage');

    // setting column using query builder
    // queryBuilder
    //   .select([
    //     'user.id',
    //     'user.email',
    //     'user.firstName',
    //     'user.lastName',
    //     'user.dateOfBirth',
    //     'user.gender',
    //     'user.profilePic',
    //     'user.collegeId',
    //     'user.batchId',
    //     'user.isVerified',
    //   ]);
    // Add search conditions if a searchTerm is provided
    if (searchTerm) {
      queryBuilder.andWhere('(user.firstName LIKE :term OR user.lastName LIKE :term OR user.email LIKE :term)', { term: `%${searchTerm}%` });
    }
    // getting count of alumni who have searched
    const totalCount = await queryBuilder.getCount();
    // implement filtering
    queryBuilder
      .orderBy('user.id', 'ASC')
      .skip(skip)
      .take(pageSize);
    // getting all of alumni who have searched
    const alumnus = await queryBuilder.getMany();
    return { alumnus, totalCount };
  }
  // verified user by admin.
  static async verifyUserByAdmin(id: number) {
    return await userRepository.update({ id: id }, { isVerified : 1 });
  }
}