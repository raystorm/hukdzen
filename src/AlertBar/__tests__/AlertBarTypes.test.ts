
import { Alert, buildInfoAlert, buildWarningAlert } from "../AlertBarTypes";

describe('Alert Message Builders', () => {

  test('buildInfoAlert works', () => {
    const message = 'TEST MESSAGE';
    const info: Alert = buildInfoAlert(message);

    expect(info.message).toBe(message);
    expect(info.severity).toBe('info');
  });

  test('buildWarningAlert works', () => {
    const message = 'TEST MESSAGE';
    const info: Alert = buildWarningAlert(message);

    expect(info.message).toBe(message);
    expect(info.severity).toBe('warning');
  });
});
