import app from './app';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  logger.info(`Server is running on port ${PORT}`);
  logger.info(`API docs available at http://localhost:${PORT}/api-docs`);
});
