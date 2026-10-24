import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {buildStreamEvent, createInvoker, indexDocument, runIndexing} from '../index-opensearch.js';

// --- Fixture documents (Gen2 shape, as in import-ready/<env>/Document.json) ---

const docMd = {
   __typename:                 'Document',
   id:                         'f4d3534d-c2ba-488f-b0af-2659e1bfdaf5',
   eng:                        { title: 'Upload to Personal', description: '' },
   bc:                         { title: 'T1', description: 'D1' },
   ak:                         { title: '', description: '' },
   fileKey:                    '75ca183f-a199-4d3d-9ac3-e10432965276/issue-04.md',
   fileHash:                   'hash123',
   created:                    '2024-03-11T01:27:57.560Z',
   updated:                    '2024-03-11T01:27:57.560Z',
   type:                       'text/markdown',
   version:                    1,
   keywords:                   ['kw1', 'kw2'],
   documentAuthorId:           '0e786887-6eb8-409d-b19f-7f64da8d547c',
   documentContentOwnerUserId: 'd4c8b4d8-f091-7024-1353-6d83fca3def3',
   documentBoxBoxId:           '75ca183f-a199-4d3d-9ac3-e10432965276',
   createdAt:                  '2024-03-11T01:27:57.560Z',
   updatedAt:                  '2024-03-11T01:27:57.560Z',
};

const docNullHash = {
   ...docMd,
   id:       '766cf41f-6393-40e6-b141-131ee419db8d',
   fileKey:  '75ca183f-a199-4d3d-9ac3-e10432965276/test.odt',
   fileHash: null,
   keywords: ['T4'],
};

const docThree = { ...docMd, id: 'doc-3' };

// --- Mocks ---

const sendMock = vi.fn();

vi.mock('@aws-sdk/client-lambda', () => ({
   LambdaClient:  vi.fn(function () { this.send = (...args) => sendMock(...args); }),
   InvokeCommand: vi.fn(function (params) { Object.assign(this, params); }),
}));

// --- Tests ---

describe('index-opensearch.js', () => {
   let consoleLogSpy;
   let consoleErrorSpy;
   let processExitSpy;

   beforeEach(() => {
      consoleLogSpy   = vi.spyOn(console, 'log').mockImplementation(() => {});
      consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      processExitSpy  = vi.spyOn(process, 'exit').mockImplementation(() => {
         throw new Error('process.exit called');
      });
   });

   afterEach(() => {
      vi.clearAllMocks();
      sendMock.mockReset();
   });

   // -----------------------------------------------------------------------
   // Feature 1: buildStreamEvent
   // -----------------------------------------------------------------------

   describe('Feature 1: buildStreamEvent', () => {

      it('should build a single-record INSERT stream event keyed by id', () => {
         const event = buildStreamEvent(docMd);

         expect(event.Records).toHaveLength(1);
         const [record] = event.Records;
         expect(record.eventName).toBe('INSERT');
         expect(record.dynamodb.Keys).toEqual({ id: { S: docMd.id } });
      });

      it('should marshall the document into DynamoDB attribute values', () => {
         const image = buildStreamEvent(docMd).Records[0].dynamodb.NewImage;

         expect(image.__typename).toEqual({ S: 'Document' });
         expect(image.id).toEqual({ S: docMd.id });
         expect(image.eng.M.title).toEqual({ S: 'Upload to Personal' });
         expect(image.bc.M.description).toEqual({ S: 'D1' });
         expect(image.fileKey).toEqual({ S: docMd.fileKey });
         expect(image.version).toEqual({ N: '1' });
         expect(image.keywords).toEqual({ L: [{ S: 'kw1' }, { S: 'kw2' }] });
         expect(image.documentBoxBoxId).toEqual({ S: docMd.documentBoxBoxId });
      });

      it('should marshall a null fileHash as NULL so the Lambda reads it as empty', () => {
         const image = buildStreamEvent(docNullHash).Records[0].dynamodb.NewImage;

         expect(image.fileHash).toEqual({ NULL: true });
         expect(image.fileHash.S).toBeUndefined();
      });

      it('should drop undefined values instead of throwing', () => {
         const doc = { ...docMd, updated: undefined };

         expect(() => buildStreamEvent(doc)).not.toThrow();
         expect(buildStreamEvent(doc).Records[0].dynamodb.NewImage.updated).toBeUndefined();
      });
   });

   // -----------------------------------------------------------------------
   // Feature 2: indexDocument
   // -----------------------------------------------------------------------

   describe('Feature 2: indexDocument', () => {

      it('should invoke once with the stream event and count success', async () => {
         const invoke = vi.fn().mockResolvedValue({ functionError: undefined, payload: 'null' });
         const counts = { invoked: 0, failed: 0 };

         await indexDocument(docMd, invoke, counts);

         expect(invoke).toHaveBeenCalledTimes(1);
         expect(invoke).toHaveBeenCalledWith(buildStreamEvent(docMd));
         expect(counts).toEqual({ invoked: 1, failed: 0 });
      });

      it('should count a Lambda function error as failed and log its payload', async () => {
         const payload = '{"errorMessage":"Unable to locate Uploaded file"}';
         const invoke  = vi.fn().mockResolvedValue({ functionError: 'Unhandled', payload });
         const counts  = { invoked: 0, failed: 0 };

         await indexDocument(docMd, invoke, counts);

         expect(counts).toEqual({ invoked: 0, failed: 1 });
         const errMsg = consoleErrorSpy.mock.calls.flat().join(' ');
         expect(errMsg).toContain(docMd.id);
         expect(errMsg).toContain('Unable to locate Uploaded file');
      });

      it('should catch an invoke exception and count it as failed', async () => {
         const invoke = vi.fn().mockRejectedValue(new Error('AccessDeniedException'));
         const counts = { invoked: 0, failed: 0 };

         await expect(indexDocument(docMd, invoke, counts)).resolves.toBeUndefined();

         expect(counts).toEqual({ invoked: 0, failed: 1 });
         expect(consoleErrorSpy.mock.calls.flat().join(' ')).toContain('AccessDeniedException');
      });

      it('should not invoke in dry-run, and log intent', async () => {
         const invoke = vi.fn();
         const counts = { invoked: 0, failed: 0 };

         await indexDocument(docMd, invoke, counts, true);

         expect(invoke).not.toHaveBeenCalled();
         expect(counts).toEqual({ invoked: 1, failed: 0 });
         expect(consoleLogSpy.mock.calls.flat().join(' ')).toContain(docMd.id);
      });
   });

   // -----------------------------------------------------------------------
   // Feature 3: createInvoker
   // -----------------------------------------------------------------------

   describe('Feature 3: createInvoker', () => {

      it('should invoke the named function synchronously with the JSON event', async () => {
         sendMock.mockResolvedValue({ Payload: Buffer.from('null') });
         const event = buildStreamEvent(docMd);

         await createInvoker('my-fn', 'us-east-1')(event);

         const command = sendMock.mock.calls[0][0];
         expect(command.FunctionName).toBe('my-fn');
         expect(command.InvocationType).toBe('RequestResponse');
         expect(JSON.parse(command.Payload.toString())).toEqual(event);
      });

      it('should return the function error and decoded payload', async () => {
         const payload = '{"errorMessage":"boom"}';
         sendMock.mockResolvedValue({ FunctionError: 'Unhandled', Payload: Buffer.from(payload) });

         const result = await createInvoker('my-fn', 'us-east-1')(buildStreamEvent(docMd));

         expect(result).toEqual({ functionError: 'Unhandled', payload });
      });

      it('should return an empty payload when the response has none', async () => {
         sendMock.mockResolvedValue({});

         const result = await createInvoker('my-fn', 'us-east-1')(buildStreamEvent(docMd));

         expect(result).toEqual({ functionError: undefined, payload: '' });
      });
   });

   // -----------------------------------------------------------------------
   // Feature 4: runIndexing
   // -----------------------------------------------------------------------

   describe('Feature 4: runIndexing', () => {
      const docs = [docMd, docNullHash, docThree];
      const deps = (overrides = {}) => ({
         existsSync:   () => true,
         readFileSync: () => JSON.stringify(docs),
         invoke:       vi.fn().mockResolvedValue({ functionError: undefined, payload: 'null' }),
         ...overrides,
      });

      it('should invoke once per document and report counts', async () => {
         const d = deps();

         await runIndexing('sbx', false, d);

         expect(d.invoke).toHaveBeenCalledTimes(3);
         const ids = d.invoke.mock.calls.map(c => c[0].Records[0].dynamodb.Keys.id.S);
         expect(ids).toEqual([docMd.id, docNullHash.id, 'doc-3']);
         expect(consoleLogSpy.mock.calls.flat().join(' ')).toContain('Invoked OK: 3, Failed: 0');
      });

      it('should keep going after a failure and report mixed counts', async () => {
         const invoke = vi.fn()
            .mockResolvedValueOnce({ functionError: undefined, payload: 'null' })
            .mockRejectedValueOnce(new Error('throttled'))
            .mockResolvedValueOnce({ functionError: undefined, payload: 'null' });

         await runIndexing('sbx', false, deps({ invoke }));

         expect(invoke).toHaveBeenCalledTimes(3);
         expect(consoleLogSpy.mock.calls.flat().join(' ')).toContain('Invoked OK: 2, Failed: 1');
      });

      it('should handle an empty Document list without invoking', async () => {
         const d = deps({ readFileSync: () => '[]' });

         await runIndexing('sbx', false, d);

         expect(d.invoke).not.toHaveBeenCalled();
         expect(consoleLogSpy.mock.calls.flat().join(' ')).toContain('Invoked OK: 0, Failed: 0');
      });

      it('should count a function error with an empty payload as failed', async () => {
         const invoke = vi.fn().mockResolvedValue({ functionError: 'Unhandled', payload: '' });

         await runIndexing('sbx', false, deps({ invoke }));

         expect(consoleLogSpy.mock.calls.flat().join(' ')).toContain('Invoked OK: 0, Failed: 3');
      });

      it('should not invoke in dry-run and report would-invoke count', async () => {
         const d = deps();

         await runIndexing('sbx', true, d);

         expect(d.invoke).not.toHaveBeenCalled();
         expect(consoleLogSpy.mock.calls.flat().join(' ')).toContain('Would invoke: 3');
      });

      it('should read Document.json from import-ready/<env>', async () => {
         const existsSync = vi.fn().mockReturnValue(true);

         await runIndexing('sbx', true, deps({ existsSync }));

         const inputFile = existsSync.mock.calls[0][0];
         expect(inputFile).toMatch(/import-ready[\\/]sbx[\\/]Document\.json$/);
      });

      it('should exit with usage for an invalid env', async () => {
         await expect(runIndexing('staging')).rejects.toThrow('process.exit called');

         expect(consoleErrorSpy.mock.calls.flat().join(' ')).toMatch(/sbx|dev|prod/);
         expect(processExitSpy).toHaveBeenCalledWith(1);
      });

      it('should exit when the Lambda name is still the placeholder', async () => {
         // dev has UPDATE_AFTER_GEN2_DEPLOY in config.js
         await expect(runIndexing('dev', false, deps())).rejects.toThrow('process.exit called');

         expect(consoleErrorSpy.mock.calls.flat().join(' ')).toContain('ingestTriggerFunction');
         expect(processExitSpy).toHaveBeenCalledWith(1);
      });

      it('should exit when Document.json is missing', async () => {
         await expect(runIndexing('sbx', false, deps({ existsSync: () => false })))
            .rejects.toThrow('process.exit called');

         expect(consoleErrorSpy.mock.calls.flat().join(' ').toLowerCase()).toMatch(/not found|missing/);
         expect(processExitSpy).toHaveBeenCalledWith(1);
      });
   });
});
