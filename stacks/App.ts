import { StackContext, Config, Table, Function, Cron } from "sst/constructs";

export function App({ stack }: StackContext) {
  const SLACK_TOKEN = new Config.Secret(stack, "SLACK_TOKEN");
  const DAILY_POLL_CHANNEL_ID = new Config.Secret(stack, "DAILY_POLL_CHANNEL_ID");

  const tablePoll = new Table(stack, "Poll", {
    fields: {
      id: 'string',
    },
    primaryIndex: {
      partitionKey: 'id',
    }
  });

  const webhook = new Function(stack, "Webhook", {
    bind: [tablePoll, SLACK_TOKEN],
    handler: "packages/functions/src/webhook.handler",
    url: true,
  });

  const dailyPoll = new Function(stack, "DailyPoll", {
    bind: [tablePoll, webhook, SLACK_TOKEN, DAILY_POLL_CHANNEL_ID],
    handler: "packages/functions/src/dailyPoll.handler",
  });

  const cronDailyPoll = new Cron(stack, "CronDailyPoll", {
    schedule: "cron(0 16 ? * 1-5 *)",
    job: dailyPoll,
    enabled: true,
  });

  stack.addOutputs({
    WebhookUrl: webhook.url,
    Table: tablePoll.tableName,
  });

  return {
    tablePoll,
    webhook,
    dailyPoll,
    cronDailyPoll,
  }
}
