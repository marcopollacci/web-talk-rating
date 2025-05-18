import express from 'express';
import {
  GetAllEventsRatingResponse,
  GetEvents,
  queryEvents,
} from '../../models/rating.model';
import { QueryDBHelper } from '../helpers/querydb.helper';
import { sendTelegramMessage } from '../helpers/telegram.helper';

const router = express.Router();
const connectionDBNeon = new QueryDBHelper(process.env['NEON_DATABASE_URL']!);
const MESSAGE_KO = { message: 'KO' } as const;

router.use(express.json());

router.get('/up-neon', async (_req, res) => {
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

router.get('/get-all-events-rating', async (req, res) => {
  let status = 200;
  let results;

  try {
    results = await connectionDBNeon.getAllEventsRating<
      GetAllEventsRatingResponse[]
    >(req.query['event'] as queryEvents);
  } catch (error) {
    console.log('🚀 ~ router.use ~ error:', error);
    status = 500;
    results = MESSAGE_KO;
  }
  res.status(status);
  res.json(results);
});

router.get('/get-all-events', async (_req, res) => {
  let status = 200;
  let results;

  try {
    const result = await connectionDBNeon.getAllEvents<GetEvents>();
    results = result;
  } catch (error) {
    console.log('🚀 ~ router.use ~ error:', error);
    status = 500;
    results = MESSAGE_KO;
  }

  res.status(status);
  res.json(results);
});

router.get('/get-event/:eventId', async (req, res) => {
  let status = 200;
  let results;

  try {
    const result = await connectionDBNeon.getEvent(req.params.eventId);
    [results] = result;
  } catch (error) {
    console.log('🚀 ~ router.use ~ error:', error);
    status = 500;
    results = MESSAGE_KO;
  }

  res.status(status);
  res.json(results);
});

router.post('/insert-rating/:eventId', async (req, res) => {
  let status = 200;
  let message = 'OK';
  try {
    await connectionDBNeon.insertRating(req.params.eventId, req.body);
  } catch (error) {
    console.log('🚀 ~ router.use ~ error:', error);
    status = 500;
    message = MESSAGE_KO.message;
  }

  if (process.env['TELEGRAM_BOT_API']) {
    try {
      //sending on Telegram chat if enabled
      const [event = null] = await connectionDBNeon.getEvent(
        req.params.eventId
      );
      if (event) {
        sendTelegramMessage(event['name_event'], event['talk'], req.body);
      }
    } catch (error) {
      console.error('🚀 ~ router.use ~ error:', error);
    }
  }

  res.status(status);
  res.json({
    message,
  });
});

export { router as apiRouter };
