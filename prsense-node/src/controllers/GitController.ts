import { Request, Response } from 'express';
import { GitService } from '../services/GitService';
import { ChunkService } from '../services/ChunkService';
import { Utils } from '../utils/Utils';
import { EventNameForPush } from '../constants/EventNames';

export class GitController {

  private gitService = GitService.getInstance();

  public async cloneRepo(req: Request, res: Response) {
    try {
      const repoName = req.params.repoName;
      const branch = req.params.branch;

      await this.gitService.clone(repoName, branch);
      await Utils.pushMessageToQueue(EventNameForPush.START_CHUNKING, { repoName });

      res.status(200).json({ message: 'Repository cloned and chunking started.' });
    } catch (error) {
      console.error('[GitController] cloneRepo error:', error);
      res.status(500).json({ error: 'Failed to clone repository and start chunking.' });
    }
  }
}