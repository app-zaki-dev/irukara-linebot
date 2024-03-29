import { TextMessage } from '@line/bot-sdk';
import { saveMessage } from 'src/dynamodb';
import { saveQuick } from 'src/line/quickReply/saveQuick';
import { MessageCounts } from 'src/types/user';

export async function answer(
  hashUserId: string,
  currentMode: number,
  event: any,
  replyText: string,
  messageCount: MessageCounts,
): Promise<TextMessage> {
  console.log('リプライテキスト', replyText);
  // 回答をmessageテーブルに保存
  await saveMessage(event, replyText, messageCount);
  // userテーブルのメッセージカウントを更新
  // await updateCount(hashUserId);

  const quickItems = await saveQuick(event, currentMode, replyText);

  return {
    type: 'text',
    text: replyText,
    quickReply: {
      items: quickItems,
    },
  };
}
