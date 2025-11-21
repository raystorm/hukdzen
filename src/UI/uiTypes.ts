/**
 * UI state interface for managing application-wide UI states
 */
export interface UiState {
   /** Indicates if a long-running operation is currently in progress */
   isProcessing: boolean;
}

/**
 * Initial state for UI slice
 */
export const initialUiState: UiState = {
   isProcessing: false,
};