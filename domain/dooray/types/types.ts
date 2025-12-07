export type DoorayBotMessage = {
  botName: string;
  botIconImage: string;
  text?: string;
  attachments?: DoorayAttachment[];
};

export type DoorayAttachment = {
  title?: string;
  imageUrl?: string;
  color?: string;
};

export type DoorayMessageBody = {
  text: string;
  attachments: {
    title: string;
    fields: {
      title: string;
      value: string;
    }[];
  }[];
};
