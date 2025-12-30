
import { AlertMessage, buildInfoAlert, buildWarningAlert } from "../AlertBarTypes";

describe('Alert Message Builders', () => {

  test('buildInfoAlert works', () => {
    const message = 'TEST MESSAGE';
    const info: AlertMessage = buildInfoAlert(message);

    expect(info.message).toBe(message);
    expect(info.severity).toBe('info');
  });

  test('buildWarningAlert works', () => {
    const message = 'TEST MESSAGE';
    const info: AlertMessage = buildWarningAlert(message);

    expect(info.message).toBe(message);
    expect(info.severity).toBe('warning');
  });
});
