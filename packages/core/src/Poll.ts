export type Poll = {
  id: string;
  slack_channel_id: string;
  slack_message_id: string;
  question: string;
  options: string[];
  votes: Record<string, number>;
  updated_by?: string;
  updated_at?: string;
  created_by?: string;
  created_at?: string;
};
