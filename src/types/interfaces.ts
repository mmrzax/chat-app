export interface IMessage {
  username: string,
  text: string;
  createdAt: number;
};

export interface ILocationMessage {
  username: string,
  url: string;
  createdAt: number;
};

export interface IUserInfo {
  id: string;
  username: string;
  room: string;
};
