export type DooraySlashCommandRequest = {
  tenantId: string;
  tenantDomain: string;
  channelId: string;
  channelName: string;
  userId: string;
  command: string;
  text: string;
  responseUrl: string;
  appToken: string;
  cmdToken: string;
  triggerId: string;
};

/**
const example : DooraySlashCommandRequest = {
    "tenantId": "1234567891234567891",
    "tenantDomain": "guide.dooray.com",
    "channelId": "1234567891234567891",
    "channelName": "커맨드 가이드 채널",
    "userId": "1234567891234567891",
    "command": "/hi",
    "text": "",
    "responseUrl": "https://guide.dooray.com/messenger/api/commands/hook/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "appToken": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "cmdToken": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "triggerId": "1234567891234.xxxxxxxxxxxxxxxxxxxx"
}
*/

export type DooraySlashCommandResponse = {
  text: string;
  responseType: "inChannel" | "ephemeral";
  replaceOriginal?: boolean;
  deleteOriginal?: boolean;
  attachments: {
    title: string;
    fields: {
      title: string;
      value: string;
    }[];
  }[];
};

type DooraySlashCommandAttachment = {
  title: string;
  fields: {
    title: string;
    value: string;
  }[];
};
