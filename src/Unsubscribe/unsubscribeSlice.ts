import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { EmailPreferences } from '../User/userType';

interface UnsubscribeState
{
   token: string | null;
   decodedEmail: string;
   emailConfirmed: boolean;
   preferences: EmailPreferences | null;
   loading: boolean;
   error: string;
   success: boolean;
}

const initialState: UnsubscribeState = {
   token: null,
   decodedEmail: '',
   emailConfirmed: false,
   preferences: null,
   loading: false,
   error: '',
   success: false
};

const unsubscribeSlice = createSlice({
   name: 'unsubscribe',
   initialState,
   reducers:
   {
      setToken: (state, action: PayloadAction<{ token: string; email: string }>) =>
      {
         state.token = action.payload.token;
         state.decodedEmail = action.payload.email;
         state.error = '';
      },
      setTokenError: (state, action: PayloadAction<string>) =>
      { state.error = action.payload; },
      confirmEmail: (state, action: PayloadAction<string>) =>
      {
         state.loading = true;
         state.error = '';
      },
      confirmEmailSuccess: (state, action: PayloadAction<EmailPreferences>) =>
      {
         state.emailConfirmed = true;
         state.preferences = action.payload;
         state.loading = false;
      },
      confirmEmailFailure: (state, action: PayloadAction<string>) =>
      {
         state.error = action.payload;
         state.loading = false;
      },
      updatePreferences: (state, action: PayloadAction<{ email: string; token: string; preferences: EmailPreferences }>) =>
      {
         state.loading = true;
         state.error = '';
      },
      updatePreferencesSuccess: (state) =>
      {
         state.success = true;
         state.loading = false;
      },
      updatePreferencesFailure: (state, action: PayloadAction<string>) =>
      {
         state.error = action.payload;
         state.loading = false;
      },
      reset: () => initialState
   }
});

export const {
   actions: unsubscribeActions,
   reducer: unsubscribeReducer,
} = unsubscribeSlice;
