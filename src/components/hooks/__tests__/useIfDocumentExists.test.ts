import { vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { when } from "vitest-when";
import { generateClient } from '@aws-amplify/api';

import { searchDocumentDetails } from '../../../graphql/queries';
import useIfDocumentExists from '../useIfDocumentExists';
import { alertBarActions } from '../../../AlertBar/AlertBarSlice';
import {useAppDispatch} from "../../../app/hooks";

const client = generateClient();

vi.mock('../../../app/hooks');

describe('useIfDocumentExists', () =>
{
  // Setup mocks
  const mockGraphql = vi.fn();
  const mockDispatch = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    client.graphql = mockGraphql;
    when(useAppDispatch).calledWith().thenReturn(mockDispatch);
  });

  it('should return checking state and checkExists function', () =>
  {
    const { result } = renderHook(() => useIfDocumentExists());
    
    expect(result.current.checking).toBe(false);
    expect(typeof result.current.checkExists).toBe('function');
  });

  it('should return false when document does not exist', async () =>
  {
    mockGraphql.mockResolvedValueOnce({
      data: { searchDocumentDetails: { items: [] } }
    });

    console.log(`client: ${JSON.stringify(client, null, 2)}`);

    const { result } = renderHook(() => useIfDocumentExists());

    let exists: boolean | null = null;
    await act(async () => {
      exists = await result.current.checkExists('new-doc-id', 'file-key');
    });
    
    expect(exists).toBe(false);
    expect(mockGraphql).toHaveBeenCalledWith({
      query: searchDocumentDetails,
      variables: {
        filter: { id: { ne: 'new-doc-id' }, fileKey: { eq: 'file-key' } }
      }
    });
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should return true and dispatch alert when document exists',
     async () =>
  {
    mockGraphql.mockResolvedValueOnce({
      data: {
        searchDocumentDetails: {
          items: [{ id: 'existing-doc', fileKey: 'file-key' }]
        }
      }
    });

    const { result } = renderHook(() => useIfDocumentExists());

    let exists: boolean | null = null;
    await act(async () => {
      exists = await result.current.checkExists('new-doc-id', 'file-key');
    });
    
    expect(exists).toBe(true);
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: alertBarActions.DisplayAlertBox.type,
        payload: expect.objectContaining({ message: 'file exists.' })
      })
    );
  });

  it('should handle errors and return true', async () =>
  {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    mockGraphql.mockRejectedValueOnce(new Error('API error'));

    const { result } = renderHook(() => useIfDocumentExists());
    
    let exists: boolean | null = null;
    await act(async () => {
      exists = await result.current.checkExists('new-doc-id', 'file-key');
    });
    
    expect(exists).toBe(true);
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should handle GraphQL errors with error details', async () =>
  {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    const graphqlError = {
      errors: [
        { message: 'GraphQL error 1' },
        { message: 'GraphQL error 2' }
      ]
    };
    mockGraphql.mockRejectedValueOnce(graphqlError);

    const { result } = renderHook(() => useIfDocumentExists());

    let exists: boolean | null = null;
    await act(async () => {
      exists = await result.current.checkExists('new-doc-id', 'file-key');
    });

    // Once for the main error, twice for each error detail
    expect(consoleErrorSpy).toHaveBeenCalledTimes(3);
    consoleErrorSpy.mockRestore();

    expect(exists).toBe(true);
  });

  it('should set checking state correctly during execution', async () =>
  {
    mockGraphql.mockResolvedValueOnce({
      data: { searchDocumentDetails: { items: [] } }
    });

    const { result } = renderHook(() => useIfDocumentExists());
    
    expect(result.current.checking).toBe(false);
    
    let checkPromise: Promise<boolean>;
    act(() => {
      checkPromise = result.current.checkExists('new-doc-id', 'file-key');
    });
    
    expect(result.current.checking).toBe(true);
    
    await act(async () => { await checkPromise; });
    
    expect(result.current.checking).toBe(false);
  });
});