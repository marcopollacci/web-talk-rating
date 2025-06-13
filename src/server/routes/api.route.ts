import express from 'express';
import multer from 'multer';
import {
  GetAllEventsRatingResponse,
  GetAllEventsRatingResponseCached,
  GetEvents,
  GetSingleEventResponse,
  queryEvents,
} from '../../models/rating.model';
import { executeApiCall } from '../helpers/api.helper';
import { isTTLExpired } from '../helpers/cache.helper';
import { QueryDBHelper } from '../helpers/querydb.helper';
import {
  sendTelegramMessage,
  sendTelegramPhoto,
} from '../helpers/telegram.helper';

const router = express.Router();
const connectionDBNeon = new QueryDBHelper(process.env['NEON_DATABASE_URL']!);
const cacheMemoryMap = new Map<string, GetAllEventsRatingResponseCached>();

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
  const getKeyCached = cacheMemoryMap.get('get-all-events');

  if (getKeyCached && isTTLExpired(getKeyCached.ttl)) {
    res.status(200);
    res.json(getKeyCached.value);
    return;
  }
  const { status, message } = await executeApiCall<GetEvents>(
    connectionDBNeon.getAllEvents.bind(connectionDBNeon)
  );

  if (status === 200) {
    cacheMemoryMap.set('get-all-events', {
      value: message,
      ttl: Date.now() + 1000 * 60 * 60 * 24, // 1 day
    });
  }

  res.status(status);
  res.json(message);
});

router.get('/get-event/:eventId', async (req, res) => {
  const getKeyCached = cacheMemoryMap.get(`get-event-${req.params.eventId}`);

  if (getKeyCached && isTTLExpired(getKeyCached.ttl)) {
    res.status(200);
    res.json(getKeyCached.value);
    return;
  }

  const { status, message } = await executeApiCall<GetSingleEventResponse>(
    connectionDBNeon.getEvent.bind(connectionDBNeon, req.params.eventId)
  );

  res.status(status);

  if (Array.isArray(message) && message.length > 0) {
    res.json(message[0]);

    if (status === 200) {
      cacheMemoryMap.set(`get-event-${req.params.eventId}`, {
        value: message[0],
        ttl: Date.now() + 1000 * 60 * 60 * 24, // 1 day
      });
    }

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

const upload = multer({ storage: multer.memoryStorage() });

router.post('/insert-photo', upload.single('file'), async (req, res) => {
  if (process.env['TELEGRAM_BOT_API']) {
    try {
      //sending on Telegram chat if enabled
      sendTelegramPhoto(req.file!);
    } catch (error) {
      console.error('🚀 ~ router.use ~ error:', error);
    }
  }
  res.json({
    message: 'OK',
  });
});

router.post('/clean-cache', async (_req, res) => {
  cacheMemoryMap.clear();
  res.json({
    message: 'OK',
  });
});

export { router as apiRouter };
