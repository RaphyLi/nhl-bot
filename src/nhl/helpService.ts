import { MessageAttachment } from "@slack/bolt";

export class HelpService {
    constructor() {

    }

    public help(): MessageAttachment {
        return {
            blocks: [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "NHL bot message"
                    },
                },
                {
                    "type": "section",
                    "text":
                    {
                        "type": "mrkdwn",
                        "text": "`schedule` - games of the day's"
                    }
                },
                {
                    "type": "section",
                    "text":
                    {
                        "type": "mrkdwn",
                        "text": "`scores` - results of yesterday's games"
                    }
                },
                {
                    "type": "section",
                    "text":
                    {
                        "type": "mrkdwn",
                        "text": "`live` - current games"
                    }
                },
                {
                    "type": "section",
                    "text":
                    {
                        "type": "mrkdwn",
                        "text": "`help` - check the commands"
                    }
                },
            ]
        }
    }
}
