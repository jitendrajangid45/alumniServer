import { NextFunction, Request, Response } from 'express';
import ApiSuccess from '../api-errors/api-success-util';
import ApiError from '../api-errors/api-error.util';
import EventRepository from '../services/event.service';
import { postEventData } from '../utils/joi.util';

export default class EventController {

  static createEvent = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const eventData = JSON.parse(req.body.data); // Parse the JSON data from the request body.
      eventData.eventFilePath = req.body.newFileName; // Add the new file path and user information to the event data.
      eventData.user = req.query.userId;

      // Validate the event data against a predefined schema.
      const result = await postEventData.validateAsync(eventData);

      const createEvent = await EventRepository.createEvent(result);

      // If an error occurs during creating a Event, return a 500 error.
      if (!createEvent)
        return next(
          ApiError.customError(500, 'Error occurred while Creating a Event')
        );

      return next(ApiSuccess.customSuccessResponse(200, 'Created Successfully')); //success response
    } catch (error) {
      next(error);
    }
  };

  static getEventSelf = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.query.userId as string, 10);
      const searchText = req.query.searchText;
      const page = req.query.page;
      const limit = 6;
      const offset = (parseInt(page as string, 10) - 1) * limit;
      const selfEventDetails = await EventRepository.getSelfEventDetails( userId as number, searchText as string, limit as number, offset as number);

      if (selfEventDetails) return next(ApiSuccess.customSuccessResponse(200, selfEventDetails));
    } catch (error) {
      next(error);
    }
  };

  static getEventOthers = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.query.userId as string, 10);
      const searchText = req.query.searchText;
      const page = req.query.page;
      const limit = 6;
      const offset = (parseInt(page as string, 10) - 1) * limit;
      const verified = parseInt(req.query.isVerified as string, 10);
      const otherEventDetails = await EventRepository.getOthersEventDetails( userId as number, searchText as string, limit as number, offset as number, verified as number);

      if (otherEventDetails) return next(ApiSuccess.customSuccessResponse(200, otherEventDetails));
    } catch (error) {
      next(error);
    }
  };

  static getAllEvent = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.query.userId as string, 10);
      const searchText = req.query.globalSearch;
      const type = req.query.type;
      const getCollegeAndBatch = await EventRepository.getCollegeBatchData(userId as number);

      const { batchName, collegeName } = getCollegeAndBatch;

      const allEventDetails = await EventRepository.getAllEventDetails(searchText as string, type as string, batchName as string, collegeName as string, 'All' as string);

      if (allEventDetails) return next(ApiSuccess.customSuccessResponse(200, allEventDetails));
    } catch (error) {
      next(error);
    }
  };

  static updateStatus = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.query.userId;
      const { type, eventId } = req.body;

      await EventRepository.updateStatus(userId as string, type, eventId);
      return res.json({ status:200, message:'success' });
    } catch (error) {
      next(error);
    }

  };

  static getAttendingProfileData = async(req: Request, res: Response, next: NextFunction) => {
    try {

      const { going, mayBe, decline } = req.query;

      const getGoingUserData = await EventRepository.getGoingUser(going as string);

      const getMaybeUserData = await EventRepository.getGoingUser(mayBe as string);

      const getDeclineUserData = await EventRepository.getGoingUser(decline as string);

      return res.json({ status:200, data:{ getGoingUserData, getMaybeUserData, getDeclineUserData } });
    } catch (error) {
      next(error);
    }
  };
  public static addEventLike = async(req: Request, res: Response) => {
    try {
      const { userId, eventId } = req.body;
      const response = await EventRepository.addEventLike(userId, eventId);
      res.status(201).json({ status: 201, data: response });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  public static addEventComment = async(req: Request, res: Response) => {
    try {
      const eventId = req.body.Id;
      const content = req.body.content ;
      const userId = req.body.userId;
      console.log('object', req.body);
      const response = await EventRepository.addEventComment(eventId, content, userId);
      res.status(201).json({ status: 201, data: response });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  public static getEventComment = async(req: Request, res: Response) => {
    try {
      const eventId = parseInt(req.query.eventId as string, 10);
      const eventComments = await EventRepository.getEventComment(eventId);
      res.status(200).json({ status: 200, data: eventComments });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  public static verifyEvent = async(req: Request, res: Response, next:NextFunction) => {
    try {
      const eventId = parseInt(req.body.eventId as string, 10);
      await EventRepository.verifyEvent(eventId);
      return res.json({
        status: 200,
        data: 'This Event has been verified successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}