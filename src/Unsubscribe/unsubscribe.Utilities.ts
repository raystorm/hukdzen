
export interface UnsubscribeTokenPayload
{
   userId: string;
   email: string;
}

const base64UrlDecode = (str: string): string =>
{
   str = str.replace(/-/g, '+').replace(/_/g, '/');
   while (str.length % 4) { str += '='; }
   return atob(str);
};

export const decodeUnsubscribeToken = (token: string): UnsubscribeTokenPayload | null =>
{
   try
   {
      const parts = token.split('.');
      if (parts.length !== 3) { return null; }
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      return { userId: payload.userId, email: payload.email };
   }
   catch { return null; }
};
