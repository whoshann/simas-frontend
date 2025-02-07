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

interface TokenPayload {
  sub: number;
  username: string;
  role: string;
  iat: number;
  exp: number;
}
