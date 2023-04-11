export interface IUser {
  id: number;
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

export interface IUserCreate {
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}
