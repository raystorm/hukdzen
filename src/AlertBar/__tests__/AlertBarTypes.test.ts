import { AlertBarProps } from "../AlertBar";
import { buildInfoAlert, buildWarningAlert } from "../AlertBarTypes";

describe('Alert Message Bulders', () =>{

  test('buildInfoAlert works', () => {
    const message = 'TEST MESSAGE';
    const info = buildInfoAlert(message);

    expect(info.message).toBe(message);
    expect(info.severity).toBe('info');
  });

  test('buildWarningAlert works', () => {
    const message = 'TEST MESSAGE';
    const info = buildWarningAlert(message);

    expect(info.message).toBe(message);
    expect(info.severity).toBe('warning');
  });
});
