export interface IAuth {
  id: string;
  email: string;
  role?: string;
}

export interface IAuthCredentials {
  email: string;
  password: string;
}
