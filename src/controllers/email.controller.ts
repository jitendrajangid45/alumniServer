import { NextFunction, Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import { Connection } from '../data-source';
import { Email } from '../models/Email.model';
import logger from '../logger';
const EmailRepository = Connection.getRepository(Email);
const emailsns = process.env.EMAIL_SNS_URL;
const emailtoken = process.env.EMAIL_SNS_TOKEN;
const emailattachmenturl = process.env.EMAIL_ATTACHMENT_URL;
const emailattachmenttoken = process.env.EMAIL_ATTACHMENT_TOKEN;
export default class EmailController {
  //Save and send
  static SNS = async(req: Request, res: Response, next: NextFunction) => {
    try {
      // Create email data as a JSON string.
      const recipientArray = JSON.parse(req.body.to);
      const emailData = JSON.stringify({
        'to': recipientArray,
        'from': req.body.from,
        'subject': req.body.subject,
        'text': req.body.message
      });
      // Extract the 'to' value and the current time.
      const toValue = Array.isArray(JSON.parse(req.body.to)) ? JSON.parse(req.body.to) : JSON.parse(req.body.to);
      const deliveredTime = new Date().toLocaleString();

      // Prepare data for saving to the database.
      const saveData = {
        to: toValue,
        from: req.body.from,
        subject: req.body.subject,
        message: req.body.message,
        provider: '',
        delivered: deliveredTime,
        Attachment: '',
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      };

      // Send the email data via fetch to a specific API.
      await fetch(`${emailsns}`, {
        method: 'post',
        body: emailData,
        headers: {
          'Authorization': 'Bearer ' + emailtoken,
          'Content-Type': 'application/json'
        }
      });

      // Save the email data to the database.
      const EmailSave = EmailRepository.create(saveData);
      await EmailRepository.save(EmailSave);
      return res.status(200).json({ status: 200, data: req.body, error: null });
    } catch (error) {
      next(error);
    }
  };

  // Send an email with attachments
  static Attachment = async(req: Request, res: Response, next: NextFunction) => {
    try {
      // Get uploaded files and create an array to store file details.
      const uploadFiles = req.files ? req.files : [];
      const fileDetails = [];

      // Parse email data from the request body.
      const emailDataBody = JSON.parse(req.body.data);
      const data = new FormData();
      data.append('from', emailDataBody.from);
      data.append('to', emailDataBody.to);
      data.append('title', emailDataBody.subject);
      data.append('message', emailDataBody.message);

      // Handle multiple file uploads and add them to the FormData.
      if (Array.isArray(uploadFiles)) {
        for (let i = 0; i < uploadFiles.length; i++) {
          fileDetails.push({
            'filename': uploadFiles[i].filename,
            'path': uploadFiles[i].path
          });
          data.append('files', fs.createReadStream(uploadFiles[i].path));
        }
      }

      // Prepare email data for sending. TO DO
      // const emailData = {
      //   'file': uploadFiles,
      //   'to': emailDataBody.to,
      //   'from': emailDataBody.from,
      //   'title': emailDataBody.subject,
      //   'message': emailDataBody.message
      // };

      // Configure the request to send the email with attachments.
      // logger.info('emailDatavffff', emailData);
      const config = {
        method: 'post',
        url: `${emailattachmenturl}`,
        headers: {
          'accept': '*/*',
          'Authorization': 'Bearer ' + emailattachmenttoken,
          ...data.getHeaders()
        },
        data: data
      };

      // Send the email with attachments.
      axios(config)
        .then(function(response: AxiosResponse) {
          logger.info(JSON.stringify(response.status));
        })
        .catch(function(error) {
          logger.info(error);
        });

      // Save email data to the database.
      const emailSave = {
        to: emailDataBody.to,
        from: emailDataBody.from,
        subject: emailDataBody.subject,
        message: emailDataBody.message ? emailDataBody.message : '',
        provider: '',
        delivered: '',
        Attachment: '',
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
      };
      const EmailSaveDB = EmailRepository.create(emailSave);
      await EmailRepository.save(EmailSaveDB);
      return res.status(200).json({ status: 200, data: '', error: null });
    } catch (error) {
      next(error);
    }
  };


}