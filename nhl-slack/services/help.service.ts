import { MessageAttachment } from '@slack/bolt';
import { Injectable } from '@nhl/core';

@Injectable()
export class HelpService {
  constructor() {}

  public help(): MessageAttachment {
    return {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'NHL bot message'
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: "`/schedule` - games of the day's"
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: "`/scores` - results of yesterday's games"
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text:
              '`/standing (west/east/north/central)` - Return the current NHL standings for all or a specific conference/division '
          }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '`/help` - check the commands'
          }
        }
      ]
    };
  }
}
