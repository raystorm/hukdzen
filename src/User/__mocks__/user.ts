import { rest } from 'msw';
import { userListUrl } from '../userSaga';
import userListJson from '../../data/userList.json';

export const userHandlers = [

  rest.get(userListUrl, (request, result, context) => {

    //TODO: any necessary logic here

    return result(context.status(200), context.json(userListJson));
  }),
]