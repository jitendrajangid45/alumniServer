import { Server as SocketIOServer } from 'socket.io';
import { Connection } from '../data-source';
import { ChatRoom } from '../models/ChatRoom.model';
import { Message } from '../models/Message.model';
import { User } from '../models/user.model';
import NewsRepository from '../services/news.service';
import http from 'http';
import app from '../app';
const server = http.createServer(app);
const io = new SocketIOServer(server);
const connectedUsers: { [key: string]: string } = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('message', async(data) => {
    const sender_id = data.sender_id;
    const receiver_id = data.receiver_id;
    const message = data.message;
    const existroom = await Connection.getRepository(ChatRoom).find({
      where:[{ sender_id:sender_id, receiver_id:receiver_id }, { sender_id:receiver_id, receiver_id:sender_id }]
    });
    if (existroom.length > 0) {
      if (message != '') {
        const msg = await Connection.getRepository(Message).save({ sender_id:sender_id, receiver_id:receiver_id, chat_id:existroom[0].id, messages:message });
        if (msg) {
          const messageArray:Message[] = [];
          const allmsg = await Connection.getRepository(Message).find({ where:{ chat_id:existroom[0].id } });
          allmsg.forEach(m => {
            m.file = process.env.serverUrl + '/uploads/sharedFiles/' + m.file;
            if(receiver_id == m.sender_id){
              m.delivered = true;
              m.read = true;
            }
            messageArray.push(m);
          });
          io.emit('message', { 'messages':allmsg });
        }
      }
    } else {
      const room = await Connection.getRepository(ChatRoom).save({ sender_id:sender_id, receiver_id:receiver_id });
      if (room) {
        if (message != '') {
          const msg = await Connection.getRepository(Message).save({ sender_id:sender_id, receiver_id:receiver_id, chat_id:room.id, messages:message });
          if (msg) {
            const messageArray:Message[] = [];
            const allmsg = await Connection.getRepository(Message).find({ where:{ chat_id:room.id } });
            allmsg.forEach(m => {
              m.file = process.env.serverUrl + '/uploads/sharedFiles/' + m.file;
              if(receiver_id == m.sender_id){
                m.delivered = true;
                m.read = true;
              }
              messageArray.push(m);
            });
            io.emit('message', { 'messages':allmsg });
          }
        }
      }
    }
  });

  socket.on('onclickMessageSeen',async(data)=>{
    const chat_id = data;
    const allmsg = await Connection.getRepository(Message).find({ where:{ chat_id:chat_id } });
    allmsg.forEach(m=>{
      m.delivered = true;
      m.read = true;
    })
    await Connection.getRepository(Message).save(allmsg);
    const message = await Connection.getRepository(Message).find({ where:{ chat_id:chat_id } });
    io.emit('onclickMessageSeen',{'messages':message});    
  })

  socket.on('imediateFile', async(data) => {
    try {
      io.emit('message', { 'messages':data.data });
    } catch (error) {
      console.log('error->>', error);
    }
  });

  socket.on('messageSeen', async(data) => {
    const data1 = JSON.parse(data);
    if (data1.data.length > 0) {
      data1.data.forEach(async(message: { delivered: boolean; read: boolean; }) => {
        message.delivered = true;
        message.read = true;
        await Connection.getRepository(Message).save(message);
      });
      let foundKey:string = '';
      const msg = await Connection.getRepository(Message).find({ where:{ chat_id:data1.data[0].chat_id } });
      for (const key in connectedUsers) {
        if (connectedUsers[key] === data1.receiver_id) {
          foundKey = key;
          break;
        }
      }
      io.to(foundKey).emit('getMessageSeen', { 'messages':msg, 'receiver_id':data1.receiver_id });
    } else {
      console.log('no dataaa');
    }
  });

  socket.on('sentmessage',async(data)=>{
    console.log('datatatt--->>',data);
    io.emit('message',{'messages':JSON.parse(data)});
  })

  socket.on('sendNotification', async(data) => {
    try {
      const sender_id = data.id;
      const receiver_id = data.sender_id;
      const chat_id = data.chat_id;
      const messages = await Connection.getRepository(Message).find({
        where:[{ sender_id:Number(sender_id), receiver_id:Number(receiver_id), chat_id:Number(chat_id) }]
      });
      let count = 0;
      messages.forEach(messageElements => {
        if (messageElements.read == false) {
          count++;
        }
      });
      io.emit('getNotification', count);

    } catch (error) {
      console.log('errorr==>', error);
    }
  });

  socket.on('sendStatus', async(id) => {
    connectedUsers[socket.id] = id;
    const user = await Connection.getRepository(User).find({ where:{ 'id':id } });
    if (user) {
      user[0].isOnline = true;
      await Connection.getRepository(User).save(user[0]);
    } else {
      console.log('userNot found');
    }
    const users = await Connection.getRepository(User).find();
    io.emit('getStatus', users);
  });

  socket.on('sendlogoutStatus', async() => {
    if (Object.keys(connectedUsers).length > 0) {
      if (connectedUsers[socket.id] != undefined) {
        const user = Connection.query(`UPDATE user SET isOnline=false where id=${connectedUsers[socket.id]}`);
        io.emit('offline', user);
      }
    }
    delete(connectedUsers[socket.id]);
    const users = await Connection.getRepository(User).find();
    io.emit('getStatus', users);
  });

  socket.on('newsComments', async(data) => {
    try {
      await NewsRepository.addComment(data.userId, data.newsId, data.newsComments);
      const wholedata = await NewsRepository.getNewsComment(data.newsId);
      io.emit('newsComments', wholedata );
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  });

  socket.on('postFeedComment', async(data) => {

    io.emit('postFeedComment', data);
  });

  socket.on('disconnect', async() => {
    if (Object.keys(connectedUsers).length > 0) {
      if (connectedUsers[socket.id] != undefined) {
        const user = Connection.query(`UPDATE user SET isOnline=false where id=${connectedUsers[socket.id]}`);
        io.emit('offline', user);
      }
    }
    delete(connectedUsers[socket.id]);
  });
});

export default server;