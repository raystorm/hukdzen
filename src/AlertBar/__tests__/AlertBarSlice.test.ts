import { alertBarActions, alertBarReducer } from '../AlertBarSlice';
import { buildInfoAlert, buildErrorAlert, emptyAlertState } from '../AlertBarTypes';

describe('AlertBarSlice', () => {

   test('DisplayAlertBox adds alert to queue', () => {
      const alert = buildInfoAlert('Test message');
      const state = alertBarReducer(emptyAlertState, alertBarActions.DisplayAlertBox(alert));

      expect(state.queue).toHaveLength(1);
      expect(state.queue[0].message).toBe('Test message');
      expect(state.queue[0].severity).toBe('info');
   });

   test('HideAlertBox removes first alert from queue', () => {
      const initialState = {
         queue: [
            buildInfoAlert('First'),
            buildErrorAlert('Second')
         ]
      };
      const state = alertBarReducer(initialState, alertBarActions.HideAlertBox());

      expect(state.queue).toHaveLength(1);
      expect(state.queue[0].message).toBe('Second');
   });

   test('Multiple rapid DisplayAlertBox calls queue all alerts', () => {
      let state = emptyAlertState;
      
      state = alertBarReducer(state, alertBarActions.DisplayAlertBox(buildInfoAlert('First')));
      state = alertBarReducer(state, alertBarActions.DisplayAlertBox(buildInfoAlert('Second')));
      state = alertBarReducer(state, alertBarActions.DisplayAlertBox(buildErrorAlert('Third')));

      expect(state.queue).toHaveLength(3);
      expect(state.queue[0].message).toBe('First');
      expect(state.queue[1].message).toBe('Second');
      expect(state.queue[2].message).toBe('Third');
   });

   test('HideAlertBox processes queue in order', () => {
      let state = {
         queue: [
            buildInfoAlert('First'),
            buildInfoAlert('Second'),
            buildInfoAlert('Third')
         ]
      };

      state = alertBarReducer(state, alertBarActions.HideAlertBox());
      expect(state.queue).toHaveLength(2);
      expect(state.queue[0].message).toBe('Second');

      state = alertBarReducer(state, alertBarActions.HideAlertBox());
      expect(state.queue).toHaveLength(1);
      expect(state.queue[0].message).toBe('Third');

      state = alertBarReducer(state, alertBarActions.HideAlertBox());
      expect(state.queue).toHaveLength(0);
   });
});
