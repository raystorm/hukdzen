import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderPage } from '../../__utils__/testUtilities';
import UnsubscribePage from '../UnsubscribePage';
import * as unsubscribeUtils from '../unsubscribe.Utilities';

vi.mock('../unsubscribe.Utilities', async () =>
{
   const actual = await vi.importActual('../unsubscribe.Utilities');
   return {
      ...actual,
      decodeUnsubscribeToken: vi.fn()
   };
});

describe('UnsubscribePage', () =>
{
   const TEST_TOKEN = 'test-jwt-token';
   const TEST_EMAIL = 'test@example.com';
   const TEST_USER_ID = 'user-123';

   beforeEach(() =>
   {
      vi.clearAllMocks();
      delete (window as any).location;
      (window as any).location = { search: `?token=${TEST_TOKEN}` };
   });

   it('shows error when token is missing', () =>
   {
      (window as any).location = { search: '' };
      renderPage('/unsubscribe', <UnsubscribePage />);
      
      expect(screen.getByText('Invalid unsubscribe link - missing token')).toBeInTheDocument();
   });

   it('shows error when token is invalid', () =>
   {
      vi.mocked(unsubscribeUtils.decodeUnsubscribeToken).mockReturnValue(null);
      renderPage('/unsubscribe', <UnsubscribePage />);
      
      expect(screen.getByText('Invalid unsubscribe link - invalid token')).toBeInTheDocument();
   });

   it('renders email confirmation form with valid token', () =>
   {
      vi.mocked(unsubscribeUtils.decodeUnsubscribeToken).mockReturnValue({
         userId: TEST_USER_ID,
         email: TEST_EMAIL
      });
      
      renderPage('/unsubscribe', <UnsubscribePage />);
      
      expect(screen.getByText('Manage Email Preferences')).toBeInTheDocument();
      expect(screen.getByText('Please confirm your email address to continue.')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
   });

   it('shows error when email does not match', async () =>
   {
      const user = userEvent.setup();
      vi.mocked(unsubscribeUtils.decodeUnsubscribeToken).mockReturnValue({
         userId: TEST_USER_ID,
         email: TEST_EMAIL
      });
      
      renderPage('/unsubscribe', <UnsubscribePage />);
      
      const emailInput = screen.getByLabelText('Email Address');
      await user.type(emailInput, 'wrong@example.com');
      await user.click(screen.getByRole('button', { name: /continue/i }));
      
      expect(screen.getByText('Email address does not match')).toBeInTheDocument();
   });

   it('disables continue button when email is empty', () =>
   {
      vi.mocked(unsubscribeUtils.decodeUnsubscribeToken).mockReturnValue({
         userId: TEST_USER_ID,
         email: TEST_EMAIL
      });
      
      renderPage('/unsubscribe', <UnsubscribePage />);
      
      const continueButton = screen.getByRole('button', { name: /continue/i });
      expect(continueButton).toBeDisabled();
   });
});
