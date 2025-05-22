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
