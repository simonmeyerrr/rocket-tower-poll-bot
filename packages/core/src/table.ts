import { TableDefinition, TableClient } from '@hexlabs/dynamo-ts';
import { Table } from 'sst/node/table';
import { dynamoClient } from './dynamo';
import { Poll } from './Poll';

const table = TableClient.build(TableDefinition.ofType<Poll>().withPartitionKey('id'), {
  tableName: Table.Poll.tableName,
  client: dynamoClient,
  logStatements: false,
});

export const getPollById = async (id: string): Promise<Poll | undefined> => {
  const res = await table.get({ id });
  return res.item;
}

export const createPoll = async (poll: Poll): Promise<Poll> => {
  await table.put(poll);
  return poll;
}

export const updatePollVote = async (poll: Poll, user: string, vote: number | undefined): Promise<Poll> => {
  const updates = {
    votes: { ...poll.votes },
    updated_by: user,
    updated_at: new Date().toISOString(),
  };

  if (vote === undefined || updates.votes[user] === vote) {
    delete updates.votes[user];
  } else {
    updates.votes[user] = vote;
  }

  await table.update({
    key: { id: poll.id },
    updates,
  });

  return {
    ...poll,
    ...updates,
  };
}

export const deletePoll = async (id: string): Promise<void> => {
  await table.delete({ id });
}
