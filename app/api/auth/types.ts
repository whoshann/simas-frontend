export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  data: {
    access_token: string;
  };
}

export interface JwtPayload {
  role: string;
}
