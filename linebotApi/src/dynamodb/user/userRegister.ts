import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import DynamoClient from 'src/dynamodb/client';
import {
  TransactWriteItemsCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb';
import { jpDayjs } from 'src/common';

import type { UsersTable, UserInfo } from 'src/types/user';
import { eventScheduler } from 'src/scheduler';

/**
 * ユーザーが未登録なら登録する
 * @params userId
 * @params mode
 * @returns JSON形式のレスポンス string
 */
export const registerUser = async (
  userId: string,
  mode?: number,
): Promise<string> => {
  let response;
  try {
    console.log('登録時のユーザーID', userId);
    const client = DynamoClient();

    const selectMode = mode ? mode : 0;
    /**
     * 初期status
     * 0...無料、1...イルカモ、2...イルカラ、3...1から無料、
     * 4...2から無料、5...イルカモからイルカラ、6...お試し中に解約
     */
    const status = 0;

    const params: UsersTable = {
      userId: userId,
      lineId: userId,
      registerMethod: 'linebot',
      providerType: 'line',
      mode: selectMode,
      status: status,
      weekMsg: 0,
      totalMsg: 0,
      weekMsgSave: 0,
      totalMsgSave: 0,
      weekImg: 0,
      totalImg: 0,
      weekImgSave: 0,
      totalImgSave: 0,
      lastLogin: jpDayjs().unix(),
      createdAt: jpDayjs().unix(),
    };

    const transactItem = {
      TransactItems: [
        {
          Put: {
            TableName: process.env.DYNAMODB_USER_TABLE_NAME,
            Item: marshall(params || {}),
          },
        },
      ],
    };

    await client.send(new TransactWriteItemsCommand(transactItem));

    // // スケジュールを作成する
    const scheduleResult = await eventScheduler(params.status, userId);
    console.log('スケジュール作成結果', scheduleResult);

    response = JSON.stringify({
      statusCode: 200,
      body: {
        data: params,
      },
    });
  } catch (err) {
    response = JSON.stringify({
      statusCode: 500,
      message: err.errorMessage,
      stack: err.stack,
    });
  }
  console.log('userRegister Result...', response);
  return response;
};

/**
 * ユーザーIDから登録済みかどうか判定しtrueならユーザー情報を返却する
 * @param userId
 * @returns RegisterUserData
 */
export const isRegisterUser = async (userId: string): Promise<UserInfo> => {
  try {
    const client = DynamoClient();

    const params = {
      TableName: process.env.DYNAMODB_USER_TABLE_NAME,
      Key: marshall({ userId }),
    };

    const { Item } = await client.send(new GetItemCommand(params));

    const searchUser = JSON.stringify({
      data: Item ? unmarshall(Item) : {},
      isRegister: true,
    });
    const searchUserParse = JSON.parse(searchUser);

    if (Object.keys(searchUserParse.data).length === 0) {
      return false;
    } else {
      return searchUser;
    }
  } catch (err) {
    console.log('search User error...', err);
    return false;
  }
};
