import {vi} from 'vitest';
import {when} from "vitest-when";

import { Amplify } from "aws-amplify";
import { generateClient } from '@aws-amplify/api';

import amplifyConfig from '../../amplifyconfiguration.json';
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

import authorList from "../__fixtures__/authorList.json";
import {Author, emptyAuthor} from "../../Author/AuthorType";
import {useAppSelector} from "../../app/hooks";

Amplify.configure(amplifyConfig);

const client = generateClient();

export const setupAuthorListMocking = () => {
   when(client.graphql)
     .calledWith(expect.objectContaining({ query: queries.listAuthors } ))
     .thenResolve({data: { listAuthors: authorList } });
}

export const defaultCreatedAuthor: Author = {
   ...emptyAuthor,
   id:    'Newly Generated GUID',
   name:  'Newly Created Author Name',
   email: 'NewAuthor@Example.com',
   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
}

let newAuthor = defaultCreatedAuthor;
export const setCreatedAuthor = (author: Author) => { newAuthor = author; }

let updatedAuthor: Author = authorList.items[0] as Author;
export const setUpdatedAuthor = (author: Author) => { updatedAuthor = author; }

export const setupAuthorMocking = () => {
   when(client.graphql)
     .calledWith(expect.objectContaining({query: queries.getAuthor } ))
     .thenResolve({data: { getAuthor: authorList.items[0] } });

   when(client.graphql)
     .calledWith(expect.objectContaining({query: mutations.createAuthorGuarded } ))
     .thenResolve({data: { createAuthorGuarded: newAuthor } });

   when(client.graphql)
     .calledWith(expect.objectContaining({query: mutations.updateAuthorGuarded } ))
     .thenResolve({data: { updateAuthorGuarded: updatedAuthor } });
}

export const AuthorPrinter = () => {
   const author = useAppSelector(state => state.author);

   return (
     <div data-testid='author-info-dumps' >
       <h2>Author:</h2>
       <pre><code>{JSON.stringify(author, null,2)}</code></pre>
     </div>
   );
}
