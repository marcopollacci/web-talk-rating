import { VoteFormInterface } from '@features/events/models/vote.model';

export const sendTelegramMessage = async (
  nameEvent: string,
  talk: string,
  formData: VoteFormInterface
) => {
  const { TELEGRAM_BOT_API, TELEGRAM_CHAT_ID } = process.env;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_API}/sendMessage`;

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: `<b>${nameEvent}</b>\n<b>${talk}</b>\nRating: <b>${
        formData.rating
      }</b>\n\nComments:\n${formData.comment || 'N/A'}`,
      parse_mode: 'HTML',
    }),
  });
};

export const sendTelegramPhoto = async (photo: Express.Multer.File) => {
  const { TELEGRAM_BOT_API, TELEGRAM_CHAT_ID } = process.env;
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_API}/sendPhoto`;

  const photoBuffer = photo.buffer;

  const formData = new FormData();
  formData.append('chat_id', TELEGRAM_CHAT_ID!);
  formData.append(
    'photo',
    new Blob([photoBuffer as BlobPart]),
    photo.originalname
  );

  fetch(url, {
    method: 'POST',
    body: formData,
  });
};
