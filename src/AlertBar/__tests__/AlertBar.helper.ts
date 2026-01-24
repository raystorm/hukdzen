import type { Alert, AlertState } from '../AlertBarTypes';

/** Test helper: wrap alert in queue structure for state comparison */
export const wrapAlertForTest = (alert: Alert): AlertState =>
({ queue: [alert] });
