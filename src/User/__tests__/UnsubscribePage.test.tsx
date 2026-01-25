import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { API } from 'aws-amplify';
import { renderWithProviders } from '../../__utils__/testUtilities';
import UnsubscribePage from '../UnsubscribePage';
import { OptOutReason, emptyEmailPreferences } from '../userType';
import type { EmailPreferences } from '../userType';
import * as unsubscribeUtils from '../unsubscribeUtils';

vi.mock('aws-amplify', () => ({
   API: { graphql: vi.fn() }
}));

vi.mock('../unsubscribeUtils', async () =>
{
   const actual = await vi.importActual('../unsubscribeUtils');
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

   const mockPreferences: EmailPreferences = {
      ...emptyEmailPreferences,
      allOptOut: false,
      boxRequestOptOut: false,
   };

   beforeEach(() =>
   {
      vi.clearAllMocks();
      delete (window as any).location;
      (window as any).location = { search: `?token=${TEST_TOKEN}` };
   });

   it('shows error when token is missing', () =>
   {
      (window as any).location = { search: '' };
      renderWithProviders(<UnsubscribePage />);
      
      expect(screen.getByText('Invalid unsubscribe link - missing token')).toBeInTheDocument();
   });

   it('shows error when token is invalid', () =>
   {
      vi.mocked(unsubscribeUtils.decodeUnsubscribeToken).mockReturnValue(null);
      renderWithProviders(<UnsubscribePage />);
      
      expect(screen.getByText('Invalid unsubscribe link - invalid token')).toBeInTheDocument();
   });

   it('renders email confirmation form with valid token', () =>
   {
      vi.mocked(unsubscribeUtils.decodeUnsubscribeToken).mockReturnValue({
         userId: TEST_USER_ID,
         email: TEST_EMAIL
      });
      
      renderWithProviders(<UnsubscribePage />);
      
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
      
      renderWithProviders(<UnsubscribePage />);
      
      const emailInput = screen.getByLabelText('Email Address');
      await user.type(emailInput, 'wrong@example.com');
      await user.click(screen.getByRole('button', { name: /continue/i }));
      
      expect(screen.getByText('Email address does not match')).toBeInTheDocument();
   });

   it('loads preferences after email confirmation', async () =>
   {
      const user = userEvent.setup();
      vi.mocked(unsubscribeUtils.decodeUnsubscribeToken).mockReturnValue({
         userId: TEST_USER_ID,
         email: TEST_EMAIL
      });
      vi.mocked(API.graphql).mockResolvedValue({
         data: { getPublicUserEmailPreferences: mockPreferences }
      });
      
      renderWithProviders(<UnsubscribePage />);
      
      const emailInput = screen.getByLabelText('Email Address');
      await user.type(emailInput, TEST_EMAIL);
      await user.click(screen.getByRole('button', { name: /continue/i }));
      
      await waitFor(() =>
      {
         expect(API.graphql).toHaveBeenCalledWith({
            query: expect.any(String),
            variables: { email: TEST_EMAIL },
            authMode: 'AWS_IAM'
         });
      });
      
      await waitFor(() =>
      {
         expect(screen.getByText('Unsubscribe from all emails')).toBeInTheDocument();
      });
   });

   it('shows error when user not found', async () =>
   {
      const user = userEvent.setup();
      vi.mocked(unsubscribeUtils.decodeUnsubscribeToken).mockReturnValue({
         userId: TEST_USER_ID,
         email: TEST_EMAIL
      });
      vi.mocked(API.graphql).mockResolvedValue({
         data: { getPublicUserEmailPreferences: null }
      });
      
      renderWithProviders(<UnsubscribePage />);
      
      const emailInput = screen.getByLabelText('Email Address');
      await user.type(emailInput, TEST_EMAIL);
      await user.click(screen.getByRole('button', { name: /continue/i }));
      
      await waitFor(() =>
      {
         expect(screen.getByText('User not found')).toBeInTheDocument();
      });
   });

   it('saves preferences when form is submitted', async () =>
   {
      const user = userEvent.setup();
      vi.mocked(unsubscribeUtils.decodeUnsubscribeToken).mockReturnValue({
         userId: TEST_USER_ID,
         email: TEST_EMAIL
      });
      vi.mocked(API.graphql)
         .mockResolvedValueOnce({
            data: { getPublicUserEmailPreferences: mockPreferences }
         })
         .mockResolvedValueOnce({
            data: { updateUserEmailPreferences: { ...mockPreferences, allOptOut: true } }
         });
      
      renderWithProviders(<UnsubscribePage />);
      
      const emailInput = screen.getByLabelText('Email Address');
      await user.type(emailInput, TEST_EMAIL);
      await user.click(screen.getByRole('button', { name: /continue/i }));
      
      await waitFor(() =>
      {
         expect(screen.getByText('Unsubscribe from all emails')).toBeInTheDocument();
      });
      
      const allOptOutToggle = screen.getByRole('checkbox', { name: /unsubscribe from all emails/i });
      await user.click(allOptOutToggle);
      
      await waitFor(() =>
      {
         expect(API.graphql).toHaveBeenCalledWith({
            query: expect.any(String),
            variables: {
               email: TEST_EMAIL,
               token: TEST_TOKEN,
               preferences: expect.objectContaining({
                  allOptOut: true,
                  optOutReason: OptOutReason.USER_CHOICE
               })
            },
            authMode: 'AWS_IAM'
         });
      });
   });

   it('shows success message after saving', async () =>
   {
      const user = userEvent.setup();
      vi.mocked(unsubscribeUtils.decodeUnsubscribeToken).mockReturnValue({
         userId: TEST_USER_ID,
         email: TEST_EMAIL
      });
      vi.mocked(API.graphql)
         .mockResolvedValueOnce({
            data: { getPublicUserEmailPreferences: mockPreferences }
         })
         .mockResolvedValueOnce({
            data: { updateUserEmailPreferences: { ...mockPreferences, allOptOut: true } }
         });
      
      renderWithProviders(<UnsubscribePage />);
      
      const emailInput = screen.getByLabelText('Email Address');
      await user.type(emailInput, TEST_EMAIL);
      await user.click(screen.getByRole('button', { name: /continue/i }));
      
      await waitFor(() =>
      {
         expect(screen.getByText('Unsubscribe from all emails')).toBeInTheDocument();
      });
      
      const allOptOutToggle = screen.getByRole('checkbox', { name: /unsubscribe from all emails/i });
      await user.click(allOptOutToggle);
      
      await waitFor(() =>
      {
         expect(screen.getByText('Your email preferences have been updated successfully.')).toBeInTheDocument();
      });
   });

   it('handles save error', async () =>
   {
      const user = userEvent.setup();
      vi.mocked(unsubscribeUtils.decodeUnsubscribeToken).mockReturnValue({
         userId: TEST_USER_ID,
         email: TEST_EMAIL
      });
      vi.mocked(API.graphql)
         .mockResolvedValueOnce({
            data: { getPublicUserEmailPreferences: mockPreferences }
         })
         .mockRejectedValueOnce(new Error('Save failed'));
      
      renderWithProviders(<UnsubscribePage />);
      
      const emailInput = screen.getByLabelText('Email Address');
      await user.type(emailInput, TEST_EMAIL);
      await user.click(screen.getByRole('button', { name: /continue/i }));
      
      await waitFor(() =>
      {
         expect(screen.getByText('Unsubscribe from all emails')).toBeInTheDocument();
      });
      
      const allOptOutToggle = screen.getByRole('checkbox', { name: /unsubscribe from all emails/i });
      await user.click(allOptOutToggle);
      
      await waitFor(() =>
      {
         expect(screen.getByText('Save failed')).toBeInTheDocument();
      });
   });

   it('disables continue button when email is empty', () =>
   {
      vi.mocked(unsubscribeUtils.decodeUnsubscribeToken).mockReturnValue({
         userId: TEST_USER_ID,
         email: TEST_EMAIL
      });
      
      renderWithProviders(<UnsubscribePage />);
      
      const continueButton = screen.getByRole('button', { name: /continue/i });
      expect(continueButton).toBeDisabled();
   });

   it('is case-insensitive for email matching', async () =>
   {
      const user = userEvent.setup();
      vi.mocked(unsubscribeUtils.decodeUnsubscribeToken).mockReturnValue({
         userId: TEST_USER_ID,
         email: TEST_EMAIL.toLowerCase()
      });
      vi.mocked(API.graphql).mockResolvedValue({
         data: { getPublicUserEmailPreferences: mockPreferences }
      });
      
      renderWithProviders(<UnsubscribePage />);
      
      const emailInput = screen.getByLabelText('Email Address');
      await user.type(emailInput, TEST_EMAIL.toUpperCase());
      await user.click(screen.getByRole('button', { name: /continue/i }));
      
      await waitFor(() =>
      {
         expect(screen.getByText('Unsubscribe from all emails')).toBeInTheDocument();
      });
   });
});
