import { Types } from 'mongoose';

export interface IUser {
  id: string | number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

export interface IReqresUser {
  data: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  support: {
    url: string;
    text: string;
  };
}

export interface IPersistenceUser {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  _id: Types.ObjectId;
  __v?: number;
}

export interface IUserCreate {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}
