import { Request, Response } from 'express';
import { Connection } from '../data-source';
import { ChatRoom } from '../models/ChatRoom.model';
import { Message } from '../models/Message.model';
import chatRepository from '../services/chat.service';

class ChatController {

  async sendData(req:Request, res:Response): Promise<void> {
    try {
      const { sender_id, receiver_id } = req.body;
      const existroom = await Connection.getRepository(ChatRoom).find({
        where:[{ sender_id:sender_id, receiver_id:receiver_id }, { sender_id:receiver_id, receiver_id:sender_id }]
      });

      if (existroom.length > 0) {
        const messages = await Connection.getRepository(Message).find({ where:{ chat_id:existroom[0].id } });
        if (messages.length > 0) {
          messages.forEach(message => {
            if(receiver_id == message.sender_id){
              message.delivered = true;
              message.read = true;
            }
          });
          await Connection.getRepository(Message).save(messages);
        }
        const message = await Connection.getRepository(Message).find({ where:{ chat_id:existroom[0].id } });
        const messageArray: Message[] = [];
        if (message.length > 0) {
          message.forEach(m => {
            m.file = process.env.serverUrl + '/uploads/sharedFiles/' + m.file;
            messageArray.push(m);
          });
        }
        res.json({ status:200, chat_id:existroom[0].id, messages:messageArray });
      } else {
        const room = await Connection.getRepository(ChatRoom).save({ sender_id:sender_id, receiver_id:receiver_id });
        res.json({
          status:201,
          chat_id:room.id,
          message:'Room Created'
        });
      }
    } catch (error) {
      console.log('error', error);
      res.json({ status:400, 'msg':'internal server error' });
    }
  }

  async findChatId(req:Request, res:Response): Promise<void> {
    try {
      const { sender_id, receiver_id } = req.body;
      const existroom = await Connection.getRepository(ChatRoom).find({
        where:[{ sender_id:sender_id, receiver_id:receiver_id }, { sender_id:receiver_id, receiver_id:sender_id }]
      });
      res.json({
        status:200,
        chat_id: existroom[0].id,
        data:existroom
      });
    } catch (error) {
      console.log('error--->>', error);
    }
  }

  async whatsappFile(req:Request, res:Response): Promise<void> {
    try {
      const existroom = await Connection.getRepository(ChatRoom).find({
        where:[{ sender_id:req.body.sender_id, receiver_id:req.body.receiver_id }, { sender_id:req.body.receiver_id, receiver_id:req.body.sender_id }]
      });
      if (existroom.length > 0) {
        const msg = await Connection.getRepository(Message).save({ sender_id:req.body.sender_id, receiver_id:req.body.receiver_id, chat_id:existroom[0].id, messages:'', file:req.body.newFileName });
        if (msg) {
          const allmsg = await Connection.getRepository(Message).find({ where:{ chat_id:existroom[0].id } });
          const messageArray:Message[] = [];
          allmsg.forEach(m => {
            m.file = process.env.serverUrl + '/uploads/sharedFiles/' + m.file;
            messageArray.push(m);
          });
          res.json({ status:200, data:messageArray });
        }
      } else {
        const room = await Connection.getRepository(ChatRoom).save({ sender_id:req.body.sender_id, receiver_id:req.body.receiver_id });
        if (room) {
          const msg = await Connection.getRepository(Message).save({ sender_id:req.body.sender_id, receiver_id:req.body.receiver_id, chat_id:room.id, messages:'', file:req.body.newFileName });
          if (msg) {
            const messageArray: Message[] = [];
            const allmsg = await Connection.getRepository(Message).find({ where:{ chat_id:room.id } });
            allmsg.forEach(m => {
              m.file = process.env.serverUrl + '/uploads/sharedFiles/' + m.file;
              messageArray.push(m);
            });
            res.json({ status:200, data:messageArray });
          }
        }
      }
    } catch (error) {
      console.log('errorrrr-->>', error);
    }

  }

  async messageDelivery(req:Request, res:Response):Promise<void> {
    try {
      const { user_id } = req.body;
      const messages = await Connection.getRepository(Message).find({
        where:[{ sender_id:user_id }, { receiver_id:user_id }]
      });
      if (messages.length > 0) {
        messages.forEach(message => {
          message.delivered = true;
        });
        await Connection.getRepository(Message).save(messages);
      }
      throw new Error('No messages found');
    } catch (error) {
      console.log('errror', error);
    }
  }

  async getKnownUsers(req:Request, res:Response): Promise<void> {
    try {
      const { sender_id } = req.query;
      const users = await chatRepository.getKnownUsers(Number(sender_id));
      const user = await chatRepository.getKnownUsersWithFile(JSON.stringify(users));
      res.json({ status:200, 'data':user });
    } catch (error) {
      console.log('error', error);
      res.json({ status:400, 'msg':'internal server error' });
    }
  }

  async notificationCount(req:Request, res:Response): Promise<void> {
    try {
      const { sender_id, receiver_id, chat_id } = req.query;
      const messages = await Connection.getRepository(Message).find({
        where:[{ sender_id:Number(sender_id), receiver_id:Number(receiver_id), chat_id:Number(chat_id) }]
      });
      let count = 0;
      messages.forEach(messageElements => {
        if (messageElements.read == false) {
          count++;
        }
      });
      res.json({
        status:200,
        notificationcount:count,
        id:sender_id
      });
    } catch (error) {
      console.log('errorr==>', error);
    }
  }

}



export const chatController = new ChatController();