import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../__utils__/testUtilities';
import EmailPreferencesForm from '../../User/EmailPreferencesForm';
import type { EmailPreferences } from '../userType';
import { OptOutReason, emptyEmailPreferences } from '../userType';

describe('EmailPreferencesForm', () =>
{
   const mockUserId = 'test-user-123';
   const mockOnChange = vi.fn();

   const renderForm = (preferences?: EmailPreferences | null) =>
   {
      return renderWithProviders(
         <EmailPreferencesForm userId={mockUserId}
                               current={preferences}
                               onPreferencesChange={mockOnChange}
         />
      );
   };

   it('renders with no opt-out', () =>
   {
      renderForm(null);
      expect(screen.getByText('Unsubscribe from all emails')).toBeInTheDocument();
      expect(screen.getByText('Receiving notifications')).toBeInTheDocument();
   });

   it('displays USER_CHOICE opt-out status', () =>
   {
      const prefs: EmailPreferences = {
         ...emptyEmailPreferences,
         allOptOut: true,
         optOutReason: OptOutReason.USER_CHOICE,
         optOutAt: '2024-01-15T10:00:00Z',
      };
      renderForm(prefs);
      expect(screen.getByText('User preference')).toBeInTheDocument();
      expect(screen.getByText('1/15/2024')).toBeInTheDocument();
   });

   it('displays BOUNCE_HARD opt-out status', () =>
   {
      const prefs: EmailPreferences = {
         ...emptyEmailPreferences,
         allOptOut: true,
         optOutReason: OptOutReason.BOUNCE_HARD,
         optOutAt: '2024-01-15T10:00:00Z',
      };
      renderForm(prefs);
      expect(screen.getByText('Hard bounce')).toBeInTheDocument();
   });

   it('displays BOUNCE_SOFT opt-out status', () =>
   {
      const prefs: EmailPreferences = {
         ...emptyEmailPreferences,
         allOptOut: true,
         optOutReason: OptOutReason.BOUNCE_SOFT,
         optOutAt: '2024-01-15T10:00:00Z',
      };
      renderForm(prefs);
      expect(screen.getByText('Soft bounce (5+)')).toBeInTheDocument();
   });

   it('displays COMPLAINT opt-out status', () =>
   {
      const prefs: EmailPreferences = {
         ...emptyEmailPreferences,
         allOptOut: true,
         optOutReason: OptOutReason.COMPLAINT,
         optOutAt: '2024-01-15T10:00:00Z',
      };
      renderForm(prefs);
      expect(screen.getByText('Spam complaint')).toBeInTheDocument();
   });

   it('calls onChange when toggling allOptOut', async () =>
   {
      const user = userEvent.setup();
      renderForm(null);
      
      const toggle = screen.getByRole('checkbox', {name: /unsubscribe from all emails/i});
      await user.click(toggle);
      
      expect(mockOnChange).toHaveBeenCalledWith(
         expect.objectContaining({
            allOptOut: true,
            optOutReason: OptOutReason.USER_CHOICE,
         })
      );
   });

   it('disables category toggles when allOptOut is true', () =>
   {
      const prefs: EmailPreferences = {
         ...emptyEmailPreferences,
         allOptOut: true,
         optOutReason: OptOutReason.USER_CHOICE,
      };
      renderForm(prefs);
      
      const boxRequestToggle = screen.getByRole('checkbox', {name: /box requests/i});
      expect(boxRequestToggle).toBeDisabled();
   });
});
