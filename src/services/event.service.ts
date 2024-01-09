import { Brackets, In } from 'typeorm';
import { Connection } from '../data-source';
import { Events } from '../models/Events.model';
import { User } from '../models/user.model';
import { EventsComments } from '../models/EventsComments.model';
import { EventsLikes } from '../models/EventsLikes.model';

const eventRepository = Connection.getRepository(Events);
const userRepository = Connection.getRepository(User);

export default class EventRepository {
  static createEvent = async(data: Events) => {
    const event = await eventRepository.save(data);
    return event;
  };

  static getSelfEventDetails = async(userId: number, searchText:string, limit:number, offset:number) => {
    const countQueryBuilder = eventRepository
      .createQueryBuilder('event')
      .leftJoin('event.user', 'user')
      .select(['event.*', 'firstName', 'lastName'])
      .where('event.userId = :user', { user: userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where('event.collegeOrUniversity LIKE :search', {
            search: `%${searchText}%`,
          }).orWhere('event.eventVenue LIKE :search', {
            search: `%${searchText}%`,
          });
        })
      );

    // Execute the count query to get the total count of records
    const total = await countQueryBuilder.getCount();

    const eventDetails = await countQueryBuilder
      .limit(limit)
      .offset(offset)
      .getRawMany();

    return { eventDetails, total };
  };

  static getOthersEventDetails = async(userId: number, searchText:string, limit:number, offset:number, isVerified:number) => {
    const countQueryBuilder = eventRepository
      .createQueryBuilder('event')
      .leftJoin('event.user', 'user')
      .select(['event.*', 'firstName', 'lastName'])
      .where('event.userId != :user', { user: userId })
      .andWhere('event.isVerified = :isVerified', { isVerified: isVerified })
      .andWhere(
        new Brackets((qb) => {
          qb.where('event.collegeOrUniversity LIKE :search', {
            search: `%${searchText}%`,
          }).orWhere('event.eventVenue LIKE :search', {
            search: `%${searchText}%`,
          });
        })
      );

    // Execute the count query to get the total count of records
    const total = await countQueryBuilder.getCount();

    const eventDetails = await countQueryBuilder
      .limit(limit)
      .offset(offset)
      .getRawMany();

    return { eventDetails, total };
  };

  static getAllEventDetails = async(searchText:string, type:string, batchName:string, collegeName:string, All:string) => {
    const eventType = type.split(',').filter(Boolean);
    const collegeBatchType: string[] = [batchName, collegeName, All];

    const countQueryBuilder = eventRepository
      .createQueryBuilder('event')
      .leftJoin('event.user', 'user')
      .select(['event.*', 'firstName', 'lastName'])
      .where('event.eventType IN (:...types)', { types: [eventType] })
      .andWhere('event.visibleTo IN (:...visible)', { visible: [collegeBatchType] })
      .andWhere('event.isVerified = :isVerified', { isVerified: 1 })
      .andWhere(
        new Brackets((qb) => {
          qb.where('event.collegeOrUniversity LIKE :search', {
            search: `%${searchText}%`,
          }).orWhere('event.eventVenue LIKE :search', {
            search: `%${searchText}%`,
          });
        })
      );
    // Execute the count query to get the total count of records
    const total = await countQueryBuilder.getCount();

    const eventDetails = await countQueryBuilder
      // .limit(limit)
      // .offset(offset)
      .getRawMany();

    return { eventDetails, total };
  };

  static updateStatus = async(userId:string, type:string, eventId:number) => {

    const findEvent = await eventRepository.findOne({
      where: {
        eventId: eventId,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let updateData:any[] = [];
    if (type === 'mayBe') {
      if (findEvent?.mayBe) {
        updateData = findEvent?.mayBe;
      }
      updateData.push({
        id: userId,
      });
      const updateStatus = await eventRepository.update(
        {
          eventId: eventId, // Specify the condition for the update
        },
        {
          mayBe: updateData,
        }
      );
      return updateStatus;
    } else if (type === 'join') {
      if (findEvent?.join) {
        updateData = findEvent?.join;
      }
      updateData.push({
        id: userId,
      });
      const updateStatus = await eventRepository.update(
        {
          eventId: eventId, // Specify the condition for the update
        },
        {
          join: updateData,
        }
      );
      return updateStatus;
    } else {
      if (findEvent?.decline) {
        updateData = findEvent?.decline;
      }
      updateData.push({
        id: userId,
      });
      const updateStatus = await eventRepository.update(
        {
          eventId: eventId, // Specify the condition for the update
        },
        {
          decline: updateData,
        }
      );
      return updateStatus;
    }
  };

  static getGoingUser = async(attending:string) => {
    if (attending) {
      const userId = attending.split(',').filter(Boolean);

      const countQueryBuilder = userRepository
        .createQueryBuilder('user')
        .leftJoin('user.batch', 'batches')
        .select(['firstName', 'profilePic', 'batchName'])
        .where('user.id IN (:...ids)', { ids: [userId] });

      const userDetails = await countQueryBuilder.getRawMany();
      return userDetails;
    } else {
      return null;
    }
  };
  static addEventComment = async(event: Events, content: string, user: User) => {
    try {
      console.log('dfghjk', event, content, user);
      const eventComment = new EventsComments();
      eventComment.user = user;
      eventComment.event = event;
      eventComment.eventsCommentContent = content;
      eventComment.eventsCommentDate = new Date();
      console.log('aaaaaaaa', eventComment);
      const a = await eventComment.save();
      console.log('ssss', a);
      return { message: 'Comment added successfully' };
    } catch (error) {
      console.log('eror', error);
      throw new Error('Failed to add comment');
    }
  };

  static getEventComment = async(eventId: number) => {
    try {
      const eventComments = await eventRepository
        .createQueryBuilder()
        .select([
          'user.id AS userId',
          'user.firstName',
          'user.lastName',
          'user.profilePic',
          'EventsComments.eventsCommentContent',
          'EventsComments.eventsCommentDate',
        ])
        .from('EventsComments', 'EventsComments')
        .leftJoin('EventsComments.user', 'user')
        .where('EventsComments.event.eventId = :eventId', { eventId })
        .orderBy('EventsComments.eventsCommentId', 'DESC')
        .getMany();

      return eventComments;
    } catch (error) {
      console.error('Error occurred while fetching event comments:', error);
    }
  };

  static addEventLike = async(user: User, event: Events) => {
    try {
      const eventLike = new EventsLikes();
      eventLike.user = user;
      eventLike.event = event;
      eventLike.eventLikeDate = new Date();

      await eventLike.save();

      return { message: 'Like added successfully' };
    } catch (error) {
      throw new Error('Failed to add like');
    }
  };

  static verifyEvent = async(eventId:number) => {
    const verifyEvent = await eventRepository.update({ eventId:eventId }, { isVerified:1 });
    return verifyEvent;
  };

  static getCollegeBatchData = async(userId:number) => {
    const data = await userRepository
      .createQueryBuilder('user')
      .select(['batchName', 'collegeName'])
      .where('user.id = :id', { id: userId })
      .leftJoin('user.batch', 'batch')
      .leftJoin('colleges', 'colleges', 'user.collegeId = colleges.collegeCode')
      .getRawOne();

    return data;
  };
}
