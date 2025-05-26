import { Timestamp } from 'firebase/firestore';

export interface Tool {
  id?: string;
  type: 'prompt' | 'mcp' | 'custom_gpt';
  status: 'draft' | 'published';
  title: string;
  description: string;
  content: string;
  tags: {
    specialty: string[];
    useCase: string[];
    userType: string[];
    appModel: string[];
  };
  authorId: string;
  organizationId?: string;
  version: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  saveCount: number;
  ratingAvg: number;
  ratingCount: number;
  isSaved?: boolean;
  sources?: Array<{
    type: 'url' | 'user' | 'text' | string;
    value: string;
    label?: string;
  }>;
} 