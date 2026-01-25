import { call, put, takeLatest } from 'redux-saga/effects';
import type { PayloadAction } from '@reduxjs/toolkit';
import { logger } from '../utils/logger';
import { isDev } from '../utils/location';
import { unsubscribeActions } from './unsubscribeSlice';
import type { EmailPreferences } from '../User/userType';

function getApiBaseUrl(): string
{
   if ( isDev() )
   { return 'https://emailOptOut.dev.smalgyax-files.org'; }
   
   return 'https://emailOptOut.api.smalgyax-files.org';
}

export function getPublicEmailPreferences(email: string)
{
   return fetch(`${getApiBaseUrl()}/preferences?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
   }).then(res => res.json());
}

export function updatePublicEmailPreferences(email: string, token: string, preferences: EmailPreferences)
{
   return fetch(`${getApiBaseUrl()}/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, preferences })
   }).then(res => res.json());
}

export function* handleConfirmEmail(action: PayloadAction<string>): any
{
   try
   {
      logger.log('handleConfirmEmail', action.payload);
      const prefs = yield call(getPublicEmailPreferences, action.payload);

      if (!prefs)
      {
         yield put(unsubscribeActions.confirmEmailFailure('User not found'));
         return;
      }

      yield put(unsubscribeActions.confirmEmailSuccess(prefs));
   }
   catch (error)
   {
      logger.error('Error confirming email:', error);
      yield put(unsubscribeActions.confirmEmailFailure('Could not load preferences'));
   }
}

export function* handleUpdatePreferences(action: PayloadAction<{ email: string; token: string; preferences: EmailPreferences }>): any
{
   try
   {
      logger.log('handleUpdatePreferences', action.payload);
      const { email, token, preferences } = action.payload;
      yield call(updatePublicEmailPreferences, email, token, preferences);
      yield put(unsubscribeActions.updatePreferencesSuccess());
   }
   catch (error: any)
   {
      logger.error('Error updating preferences:', error);
      yield put(unsubscribeActions.updatePreferencesFailure(error.message || 'Could not save preferences'));
   }
}

export function* watchUnsubscribeSaga()
{
   yield takeLatest(unsubscribeActions.confirmEmail.type, handleConfirmEmail);
   yield takeLatest(unsubscribeActions.updatePreferences.type, handleUpdatePreferences);
}
