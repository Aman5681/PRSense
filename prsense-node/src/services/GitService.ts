import simpleGit, { SimpleGit } from 'simple-git';
import * as path from 'path';
import * as fs from 'fs';
import dotenv from 'dotenv';
import { Config } from '../config';
import { Utils } from '../utils/Utils';
import { EventNameForPush } from '../constants/EventNames';

dotenv.config();

export class GitService {
  private static instance: GitService;
  private git: SimpleGit;
  private basePath: string;
  private username: string;
  private token: string;

  private constructor() {
    this.git = simpleGit();
    this.basePath = './repos';
    this.username = process.env.GITLAB_USERNAME || '';
    this.token = process.env.GITLAB_TOKEN || '';

    if (!this.username || !this.token) {
      throw new Error('[GitService] Missing GITLAB_USERNAME or GITLAB_TOKEN in env');
    }
  }

  public static getInstance(): GitService {
    if (!GitService.instance) {
      GitService.instance = new GitService();
    }
    return GitService.instance;
  }

  private getRepoUrl(repoName: string): string {
    return `https://${this.username}:${this.token}@git.u-next.com/${repoName}.git`;
  }

  private getDestinationPath(repoName: string): string {
    return path.join(this.basePath, repoName.replace('/', '__'));
  }

  private async getProject(repoName: string): Promise<string> {
    const baseUrl = "https://git.u-next.com/api/v4";

    const res = await fetch(`${baseUrl}/projects?search=${encodeURIComponent(repoName)}`, {
      headers: {
        "PRIVATE-TOKEN": Config.GITLAB_TOKEN
      }
    });

    if (!res.ok) {
      throw new Error(`GitLab API error: ${res.statusText}`);
    }

    const projects = await res.json();
    if (!projects.length) {
      throw new Error(`No project found with name ${repoName}`);
    }

    // Usually first result is the correct one, but you may want to match exactly
    const projectPath = projects[0].path_with_namespace as string;
    return projectPath; // e.g., "dev-tools/mcp-service"
  }

  public async clone(repoName: string, branch = 'master'): Promise<void> {
    const project = await this.getProject(repoName);
    const repoUrl = this.getRepoUrl(project);
    const dest = this.getDestinationPath(repoName);

    if (fs.existsSync(dest)) {
      console.log(`[GitService] Repo already exists at: ${dest}`);
      return await this.sendStartChunkingMethod(repoName);
    }

    console.log(`[GitService] Cloning ${repoUrl} → ${dest}`);
    await this.git.clone(repoUrl, dest, ['--branch', branch, '--single-branch']);
    console.log('[GitService] Clone successful.');
    return await this.sendStartChunkingMethod(repoName);
  }

  private async sendStartChunkingMethod(repoName) {
    await Utils.pushMessageToQueue(EventNameForPush.START_CHUNKING, { repoName });

  }

  public async pull(repoName: string): Promise<void> {
    const dest = this.getDestinationPath(repoName);

    if (!fs.existsSync(dest)) {
      throw new Error(`[GitService] Repo not found at: ${dest}`);
    }

    console.log(`[GitService] Pulling latest changes in ${dest}`);
    const repoGit = simpleGit(dest);
    await repoGit.pull();
    console.log('[GitService] Pull complete.');
  }
}
