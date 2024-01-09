import { Connection } from '../data-source';
import { Message } from '../models/Message.model';
import { User } from '../models/user.model';
import { UserDetails } from '../models/UserDetails.model';
import { Brackets, DeepPartial } from 'typeorm';

const Userconnection = Connection.getRepository(User);
const UserDetailsConnRepository = Connection.getRepository(UserDetails);

export default class userRepository {
  static getAllUser = async(query:string) => {
    const searchQuery = query;
    const userRepository = Connection.getRepository(User);
    const user = await userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.firstName) LIKE :query', { query: `%${searchQuery.toLowerCase()}%` })
      .getMany();
    return user;
  };

  static getAllUserMsg = async(user:string, sender_id:number) => {
    const users = JSON.parse(user);
    const userData = [];
    for (const user of users) {
      const data = await Connection.getRepository(Message).find({
        where:[{ sender_id:sender_id, receiver_id:user.id }, { sender_id:user.id, receiver_id:sender_id }]
      });
      if (data.length > 0) {
        const data1 = data[data.length - 1];
        userData.push({
          id: user.id,
          lastMessage:data1.messages ? data1.messages : '',
          email:user.email,
          name:user.firstName,
          gender:user.gender,
          profile:process.env.serverUrl + '/uploads/profile/' + user.profilePic,
          isOnline:user.isOnline,
          delivered:data1.delivered ? data1.delivered : false,
          read:data1.read ? data1.read : false
        });
      } else {
        userData.push({
          id: user.id,
          lastMessage:'',
          email:user.email,
          name:user.firstName,
          gender:user.gender,
          profile:process.env.serverUrl + '/uploads/profile/' + user.profilePic,
          isOnline:user.isOnline,
          delivered:false,
          read:false
        });
      }
    }
    return userData;
  };


  static getUpcomingBirthdays = async() => {
    try {
      const currentDate = new Date();
      const currentDayOfWeek = currentDate.getDay();
      const daysRemainingInWeek = 6 - currentDayOfWeek;
      const endOfWeekDate = new Date(currentDate.getTime() + daysRemainingInWeek * 24 * 60 * 60 * 1000);

      const upcomingBirthdays = await Connection.getRepository(User)
        .createQueryBuilder('user')
        .where('DATE(user.dateOfBirth) >= DATE(:currentDate) AND DATE(user.dateOfBirth) <= DATE(:endOfWeekDate)', {
          currentDate: currentDate.toISOString(),
          endOfWeekDate: endOfWeekDate.toISOString(),
        })
        .orderBy('user.dateOfBirth')
        .getMany();

      return upcomingBirthdays;
    } catch (error) {
      console.log('Error:', error);
      throw new Error('Internal server error');
    }
  };
  static getUserDetails = async(id: number) => {
    const userDetails = await Userconnection
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userDetails', 'userDetails')
      .where('user.id = :id', { id })
      .getOne();
    return userDetails;
  };
  static getAllUsers = async(id: number, inputValues:string) => {
    const users = await Userconnection
      .createQueryBuilder('User')
      .leftJoinAndSelect('User.userDetails', 'userDetails ')
      .leftJoinAndSelect('User.batch', 'batches')
      .where('User.id != :id', { id: id })
      .andWhere(new Brackets((qb) => {
        qb.where('User.firstName LIKE :search', { search: `%${inputValues}%` });
        qb.orWhere('batches.batchName LIKE:search', { search:`%${inputValues}%` });
      }))
      .getMany();
    return users;
  };

  static getUserById = async(userId:number) => {
    const getUser = await Userconnection.find({ where:{ id:userId } });
    return getUser;
  };

  static saveProfilePic = async(profilePic:string, userId:number) => {
    const updateProfilePic = await Userconnection
      .createQueryBuilder()
      .update(User)
      .set({ profilePic: profilePic })
      .where('id = :id', { id: userId })
      .execute();
    return updateProfilePic;
  };

  static updateUser = async(updateUser:DeepPartial<User>) => {
    const id = updateUser.id;
    await Userconnection
      .createQueryBuilder()
      .update(User)
      .set({
        email:updateUser.email,
        firstName:updateUser.firstName,
        lastName:updateUser.lastName,
        middleName:updateUser.middleName,
        dateOfBirth:updateUser.dateOfBirth,
        gender:updateUser.gender,
      })
      .where({ id:id })
      .execute();
    return updateUser;
  };

  static saveUserDetails = async(userDetails:UserDetails) => {
    const saveUserDetails = await UserDetailsConnRepository.save(userDetails);
    return saveUserDetails;
  };

  static updateUserDetails = async(userDetails:DeepPartial<UserDetails>) => {
    const detailsId = userDetails.detailsId;
    const updateUserDetails = await UserDetailsConnRepository
      .createQueryBuilder()
      .update(UserDetails)
      .set({
        homeTown:userDetails.homeTown,
        address:  userDetails.address,
        location: userDetails.location,
        postalCode:userDetails.postalCode,
        mobileNo:userDetails.mobileNo,
        countryCode:userDetails.countryCode,
        currentCity:userDetails.currentCity,
        homePhone:userDetails.homePhone,
        workPhone:userDetails.workPhone,
        alternateEmail:userDetails.alternateEmail,
        websitePortfolioBlog:userDetails.websitePortfolioBlog,
        facebookProfile:userDetails.facebookProfile,
        linkedinProfile:userDetails.linkedinProfile,
        youtubeChannel:userDetails.youtubeChannel,
        instagramProfile:userDetails.instagramProfile,
        twitterProfile:userDetails.twitterProfile,
        relationshipStatus:userDetails.relationshipStatus,
        aboutMe:userDetails.aboutMe
      })
      .where('detailsId = :detailsId', { detailsId: detailsId })
      .execute();
    return updateUserDetails;
  };


  static getProfileData = async(userId:number) => {

    const result = await Userconnection.createQueryBuilder('user')
      .select([
        'user.firstName',
        'user.lastName',
        'user.middleName',
        'user.profilePic',
        'batches.batchName',
        'workingdetails.position',
      ])
      .leftJoin('user.batch', 'batches') // Assuming you have a relation named 'batch' in the User entity
      .leftJoin('user.workingDetails', 'workingdetails') // Assuming you have a relation named 'workingDetails' in the User entity
      .where('user.id = :userId', { userId })
      .getOne();

    return result;
  };

}

