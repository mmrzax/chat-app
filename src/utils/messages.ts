import { IMessage, ILocationMessage } from '../types/interfaces';

export const generateMessage = (username: string, text: string): IMessage => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};

export const generateLocationMessage = (username: string, url: string): ILocationMessage => {
  return {
    username,
    url,
    createdAt: new Date().getTime(),
  };
};
