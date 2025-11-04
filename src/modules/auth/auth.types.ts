export type GlobalRole = "ADMIN" | "MEMBER";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: GlobalRole;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  firstname?: string | null;
  lastname?: string | null;
}
export interface SignupResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface LoginRequest {
  identifier: string; // username or email
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
  refresh?: string;
  username?: string;
}


export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    token?: string;
    refresh?: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: GlobalRole;
      firstname: string | null;
      lastname: string | null;
    };
  };
}
