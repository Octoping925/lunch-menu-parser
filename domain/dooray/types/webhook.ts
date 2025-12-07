export type DoorayIncomingWebhookRequest = {
  channelId: string;
  responseType: "inChannel" | "ephemeral";
  text: string;
  attachments: {
    title: string;
    fields: DoorayIncomingWebhookAttachment[];
  }[];
};

export type DoorayIncomingWebhookAttachment =
  | {
      title: string;
      fields: {
        title: string;
        value: string;
        short?: boolean;
      };
    }
  | {
      callbackId: string;
      actions: {
        name: string;
        type: string;
        text: string;
        value: string;
        stype?: string;
      }[];
    };
