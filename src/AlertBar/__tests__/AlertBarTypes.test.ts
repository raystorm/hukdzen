import { AlertBarProps } from "../AlertBarNotifier";
import { buildInfoAlert, buildWarningAlert } from "../AlertBarTypes";

describe('Alert Message Builders', () =>{

  test('buildInfoAlert works', () => {
    const message = 'TEST MESSAGE';
    const info: AlertBarProps = buildInfoAlert(message);

    expect(info.message).toBe(message);
    expect(info.severity).toBe('info');
  });

  test('buildWarningAlert works', () => {
    const message = 'TEST MESSAGE';
    const info: AlertBarProps = buildWarningAlert(message);

    expect(info.message).toBe(message);
    expect(info.severity).toBe('warning');
  });
});
