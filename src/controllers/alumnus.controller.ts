/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import AlumnusRepository from '../services/alumnus.service';
import AuthRepository from '../services/auth.service';
import { alumniSchema, arrayAlumniSchema, collageAndBatchSchema } from '../utils/joi.util';
import { generateRandomPassword, hash } from '../utils/auth.util';
import ApiError from '../api-errors/api-error.util';
import xlsx, { utils } from 'xlsx';
import { customResponse } from '../api-errors/api-error.controller';

export default class AuthController {
  /**
    * @author : Shani Maurya
    * @description : Route for Add Alumni.
  */
  static async addAlumni(req: Request, res: Response, next: NextFunction) {
    try {
      // 2. Validate the user input against the mainSchema.
      const result = await alumniSchema.validateAsync(req.body);

      const { email } = result;

      // 3. Check if the user with the given email already exists. If so, return a 409 conflict error.
      const user = await AuthRepository.getUserByEmail(email);
      if (user) return next(ApiError.customError(409, 'User already exists'));

      // Generate a random password with 8 characters
      // const randomPassword = generateRandomPassword();

      // 4. Hash the user's password for security.
      // result.password = await hash(randomPassword);
      result.password = '$2b$12$qJhOpPApbu17nLSszpX9gu33Gk3AbIe2BEVWTLNjsR6v7XYNDDVnC';

      result.isVerified = 1;

      // adding login type to alumni
      result.loginType = 'normal';

      // 5. Save user registration data to the database.
      await AuthRepository.saveUserData(result);

      // 7. Send a add alumni email to the user.


      // 6 Assume that the route access is granted, and return a success response
      return customResponse(res, 201, 'User Created Success');
    } catch (error) {
      // If an error occurs, pass it to the error-handling middleware
      next(error);
    }
  }

  static async downloadExcelForAddAlumni(req: Request, res: Response) {
    res.download('src/public/addAlumni.xlsx'); // Set the desired file name
  }

  static async uploadExcelForAddAlumni(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        // Handle the case where no file is uploaded
        return res.status(400).send('No file uploaded.');
      }

      // 2. Validate the user input against the mainSchema.
      const alumniDetails = await collageAndBatchSchema.validateAsync(JSON.parse(req.body.alumniDetails));

      const { collage, batch } = alumniDetails;

      // Access uploaded file using req.file.buffer
      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

      // Assuming the data is in the first sheet (modify as needed)
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert sheet data to array of JSON objects
      const excelData:any[] = utils.sheet_to_json(sheet, { raw: false });

      // Customize date formatting
      const jsonData = excelData.map((entry:any) => {
      // Assuming the date is stored in the 'dateOfBirth' property
        if (entry.dateOfBirth) {
        // Customize the date formatting as needed
          entry.dateOfBirth = new Date(entry.dateOfBirth).toISOString().split('T')[0];
        }
        return entry;
      });

      // validating data using joi
      const result = await arrayAlumniSchema.validate(jsonData, { abortEarly: false });

      // setting error in excel cells
      if (result.error) {
        result.error.details.forEach((error) => {
          const index:number = Number(error.path[0]);
          const property = error.path[1];
          if (property) {
            jsonData[index][property] = `${error.message} value was ${jsonData[index][property]}`;
          } else {
            jsonData[index].email = `${jsonData[index]['email']} ${error.message}`;
          }
          jsonData[index].updatedStatus = 'Error'; // setting status
        });
      }

      // creating Alumni
      await Promise.all(jsonData.map(async(entry) => {
        try {
          if (entry['updatedStatus'] !== 'Error' && entry['email']) {
            // 3. Check if the user with the given email already exists.
            const user = await AuthRepository.getUserByEmail(entry['email']);
            if (user) {
              entry['email'] = `Email "${entry['email']}" already exists`;
              entry.updatedStatus = 'Error'; // setting status
            } else {
              // Generate a random password with 8 characters
              // const randomPassword = generateRandomPassword();
              // 4. Hash the user's password for security.
              // entry.password = await hash(randomPassword);
              entry.password =
                '$2b$12$qJhOpPApbu17nLSszpX9gu33Gk3AbIe2BEVWTLNjsR6v7XYNDDVnC';

              // adding login type to alumni
              entry.loginType = 'normal';

              // adding collageId to alumni
              entry.collage = collage;

              // adding batchId to alumni
              entry.batch = batch;

              entry.isVerified = 1;

              // 5. Save user registration data to the database.
              await AuthRepository.saveUserData(entry);

              entry.updatedStatus = 'Ok'; // setting status

              // 7. Send a add alumni email to the user.
            }
          }
        } catch (error) {
          // setting message if email contains a duplicate value
          entry['email'] = `${entry['email']} contains a duplicate value`;
        }
      }));
      // formatting data to make excel
      const responseFormat = jsonData.map(entry => ({
        firstName: entry.firstName,
        lastName: entry.lastName,
        email: entry.email,
        gender: entry.gender,
        dateOfBirth: entry.dateOfBirth,
        role: entry.role,
        updatedStatus: entry.updatedStatus,
      }));

      // Create a workbook
      const wb = xlsx.utils.book_new();

      // Convert the data array to a worksheet
      const ws = xlsx.utils.json_to_sheet(responseFormat);

      // Add the worksheet to the workbook
      xlsx.utils.book_append_sheet(wb, ws, 'Sheet 1');

      // Convert the workbook to a buffer
      const excelBuffer = xlsx.write(wb, { bookType: 'xlsx', bookSST: true, type: 'buffer' });

      // Set response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=output.xlsx');

      // // Send the buffer as the response
      res.send(excelBuffer);
    } catch (error) {
      // If an error occurs, pass it to the error-handling middleware
      next(error);
    }
  }

  // get alumnus to show on admin alumni page
  static async getAlumnus(req: Request, res: Response, next: NextFunction) {
    try {
      const pageNumber:number = parseInt(req.query.currentPage as string, 10);
      const searchText:string = req.query.searchText as string;
      const { alumnus, totalCount } = await AlumnusRepository.getAlumnus(pageNumber, searchText);

      if (!alumnus.length) {
        return next(ApiError.notFound());
      }
      return customResponse(res, 200, { alumnus, totalCount });
    } catch (error) {
      next(error);
    }
  }
  static async verifyUserByAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const id:number = parseInt(req.body.userId as string, 10);
      const user = await AlumnusRepository.verifyUserByAdmin(id);
      if (!user.affected) {
        return next(ApiError.notFound());
      }
      return customResponse(res, 200, 'OK');
    } catch (error) {
      next(error);
    }
  }
}