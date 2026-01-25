import jwt from 'jsonwebtoken';

const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL || window.location.origin;

export interface UnsubscribeTokenPayload
{
   userId: string;
   email: string;
}

export const generateUnsubscribeToken = (userId: string, email: string): string =>
{
   const JWT_SECRET = process.env.REACT_APP_JWT_SECRET || '';
   if (!JWT_SECRET) { throw new Error('REACT_APP_JWT_SECRET not configured'); }

   return jwt.sign(
      { userId, email } as UnsubscribeTokenPayload,
      JWT_SECRET,
      { expiresIn: '90d' }
   );
};

export const generateUnsubscribeUrl = (userId: string, email: string): string =>
{
   const token = generateUnsubscribeToken(userId, email);
   return `${FRONTEND_URL}/unsubscribe?token=${token}`;
};

export const decodeUnsubscribeToken = (token: string): UnsubscribeTokenPayload | null =>
{
   try { return jwt.decode(token) as UnsubscribeTokenPayload; }
   catch { return null; }
};
