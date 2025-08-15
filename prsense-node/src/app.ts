import './config';
import express from 'express';
import { QueueManager } from './queue/QueueManager';
import gitRoutes from './routes/GitRoutes';
import { swaggerSpec } from './docs/Swagger';
import swaggerUi from 'swagger-ui-express';
import { Config } from './config';


async function init() {
  const queue = QueueManager.getInstance();
  await queue.init()

  const app = express();
  app.use(express.json());
  const PORT = Config.PORT
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  app.use('/git', gitRoutes);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

init()
