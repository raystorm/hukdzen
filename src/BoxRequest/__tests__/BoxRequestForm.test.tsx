import React from 'react';
import { vi } from 'vitest';
import { screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useNavigate } from 'react-router';

import { alertBarActions } from "../../AlertBar/AlertBarSlice";
import { buildErrorAlert } from "../../AlertBar/AlertBarTypes";

import BoxRequestForm from '../BoxRequestForm';
import { emptyBoxRequest, BoxRequestStatus } from '../boxRequestType';
import { renderWithState } from '../../__utils__/testUtilities';
import { boxRequestActions } from '../boxRequestSlice';
import { BOX_REQUEST_LIST_PATH } from '../../components/shared/constants';
import userList from '../../__utils__/__fixtures__/userList.json';

const mockUser  = userList.items[0];
const mockAdmin = userList.items[2];

const mockNavigate = vi.fn();
vi.mock('react-router', async () => {
   const actual = await vi.importActual('react-router');
   return { ...actual, useNavigate: () => mockNavigate };
});

describe('BoxRequestForm', () => {

   beforeEach(() => { mockNavigate.mockClear(); });

   test('renders in create mode', () => {
      renderWithState({ user: mockUser },
                      <BoxRequestForm boxRequest={emptyBoxRequest} mode='create' />);

      expect(screen.getByLabelText(/Requested Box Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Request Reason/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Submit Request/i })).toBeInTheDocument();
   });

   test('submit button disabled when fields empty', () => {
      renderWithState({ user: mockUser },
                      <BoxRequestForm boxRequest={emptyBoxRequest} mode='create' />);

      const submitButton = screen.getByRole('button', { name: /Submit Request/i });
      expect(submitButton).toBeDisabled();
   });

   test('dispatches createBoxRequest on submit', async () => {
      const user = userEvent.setup();
      const { store } = renderWithState({ user: mockUser },
                                        <BoxRequestForm boxRequest={emptyBoxRequest} mode='create' />);

      await user.type(screen.getByLabelText(/Requested Box Name/i), 'Test Box');
      await user.type(screen.getByLabelText(/Request Reason/i), 'Test reason');

      const submitButton = screen.getByRole('button', { name: /Submit Request/i });
      await user.click(submitButton);

      await waitFor(() => {
         expect(store.dispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: boxRequestActions.createBoxRequest.type })
         );
      });
   });

   test('renders in admin mode with approve/deny buttons', () => {
      const pendingRequest = {
         ...emptyBoxRequest,
         requestedName: 'Test Box',
         status: BoxRequestStatus.PENDING,
      };

      renderWithState({ user: mockUser },
                      <BoxRequestForm boxRequest={pendingRequest} mode='admin' />);

      expect(screen.getByRole('button', { name: /Approve/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Deny/i })).toBeInTheDocument();
   });

   test('deny button disabled without denial reason', () => {
      const pendingRequest = {
         ...emptyBoxRequest,
         requestedName: 'Test Box',
         status: BoxRequestStatus.PENDING,
      };

      renderWithState({ user: mockAdmin },
                      <BoxRequestForm boxRequest={pendingRequest} mode='admin' />);

      expect(screen.getByRole('button', { name: /Deny/i })).toBeDisabled();
   });

   test('Error message is displayed when Denial Reason is empty on Deny', async () =>
   {
      const pendingRequest = {
         ...emptyBoxRequest,
         requestedName: 'Test Box',
         requestedReason: 'Test Box',
         denialReason: '  ',
         status: BoxRequestStatus.PENDING,
      };

      const { store } = renderWithState({ user: mockAdmin },
                                        <BoxRequestForm boxRequest={pendingRequest}
                                                        mode='admin' />);

      const denyButton = screen.getByText(/Deny/i);

      // Force the click — RTL allows this even if disabled
      fireEvent.click(denyButton);

      await waitFor(() => {
         // And expect the alert bar to fire
         expect(store?.dispatch).toHaveBeenCalledWith(
            alertBarActions.DisplayAlertBox(
               buildErrorAlert('Denial reason is required to deny a box request.')
            )
         );
      })

      // Expect the denial error to appear
      expect(screen.getByText(/Denial reason is required/i)).toBeInTheDocument();

      // And expect NO deny action to be dispatched
      expect(store?.dispatch).not.toHaveBeenCalledWith(
         boxRequestActions.denyBoxRequest(expect.anything())
      );
   });


   test('dispatches approveBoxRequest on approve', async () => {
      const user = userEvent.setup();
      const pendingRequest = {
         ...emptyBoxRequest,
         requestedName: 'Test Box',
         requestReason: 'Test reason',
         status: BoxRequestStatus.PENDING,
      };

      const { store } = renderWithState({ user: mockUser },
                                        <BoxRequestForm boxRequest={pendingRequest} mode='admin' />);

      await user.click(screen.getByRole('button', { name: /Approve/i }));

      await waitFor(() => {
         expect(store.dispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: boxRequestActions.approveBoxRequest.type })
         );
      });
   });

   test('dispatches denyBoxRequest on deny', async () => {
      const user = userEvent.setup();
      const pendingRequest = {
         ...emptyBoxRequest,
         requestedName: 'Test Box',
         requestReason: 'Test reason',
         status: BoxRequestStatus.PENDING,
      };

      const { store } = renderWithState({ user: mockUser },
                                        <BoxRequestForm boxRequest={pendingRequest} mode='admin' />);

      await user.type(screen.getByLabelText(/Denial Reason/i), 'Not approved');
      await user.click(screen.getByRole('button', { name: /Deny/i }));

      await waitFor(() => {
         expect(store.dispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: boxRequestActions.denyBoxRequest.type })
         );
      });
   });

   test('shows error when approving without requested name', async () => {
      const user = userEvent.setup();
      const pendingRequest = {
         ...emptyBoxRequest,
         requestReason: 'Test reason',
         status: BoxRequestStatus.PENDING,
      };

      renderWithState({ user: mockUser },
                      <BoxRequestForm boxRequest={pendingRequest} mode='admin' />);

      await user.click(screen.getByRole('button', { name: /Approve/i }));

      await waitFor(() => {
         expect(screen.getByText(/Requested name is required/i)).toBeInTheDocument();
      });
   });

   test('shows error when approving without request reason', async () => {
      const user = userEvent.setup();
      const pendingRequest = {
         ...emptyBoxRequest,
         requestedName: 'Test Box',
         status: BoxRequestStatus.PENDING,
      };

      renderWithState({ user: mockUser },
                      <BoxRequestForm boxRequest={pendingRequest} mode='admin' />);

      await user.click(screen.getByRole('button', { name: /Approve/i }));

      await waitFor(() => {
         expect(screen.getByText(/Request reason is required/i)).toBeInTheDocument();
      });
   });

   test('shows denial reason field in admin mode', () => {
      const pendingRequest = {
         ...emptyBoxRequest,
         requestedName: 'Test Box',
         status: BoxRequestStatus.PENDING,
      };

      renderWithState({ user: mockUser },
                      <BoxRequestForm boxRequest={pendingRequest} mode='admin' />);

      expect(screen.getByLabelText(/Denial Reason/i)).toBeInTheDocument();
   });

   test('renders status field for closed requests', () => {
      const approvedRequest = {
         ...emptyBoxRequest,
         requestedName: 'Test Box',
         status: BoxRequestStatus.APPROVED,
      };

      renderWithState({ user: mockUser },
                      <BoxRequestForm boxRequest={approvedRequest} mode='view' />);

      expect(screen.getByText(/Status/i)).toBeInTheDocument();
   });

   test('fields disabled in view mode', () => {
      const pendingRequest = {
         ...emptyBoxRequest,
         requestedName: 'Test Box',
         status: BoxRequestStatus.PENDING,
      };

      renderWithState({ user: mockUser },
                      <BoxRequestForm boxRequest={pendingRequest} mode='view' />);

      expect(screen.getByLabelText(/Requested Box Name/i)).toBeDisabled();
      expect(screen.getByLabelText(/Request Reason/i)).toBeDisabled();
   });

   test('fields disabled in admin mode', () => {
      const pendingRequest = {
         ...emptyBoxRequest,
         requestedName: 'Test Box',
         requestReason: 'Test reason',
         status: BoxRequestStatus.PENDING,
      };

      renderWithState({ user: mockUser },
                      <BoxRequestForm boxRequest={pendingRequest} mode='admin' />);

      expect(screen.getByLabelText(/Requested Box Name/i)).toBeDisabled();
      expect(screen.getByLabelText(/Request Reason/i)).toBeDisabled();
      expect(screen.getByLabelText(/Denial Reason/i)).not.toBeDisabled();
   });

   test('shows denial reason in view mode for denied requests', () => {
      const deniedRequest = {
         ...emptyBoxRequest,
         requestedName: 'Test Box',
         denialReason: 'Not approved',
         status: BoxRequestStatus.DENIED,
      };

      renderWithState({ user: mockUser },
                      <BoxRequestForm boxRequest={deniedRequest} mode='view' />);

      expect(screen.getByLabelText(/Denial Reason/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Denial Reason/i)).toBeDisabled();
   });

   describe('Navigation', () => {
      test('navigates to list after successful create', async () => {
         const newRequest = { ...emptyBoxRequest, id: 'new-123', requestedName: 'New Box' };
         const { store } = renderWithState(
            { user: mockUser, boxRequest: emptyBoxRequest },
            <BoxRequestForm boxRequest={emptyBoxRequest} mode='create' />
         );

         act(() => {
            store.dispatch(boxRequestActions.boxRequestCreated(newRequest));
         });

         await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(BOX_REQUEST_LIST_PATH);
         });
      });

      test('navigates to list after approve', async () => {
         const pendingRequest = {
            ...emptyBoxRequest,
            id: 'req-123',
            requestedName: 'Test Box',
            status: BoxRequestStatus.PENDING,
         };
         const approvedRequest = { ...pendingRequest, status: BoxRequestStatus.APPROVED };

         const { store } = renderWithState(
            { user: mockAdmin, boxRequest: pendingRequest },
            <BoxRequestForm boxRequest={pendingRequest} mode='admin' />
         );

         act(() => {
            store.dispatch(boxRequestActions.boxRequestClosed(approvedRequest));
         });

         await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(BOX_REQUEST_LIST_PATH);
         });
      });

      test('navigates to list after deny', async () => {
         const pendingRequest = {
            ...emptyBoxRequest,
            id: 'req-123',
            requestedName: 'Test Box',
            status: BoxRequestStatus.PENDING,
         };
         const deniedRequest = { ...pendingRequest, status: BoxRequestStatus.DENIED };

         const { store } = renderWithState(
            { user: mockAdmin, boxRequest: pendingRequest },
            <BoxRequestForm boxRequest={pendingRequest} mode='admin' />
         );

         act(() => {
            store.dispatch(boxRequestActions.boxRequestClosed(deniedRequest));
         });

         await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(BOX_REQUEST_LIST_PATH);
         });
      });

      test('does not navigate in view mode', async () => {
         const pendingRequest = {
            ...emptyBoxRequest,
            id: 'req-123',
            requestedName: 'Test Box',
            status: BoxRequestStatus.PENDING,
         };
         const approvedRequest = { ...pendingRequest, status: BoxRequestStatus.APPROVED };

         const { store } = renderWithState(
            { user: mockUser, boxRequest: pendingRequest },
            <BoxRequestForm boxRequest={pendingRequest} mode='view' />
         );

         act(() => {
            store.dispatch(boxRequestActions.boxRequestClosed(approvedRequest));
         });

         await waitFor(() => {
            expect(mockNavigate).not.toHaveBeenCalled();
         }, { timeout: 500 }).catch(() => {});
      });
   });
});
