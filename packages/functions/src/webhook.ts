import * as queryString from 'node:querystring';
import { ApiHandler } from "sst/node/api";
import { getPollById, updatePollVote } from '@rocket-tower-poll-bot/core/table';
import { formatPollMessage } from '@rocket-tower-poll-bot/core/slack';

export const handler = ApiHandler(async (event) => {
  console.log('Received event', event);
  if (event.requestContext.http.method !== 'POST' || !event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid request' }),
    };
  }
  const decodedBody = queryString.parse(Buffer.from(event.body, 'base64').toString('utf-8')) as { payload: string };
  const {
    callback_id,
    user,
    actions,
  } = JSON.parse(decodedBody.payload) as any;

  const poll = await getPollById(callback_id);
  if (!poll) {
    console.log('Update for not found poll', decodedBody);
    return {
      statusCode: 200,
      body: 'Poll not found',
    };
  }

  const updatedPoll = await updatePollVote(poll, user.name, parseInt(actions[0].value, 10));

  return {
    statusCode: 200,
    body: JSON.stringify({
      attachments: [formatPollMessage(updatedPoll)],
    })
  };
});
