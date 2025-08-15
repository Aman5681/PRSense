import * as express from 'express';
import { GitController } from '../controllers/GitController';

const router = express.Router();
const gitController = new GitController();

router.get('/clone-git-repo/:repoName/:branch', gitController.cloneRepo.bind(gitController));

export default router;