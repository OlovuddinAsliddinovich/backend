export interface IPost {
  _id: string;
  title: string;
  body: string;
  picture: string;
  createdAt: string;
  author: string;
}

export interface IUser {
  id: string;
  email: string;
  isActivated: boolean;
}

export type AuthType = "register" | "login" | "forgot-password";
