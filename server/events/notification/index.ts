import logger from '~/lib/logger';
import type { WebhookNotification } from '~/types';
import {
  getMessages,
  getThreadMessages,
  updateStatus,
} from '~/lib/discourse';
import { generateResponse } from '~/utils/generate-response';
import type { GetSessionResponse } from '~~/client/types.gen';

export const name = 'notification';
export const once = false;

export async function execute(
  payload: WebhookNotification,
  botUser: GetSessionResponse['current_user'],
) {
  if (!botUser || payload.data?.mentioned_by_username === botUser.username) return;
  if (!(payload?.notification_type === 29 && payload?.user_id === botUser.id))
    return;

  logger.info('processing AI request from notification');

  const { chat_channel_id: channel_id } = payload?.data;
  const thread_id = (payload?.data?.chat_thread_id as number) ?? undefined;
  const updateMessage = await updateStatus(
    'bro',
    channel_id as number,
    thread_id,
  );

  const messages = thread_id
    ? await getThreadMessages(channel_id as number, botUser, thread_id)
    : await getMessages(channel_id as number, botUser);
  const result = await generateResponse(messages, updateMessage);

  await updateMessage(result);

  logger.info(`replied to ${payload.data?.mentioned_by_username}: ${result}`);
}
