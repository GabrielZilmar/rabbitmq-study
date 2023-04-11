export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
}

export interface ReqresUser {
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
