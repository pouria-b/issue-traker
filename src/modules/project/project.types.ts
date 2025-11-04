export type IssueStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
export type IssuePriority = "LOW" | "MEDIUM" | "HIGH";
export type ProjectRole = "ADMIN" | "MEMBER";

export interface CreateProjectRequest {
  name: string;
  description?: string | null;
  members?: string[];
}

export interface IssueMiniDTO {
  id: string;
  title: string;
  status: IssueStatus;
  priority: IssuePriority;
}

export interface MemberMiniDTO {
  userId: string;
  username: string;
  roleInProject: ProjectRole;
}

export interface OwnerMiniDTO {
  id: string;
  username: string;
  firstname: string | null;
  lastname: string | null;
}

export interface ProjectDTO {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  user: OwnerMiniDTO; 
  isOwner: boolean; 
  members: MemberMiniDTO[];
  issues: IssueMiniDTO[];
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CreateProjectResponse {
  success: boolean;
  message: string;
  data?: ProjectDTO;
}

export interface ProjectApiResponse {
  success: boolean;
  message: string;
  data?: ProjectDTO;
}

export interface UserProjectsResponse {
  success: boolean;
  message: string;
  data?: {
    user: OwnerMiniDTO;
    projects: ProjectDTO[];
    meta: PageMeta;
  };
}
