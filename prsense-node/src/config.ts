// src/config.ts
import dotenv from 'dotenv';
dotenv.config();

export const Config = {
  NODEJS_SERVICE_QUEUE: process.env.NODEJS_SERVICE_QUEUE!,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  GITLAB_USERNAME: process.env.GITLAB_USERNAME || '',
  GITLAB_TOKEN: process.env.GITLAB_TOKEN || '',
  PORT: process.env.PORT || 3000,
  PYTHON_SERVICE_QUEUE: process.env.PYTHON_SERVICE_QUEUE!
};
