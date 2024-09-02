import { v4 as uuidV4 } from 'uuid';
import { Config } from 'sst/node/config';
import { createSlackMessage } from '@rocket-tower-poll-bot/core/slack';
import { createPoll } from '@rocket-tower-poll-bot/core/table';

export const handler = async () => {
  console.log('Creating poll');
  const poll = await createSlackMessage({
    id: uuidV4(),
    slack_channel_id: Config.DAILY_POLL_CHANNEL_ID,
    slack_message_id: 'test',
    question: '<!here> Seras-tu présent demain ?',
    options: [
      ':sunrise: Matin',
      ':bento: Midi - tupperware',
      ':pizza: Midi - dehors',
      ':sauner: Aprem',
      ':brad: Non',
    ],
    votes: {},
    created_at: new Date().toISOString(),
  });
  await createPoll(poll);
  console.log('Poll created', poll);
};
