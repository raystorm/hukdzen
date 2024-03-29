import {when} from "jest-when";
import {API} from "aws-amplify";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";

import authorList from "../../data/authorList.json";
import {Author, emptyAuthor} from "../../Author/AuthorType";
import {useAppSelector} from "../../app/hooks";


export const setupAuthorListMocking = () => {
   when(API.graphql)
      .calledWith(expect.objectContaining({query: queries.listAuthors} ))
      .mockResolvedValue({data: { listAuthors: authorList } });
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
   when(API.graphql)
     .calledWith(expect.objectContaining({query: queries.getAuthor} ))
     .mockResolvedValue({data: { getAuthor: authorList.items[0] } });

   when(API.graphql)
     .calledWith(expect.objectContaining({query: mutations.createAuthor} ))
     .mockResolvedValue({data: { createAuthor: newAuthor } });

   when(API.graphql)
     .calledWith(expect.objectContaining({query: mutations.updateAuthor} ))
     .mockResolvedValue({data: { updateAuthor: updatedAuthor } });
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
