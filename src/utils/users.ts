import { IUserInfo } from '../types/interfaces'

const users: IUserInfo[] = [];

export const addUser = ({ id, username, room }: IUserInfo) => {
  // Clean the data
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // Validate the data
  if (!username || !room) {
    return {
      error: 'Username and Room are required!',
    };
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });

  // Validate username
  if (existingUser) {
    return {
      error: 'Username is in use!',
    };
  }

  // Store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

export const removeUser = (id: string) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUser = (id: string) => {
  return users.find((user) => user.id === id);
};

export const getUsersInRoom = (room: string) => {
  return users.filter((user) => user.room === room);
};

