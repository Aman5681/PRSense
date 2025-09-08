import { Request, Response } from 'express';
import { GitService } from '../services/GitService';

export class GitController {

  private gitService = GitService.getInstance();

  public async cloneRepo(req: Request, res: Response) {
    try {
      const repoName = req.params.repoName;
      const branch = req.params.branch;

      await this.gitService.clone(repoName, branch);

      res.status(200).json({ message: 'Repository cloned and chunking started.' });
    } catch (error) {
      console.error('[GitController] cloneRepo error:', error);
      res.status(500).json({ error: 'Failed to clone repository and start chunking.' });
    }
  }
}