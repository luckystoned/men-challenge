import mongoose from 'mongoose';
import logger from '../utils/logger';
import seedDatabase from './seeds';
import ENVIRONMENTS from '../constants/environments';

const connectToDatabase = async () => {
  try {
    const { MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER } = process.env;

    const mongoOptions = {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 1000,
    };

    const withCredentials = MONGO_USERNAME && MONGO_PASSWORD;

    const mongoCredentials = withCredentials && {
      user: MONGO_USERNAME,
      pass: MONGO_PASSWORD,
    };

    await mongoose.connect(
      `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_CLUSTER}/?retryWrites=true&w=majority`,
      { ...mongoCredentials, ...mongoOptions },
    );

    if (process.env.NODE_ENV !== ENVIRONMENTS.TEST) {
      seedDatabase();
    }
  } catch (error) {
    logger.error(error);
  }
};

export default { connectToDatabase, seedDatabase };
