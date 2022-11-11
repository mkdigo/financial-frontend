import { Api, Response } from './index';

export interface ILogin {
  username: string;
  password: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

type LoginResponse = {
  user: IUser;
  token: string;
};

type MeResponse = {
  user: IUser;
};

export default class UserApi extends Api {
  public async login(data: ILogin): Promise<Response<LoginResponse>> {
    return await this.request.post('/login', data);
  }

  public async logout(): Promise<Response<null>> {
    return await this.request.get('/logout');
  }

  public async me(): Promise<Response<MeResponse>> {
    return await this.request.get('/me');
  }
}
