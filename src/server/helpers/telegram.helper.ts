import { VoteFormInterface } from '@features/events/models/vote.model';

export const sendTelegramMessage = async (
  nameEvent: string,
  talk: string,
  formData: VoteFormInterface
) => {
  const url = `https://api.telegram.org/bot${process.env['TELEGRAM_BOT_API']}/sendMessage`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: process.env['TELEGRAM_CHAT_ID'],
      text: `<b>${nameEvent}</b>\n<b>${talk}</b>\nRating: <b>${
        formData.rating
      }</b>\n\nComments:\n${formData.comment || 'N/A'}`,
      parse_mode: 'HTML',
    }),
  });
};
