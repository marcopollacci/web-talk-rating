import express from 'express';
import {
  GetAllEventsRatingResponse,
  GetEvents,
  GetSingleEventResponse,
  queryEvents,
} from '../../models/rating.model';
import { executeApiCall } from '../helpers/api.helper';
import { QueryDBHelper } from '../helpers/querydb.helper';
import { sendTelegramMessage } from '../helpers/telegram.helper';

const router = express.Router();
const connectionDBNeon = new QueryDBHelper(process.env['NEON_DATABASE_URL']!);

router.use(express.json());

router.get('/up-neon', async (_req, res) => {
  const { status, message } = await executeApiCall<string>(
    connectionDBNeon.getVersion.bind(connectionDBNeon)
  );
  res.status(status);
  res.json({ messge: !!message ? 'OK' : 'KO' });
});

router.get('/get-all-events-rating', async (req, res) => {
  const { status, message } = await executeApiCall<
    GetAllEventsRatingResponse[]
  >(
    connectionDBNeon.getAllEventsRating.bind(
      connectionDBNeon,
      req.query['event'] as queryEvents
    )
  );

  res.status(status);
  res.json(message);
});

router.get('/get-all-events', async (_req, res) => {
  const { status, message } = await executeApiCall<GetEvents>(
    connectionDBNeon.getAllEvents.bind(connectionDBNeon)
  );
  res.status(status);
  res.json(message);
});

router.get('/get-event/:eventId', async (req, res) => {
  const { status, message } = await executeApiCall<GetSingleEventResponse>(
    connectionDBNeon.getEvent.bind(connectionDBNeon, req.params.eventId)
  );

  res.status(status);

  if (Array.isArray(message) && message.length > 0) {
    res.json(message[0]);
    return;
  }

  res.json(message);
});

router.post('/insert-rating/:eventId', async (req, res) => {
  const [event = null] = await connectionDBNeon.getEvent(req.params.eventId);

  if (!event) {
    res.status(404);
    res.json({
      message: 'Event not found',
    });
    return;
  }

  if (!event['vote_enabled']) {
    res.status(400);
    res.json({
      message: 'Vote not enabled',
    });
    return;
  }

  const { status, message } = await executeApiCall<void>(
    connectionDBNeon.insertRating.bind(
      connectionDBNeon,
      req.params.eventId,
      req.body
    )
  );

  if (process.env['TELEGRAM_BOT_API']) {
    try {
      //sending on Telegram chat if enabled
      if (status === 500) {
        event['name_event'] = `ERRORE 500 - ${event['name_event']}`;
      }
      sendTelegramMessage(event['name_event'], event['talk'], req.body);
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
