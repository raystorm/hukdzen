import { rest } from 'msw';
import { boxListUrl } from '../boxSaga';
import boxListJson from '../../data/boxList.json';

export const boxHandlers = [

  rest.get(boxListUrl, (request, result, context) => {

    //TODO: any necessary logic here

    return result(context.status(200), context.json(boxListJson));
  }),
]