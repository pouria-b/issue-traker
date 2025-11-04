export interface CreateCommentRequest {
  content: string;
  parentId?: string | null;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface CommentDTO {
  id: string;
  issueId: string;
  authorId: string;
  content: string;
  parentId: string | null;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
