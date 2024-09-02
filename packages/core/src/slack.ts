import { Config } from 'sst/node/config';
import { Poll } from './Poll';

export const formatPollMessage = (poll: Poll) => {
  return {
    callback_id: poll.id,
    mrkdwn_in: ["text", "title", "value"],
    attachment_type: "default",
    color: "#3AA3E3",
    text: poll.question,
    fields: [...poll.options.map((option, index) => {
      const votes = Object.entries(poll.votes).reduce((acc, [user, vote]) => {
        if (vote === index) {
          acc.push(user);
        }
        return acc;
      }, [] as string[]);

      return {
        title: option + ' (`' + votes.length + '`)',
        value: votes.join(", "),
        short: false,
      };
    }), ...(
      poll.updated_by && poll.updated_at ? [{
        value: '_Last update by ' + poll.updated_by + ' ' + new Date(poll.updated_at).toLocaleString('fr-FR') + '_',
        short: false,
      }] : []
    )],
    actions: poll.options.map((option, index) => ({
      name: "vote",
      text: option,
      type: "button",
      value: index.toString(),
    })),
  }
}

export const updateSlackMessage = async (poll: Poll) => {
  await fetch('https://slack.com/api/chat.update', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Config.SLACK_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      channel: poll.slack_channel_id,
      ts: poll.slack_message_id,
      attachments: [formatPollMessage(poll)],
    }),
  });
}

export const createSlackMessage = async (poll: Poll): Promise<Poll> => {
  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Config.SLACK_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      channel: poll.slack_channel_id,
      attachments: [formatPollMessage(poll)],
    }),
  });
  const body = await res.json() as { ts: string };
  return {
    ...poll,
    slack_message_id: body.ts,
  };
}
