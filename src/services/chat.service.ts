import { Connection } from '../data-source';

export default class chatRepository {
  static getKnownUsers = async(id: number) => {
    const query = `SELECT
    u1.firstName as name,
    u1.id as id,
    u1.profilePic as profile,
    u1.email as email,
    m.sender_id as sender_id,
    m.messages as lastMessage,
    u1.isOnline,
     CASE
          WHEN cr.sender_id = m.sender_id THEN cr.receiver_id
          ELSE cr.sender_id
      END AS receiver_id,
    cr.id as chat_id
    FROM message as m
    JOIN chat_room as cr on (cr.sender_id = ${id} or cr.receiver_id = ${id})
    JOIN user AS u1 ON cr.sender_id = u1.id OR cr.receiver_id = u1.id
    where m.id = (select id from message where chat_id = cr.id ORDER BY id DESC limit 1) AND u1.id <> ${id};`;
    const user = await Connection.query(query);
    return user;
  };

  static getKnownUsersWithFile = async(user:string) => {
    const data = [];
    const users = JSON.parse(user);
    for (const u of users) {
      data.push({
        'id':u.id,
        'name':u.name,
        'profile':process.env.serverUrl + '/uploads/profile/' + u.profile,
        'email':u.email,
        'sender_id':u.sender_id,
        'receiver_id':u.receiver_id,
        'chat_id':u.chat_id,
        'isOnline':u.isOnline,
        'lastMessage':u.lastMessage
      });
    }

    return data;

  };
}