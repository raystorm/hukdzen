const {
   templates,
   validateTemplateArgs,
   getEmailFromTemplate,
   getAvailableTemplates,
   renderTemplate
} = require('../templates');

describe('Email Templates', () =>
{
   describe('renderTemplate', () =>
   {
      it('replaces single placeholder', () =>
      {
         const result = renderTemplate('Hello {name}', { name: 'Alice' });
         expect(result).toBe('Hello Alice');
      });

      it('replaces multiple placeholders', () =>
      {
         const result = renderTemplate('{greeting} {name}, you have {count} messages',
            { greeting: 'Hello', name: 'Bob', count: '5' });
         expect(result).toBe('Hello Bob, you have 5 messages');
      });

      it('replaces repeated placeholders', () =>
      {
         const result = renderTemplate('{name} and {name}', { name: 'Charlie' });
         expect(result).toBe('Charlie and Charlie');
      });

      it('leaves unreplaced placeholders unchanged', () =>
      {
         const result = renderTemplate('Hello {name} {missing}', { name: 'Dave' });
         expect(result).toBe('Hello Dave {missing}');
      });
   });

   describe('validateTemplateArgs', () =>
   {
      it('validates BOX_REQUEST_SUBMITTED template args', () =>
      {
         const args = {
            requesterName: 'John Doe',
            boxName: 'My Documents',
            reason: 'Need storage',
            dashboardUrl: 'https://example.com/admin'
         };
         const result = validateTemplateArgs('BOX_REQUEST_SUBMITTED', args);
         expect(result.valid).toBe(true);
      });

      it('rejects missing required argument', () =>
      {
         const args = {
            requesterName: 'John Doe',
            boxName: 'My Documents'
            // missing reason and dashboardUrl
         };
         const result = validateTemplateArgs('BOX_REQUEST_SUBMITTED', args);
         expect(result.valid).toBe(false);
         expect(result.error).toContain('Missing required argument');
      });

      it('rejects non-string argument', () =>
      {
         const args = {
            requesterName: 'John Doe',
            boxName: 123,
            reason: 'Need storage',
            dashboardUrl: 'https://example.com/admin'
         };
         const result = validateTemplateArgs('BOX_REQUEST_SUBMITTED', args);
         expect(result.valid).toBe(false);
         expect(result.error).toContain('must be a string');
      });

      it('rejects unknown template', () =>
      {
         const result = validateTemplateArgs('UNKNOWN_TEMPLATE', {});
         expect(result.valid).toBe(false);
         expect(result.error).toContain('Unknown template');
      });

      it('rejects non-object args', () =>
      {
         const result = validateTemplateArgs('BOX_REQUEST_SUBMITTED', 'not an object');
         expect(result.valid).toBe(false);
         expect(result.error).toContain('must be an object');
      });

      it('rejects null args', () =>
      {
         const result = validateTemplateArgs('BOX_REQUEST_SUBMITTED', null);
         expect(result.valid).toBe(false);
         expect(result.error).toContain('must be an object');
      });
   });

   describe('getEmailFromTemplate', () =>
   {
      it('renders BOX_REQUEST_SUBMITTED template', () =>
      {
         const args = {
            requesterName: 'Jane Smith',
            boxName: 'Language Resources',
            reason: 'Organizing Smalgyax materials',
            dashboardUrl: 'https://hukdzen.org/admin/requests/123'
         };
         const email = getEmailFromTemplate('BOX_REQUEST_SUBMITTED', args);
         
         expect(email.subject).toContain('Jane Smith');
         expect(email.body).toContain('Jane Smith');
         expect(email.body).toContain('Language Resources');
         expect(email.body).toContain('Organizing Smalgyax materials');
         expect(email.body).toContain('https://hukdzen.org/admin/requests/123');
      });

      it('renders BOX_REQUEST_APPROVED template', () =>
      {
         const args = {
            requesterName: 'Bob Johnson',
            boxName: 'Teaching Materials',
            approverName: 'Admin User'
         };
         const email = getEmailFromTemplate('BOX_REQUEST_APPROVED', args);
         
         expect(email.subject).toContain('Approved');
         expect(email.body).toContain('Bob Johnson');
         expect(email.body).toContain('Teaching Materials');
         expect(email.body).toContain('Admin User');
         expect(email.body).toContain('approved');
      });

      it('renders BOX_REQUEST_DENIED template', () =>
      {
         const args = {
            requesterName: 'Alice Brown',
            boxName: 'Duplicate Box',
            denialReason: 'You already have a similar box'
         };
         const email = getEmailFromTemplate('BOX_REQUEST_DENIED', args);
         
         expect(email.subject).toContain('Update');
         expect(email.body).toContain('Alice Brown');
         expect(email.body).toContain('Duplicate Box');
         expect(email.body).toContain('You already have a similar box');
      });

      it('throws error for invalid template args', () =>
      {
         const args = { requesterName: 'Test' }; // missing required args
         
         expect(() => getEmailFromTemplate('BOX_REQUEST_SUBMITTED', args))
            .toThrow('Missing required argument');
      });

      it('throws error for unknown template', () =>
      {
         expect(() => getEmailFromTemplate('NONEXISTENT', {}))
            .toThrow('Unknown template');
      });
   });

   describe('getAvailableTemplates', () =>
   {
      it('returns array of template names', () =>
      {
         const templateNames = getAvailableTemplates();
         
         expect(Array.isArray(templateNames)).toBe(true);
         expect(templateNames).toContain('BOX_REQUEST_SUBMITTED');
         expect(templateNames).toContain('BOX_REQUEST_APPROVED');
         expect(templateNames).toContain('BOX_REQUEST_DENIED');
      });

      it('returns exactly 3 templates', () =>
      {
         const templateNames = getAvailableTemplates();
         expect(templateNames.length).toBe(3);
      });
   });

   describe('template definitions', () =>
   {
      it('BOX_REQUEST_SUBMITTED has all required fields', () =>
      {
         const template = templates.BOX_REQUEST_SUBMITTED;
         
         expect(template.subject).toBeDefined();
         expect(template.body).toBeDefined();
         expect(template.requiredArgs).toEqual([
            'requesterName', 'boxName', 'reason', 'dashboardUrl'
         ]);
      });

      it('BOX_REQUEST_APPROVED has all required fields', () =>
      {
         const template = templates.BOX_REQUEST_APPROVED;
         
         expect(template.subject).toBeDefined();
         expect(template.body).toBeDefined();
         expect(template.requiredArgs).toEqual([
            'requesterName', 'boxName', 'approverName'
         ]);
      });

      it('BOX_REQUEST_DENIED has all required fields', () =>
      {
         const template = templates.BOX_REQUEST_DENIED;
         
         expect(template.subject).toBeDefined();
         expect(template.body).toBeDefined();
         expect(template.requiredArgs).toEqual([
            'requesterName', 'boxName', 'denialReason'
         ]);
      });
   });
});
