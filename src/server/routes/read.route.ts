import express from 'express';
import { QueryDBHelper } from '../helpers/querydb.helper';
import { GetAllEventsRatingResponse } from '../../models/rating.model';
import { mappingRating } from '../helpers/rating.helper';

const router = express.Router();
const connectionDBNeon = new QueryDBHelper(process.env['NEON_DATABASE_URL']!);
await connectionDBNeon.setSchema();
const MESSAGE_KO = { message: 'KO' } as const;

router.use('/up-neon', async (_req, res) => {
  let status = 200;
  let message = 'OK';
  try {
    await connectionDBNeon.getVersion();
  } catch (error) {
    console.log('🚀 ~ router.use ~ error:', error);
    status = 500;
    message = MESSAGE_KO.message;
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
    const result = await connectionDBNeon.getAllEventsRating<
      GetAllEventsRatingResponse[]
    >();
    results = mappingRating(result);
  } catch (error) {
    console.log('🚀 ~ router.use ~ error:', error);
    status = 500;
    results = MESSAGE_KO;
  }
  res.status(status);
  res.json(results);
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
    results = MESSAGE_KO;
  }

  res.status(status);
  res.json(results);
});

export { router as readRouter };
