export const isEnterKey = (e: React.KeyboardEvent<HTMLElement>) => {
   return ( 'Enter' === e.key || 'Enter' === e.code || 'NumpadEnter' === e.code
         || 13 === e.which || 13 === e.keyCode );
}
