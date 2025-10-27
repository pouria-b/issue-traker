export interface CreateProjectRequest {
  name?: string;
  description?: string;
  members?: string[];
}
//inja bayad updatedAt ezafe beshe vali hanoz motmaen nistam koza!!!
export interface ProjectDTO {
  id: string;
  description: string | null;
  createdAt: string;
   //updatedAt: string;
  members?: { userId: string; username: string }[];
}

export interface ProjectResponse {
  id: string;
  description: string | null;
  createdAt: string;
  //updatedAt: string;
  user: {
    id: string;
    username: string;
    firstname: string | null;
    lastname: string | null;
  };
  isOwner?: boolean;
  members?: { userId: string; username: string }[];
  issues?: string[];
}

export interface ProjectApiResponse {
  success: boolean;
  message: string;
  data?: ProjectResponse;
}

export interface CreateProjectResponse {
  success: boolean;
  message: string;
  data?: ProjectDTO;
}

export interface ValidateAllResponse {
  success: boolean;
  message: string;
  data?: { description?: string | null; members?: string | null; issues?: string | null };
}

export interface UserProjectResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      username: string;
      firstname: string | null;
      lastname: string | null;
    };
    Project: ProjectResponse[];
  };
}