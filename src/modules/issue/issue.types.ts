export type IssueStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";
export type IssuePriority = "LOW" | "MEDIUM" | "HIGH";

export interface CreateIssueRequest {
  title: string;
  description?: string | null;
  priority?: IssuePriority;
  assignedToId?: string | null;
}

export interface UpdateIssueRequest {
  title?: string;
  description?: string | null;
  status?: IssueStatus;
  priority?: IssuePriority;
  assignedToId?: string | null;
}

export interface IssueDTO {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  createdById: string;
  assignedToId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IssueMiniDTO {
  id: string;
  title: string;
  status: IssueStatus;
  priority: IssuePriority;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
