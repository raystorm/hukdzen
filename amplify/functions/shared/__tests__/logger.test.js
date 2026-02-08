const { logger } = require('../logger');

describe('logger', () =>
{
   let consoleLogSpy;
   let consoleInfoSpy;
   let consoleWarnSpy;
   let consoleErrorSpy;

   beforeEach(() =>
   {
      consoleLogSpy   = jest.spyOn(console, 'log').mockImplementation();
      consoleInfoSpy  = jest.spyOn(console, 'info').mockImplementation();
      consoleWarnSpy  = jest.spyOn(console, 'warn').mockImplementation();
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
   });

   afterEach(() => { jest.restoreAllMocks(); });

   describe('string sanitization', () =>
   {
      it('strips newlines from strings', () =>
      {
         logger.log('line1\nline2\rline3');
         expect(consoleLogSpy).toHaveBeenCalledWith('line1line2line3');
      });

      it('strips ANSI escape sequences', () =>
      {
         logger.log('\x1b[31mred text\x1b[0m');
         expect(consoleLogSpy).toHaveBeenCalledWith('red text');
      });
   });

   describe('object serialization', () =>
   {
      it('sorts object keys deterministically', () =>
      {
         logger.log({ z: 1, a: 2, m: 3 });
         const logged = consoleLogSpy.mock.calls[0][0];
         const parsed = JSON.parse(logged);
         expect(Object.keys(parsed)).toEqual(['a', 'm', 'z']);
      });

      it('preserves array order', () =>
      {
         logger.log({ items: [3, 1, 2] });
         const logged = consoleLogSpy.mock.calls[0][0];
         const parsed = JSON.parse(logged);
         expect(parsed.items).toEqual([3, 1, 2]);
      });

      it('serializes dates to ISO strings', () =>
      {
         const date = new Date('2023-06-23T01:13:51.459Z');
         logger.log({ timestamp: date });
         const logged = consoleLogSpy.mock.calls[0][0];
         expect(logged).toContain('2023-06-23T01:13:51.459Z');
      });
   });

   describe('error handling', () =>
   {
      it('extracts error message', () =>
      {
         const error = new Error('Test error');
         logger.error('Failed:', error);
         const logged = consoleErrorSpy.mock.calls[0][1];
         expect(logged).toContain('Test error');
      });

      it('handles error with cause', () =>
      {
         const cause = new Error('Root cause');
         const error = new Error('Main error', { cause });
         logger.error(error);
         const logged = consoleErrorSpy.mock.calls[0][0];
         expect(logged).toContain('Main error');
         expect(logged).toContain('Caused By: Root cause');
      });

      it('handles error with string cause', () =>
      {
         const error = new Error('Main error', { cause: 'String cause' });
         logger.error(error);
         const logged = consoleErrorSpy.mock.calls[0][0];
         expect(logged).toContain('Caused By: String cause');
      });

      it('handles circular reference gracefully', () =>
      {
         const obj = { name: 'test' };
         obj.self = obj;
         logger.log(obj);
         const logged = consoleLogSpy.mock.calls[0][0];
         expect(logged).toContain('Log Serialization Error');
      });
   });

   describe('logger methods', () =>
   {
      it('calls console.log for log()', () =>
      {
         logger.log('test');
         expect(consoleLogSpy).toHaveBeenCalledWith('test');
      });

      it('calls console.info for info()', () =>
      {
         logger.info('test');
         expect(consoleInfoSpy).toHaveBeenCalledWith('test');
      });

      it('calls console.warn for warn()', () =>
      {
         logger.warn('test');
         expect(consoleWarnSpy).toHaveBeenCalledWith('test');
      });

      it('calls console.error for error()', () =>
      {
         logger.error('test');
         expect(consoleErrorSpy).toHaveBeenCalledWith('test');
      });

      it('handles multiple arguments', () =>
      {
         logger.log('msg', { key: 'value' }, 123);
         expect(consoleLogSpy).toHaveBeenCalledTimes(1);
         expect(consoleLogSpy.mock.calls[0]).toHaveLength(3);
      });

      it('does not mutate original arguments', () =>
      {
         const obj = { z: 1, a: 2 };
         const original = { ...obj };
         logger.log(obj);
         expect(obj).toEqual(original);
         expect(Object.keys(obj)).toEqual(['z', 'a']);
      });
   });

   describe('edge cases', () =>
   {
      it('handles undefined', () =>
      {
         logger.log(undefined);
         expect(consoleLogSpy).toHaveBeenCalledWith(undefined);
      });

      it('handles null', () =>
      {
         logger.log(null);
         expect(consoleLogSpy).toHaveBeenCalledWith(null);
      });

      it('handles numbers', () =>
      {
         logger.log(42);
         expect(consoleLogSpy).toHaveBeenCalledWith(42);
      });

      it('handles error-like object without Error instance', () =>
      {
         const errorLike = { message: 'Not a real error', cause: 'Some cause' };
         logger.log(errorLike);
         const logged = consoleLogSpy.mock.calls[0][0];
         expect(logged).toContain('Not a real error');
         expect(logged).toContain('Some cause');
      });

      it('handles object cause on error', () =>
      {
         const cause = { detail: 'Complex cause object' };
         const error = new Error('Main error', { cause });
         logger.error(error);
         const logged = consoleErrorSpy.mock.calls[0][0];
         expect(logged).toContain('Main error');
      });
   });
});
