import {when} from "jest-when";
import {API} from "aws-amplify";

import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

import authorList from "../../data/authorList.json";

import {useAppSelector} from "../../app/hooks";
import {Author, emptyAuthor} from "../../Author/AuthorType";


export const setupAuthorListMocking = () => {
   when(API.graphql)
      .calledWith(expect.objectContaining({query: queries.listAuthors} ))
      .mockReturnValue(Promise.resolve({data: { listAuthors: authorList } }));
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
export const setUpdatedUser = (author: Author) => { updatedAuthor = author; }

export const setupAuthorMocking = () => {
   when(API.graphql)
      .calledWith(expect.objectContaining({query: queries.getAuthor} ))
      .mockReturnValue(Promise.resolve({data: { getAuthor: authorList.items[0] } }));

   when(API.graphql)
      .calledWith(expect.objectContaining({query: mutations.createAuthor} ))
      .mockReturnValue(Promise.resolve({data: { createAuthor: newAuthor } }));

   when(API.graphql)
      .calledWith(expect.objectContaining({query: mutations.updateAuthor} ))
      .mockReturnValue(Promise.resolve({data: { updateAuthor: updatedAuthor } }));
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
