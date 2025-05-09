import express from 'express';
import { QueryDBHelper } from '../helpers/querydb.helper';

console.log(
  '🚀 ~ file: read.route.ts ~ process.env.NEON_DATABASE_URL:',
  process.env['NEON_DATABASE_URL']
);

const router = express.Router();
const connectionDBNeon = new QueryDBHelper(process.env['NEON_DATABASE_URL']!);
await connectionDBNeon.setSchema();

router.use('/up-neon', async (_req, res) => {
  let status = 200;
  let message = 'OK';
  try {
    await connectionDBNeon.getVersion();
  } catch (error) {
    console.log('🚀 ~ router.use ~ error:', error);
    status = 500;
    message = 'KO';
  }

  res.status(status);
  res.json({
    message,
  });
});

router.use('/get-all-events-rating', async (_req, res) => {
  let status = 200;
  let results;

  try {
    const result = await connectionDBNeon.getAllEventsRating();
    results = result;
  } catch (error) {
    console.log('🚀 ~ router.use ~ error:', error);
    status = 500;
    results = 'KO';
  }

  res.status(status);
  res.json({
    results,
  });
});

router.use('/get-all-events', async (_req, res) => {
  let status = 200;
  let results;

  try {
    const result = await connectionDBNeon.getAllEvents();
    results = result;
  } catch (error) {
    console.log('🚀 ~ router.use ~ error:', error);
    status = 500;
    results = 'KO';
  }

  res.status(status);
  res.json({
    results,
  });
});

export { router as readRouter };
