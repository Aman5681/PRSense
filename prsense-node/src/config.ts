// src/config.ts
import dotenv from 'dotenv';
dotenv.config();

export const Config = {
  NODEJS_SERVICE_QUEUE: process.env.NODEJS_SERVICE_QUEUE!,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
};
