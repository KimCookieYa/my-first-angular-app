export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  ownerId: string;
  memberIds: string[];
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
  color: string;
}

export interface UpdateProjectRequest extends Partial<CreateProjectRequest> {
  id: string;
} 