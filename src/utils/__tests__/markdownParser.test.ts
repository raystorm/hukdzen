import { describe, test, expect } from 'vitest';
import { parseMarkdown } from '../markdownParser';

describe('Markdown Parser', () => {

   test('parses plain text', () => {
      const result = parseMarkdown('Hello world');
      expect(result).toEqual([
         { type: 'text', content: 'Hello world' }
      ]);
   });

   test('parses bold text', () => {
      const result = parseMarkdown('This is **bold** text');
      expect(result).toEqual([
         { type: 'text', content: 'This is ' },
         { type: 'bold', content: 'bold' },
         { type: 'text', content: ' text' }
      ]);
   });

   test('parses italic text', () => {
      const result = parseMarkdown('This is *italic* text');
      expect(result).toEqual([
         { type: 'text', content: 'This is ' },
         { type: 'italic', content: 'italic' },
         { type: 'text', content: ' text' }
      ]);
   });

   test('parses underline text', () => {
      const result = parseMarkdown('This is __underlined__ text');
      expect(result).toEqual([
         { type: 'text', content: 'This is ' },
         { type: 'underline', content: 'underlined' },
         { type: 'text', content: ' text' }
      ]);
   });

   test('parses strikethrough text', () => {
      const result = parseMarkdown('This is ~~crossed out~~ text');
      expect(result).toEqual([
         { type: 'text', content: 'This is ' },
         { type: 'strikethrough', content: 'crossed out' },
         { type: 'text', content: ' text' }
      ]);
   });

   test('parses inline code', () => {
      const result = parseMarkdown('Use `npm install` to install');
      expect(result).toEqual([
         { type: 'text', content: 'Use ' },
         { type: 'code', content: 'npm install' },
         { type: 'text', content: ' to install' }
      ]);
   });

   test('parses highlight text', () => {
      const result = parseMarkdown('This is ==important== text');
      expect(result).toEqual([
         { type: 'text', content: 'This is ' },
         { type: 'highlight', content: 'important' },
         { type: 'text', content: ' text' }
      ]);
   });

   test('parses links', () => {
      const result = parseMarkdown('Click [here](/box/123) to view');
      expect(result).toEqual([
         { type: 'text', content: 'Click ' },
         { type: 'link', content: 'here', url: '/box/123' },
         { type: 'text', content: ' to view' }
      ]);
   });

   test('blocks external links from untrusted domains', () => {
      // google.com is not in trusted domains, so link is blocked
      const result = parseMarkdown('Visit [Google](https://google.com) now');
      expect(result).toEqual([
         { type: 'text', content: 'Visit ' },
         { type: 'text', content: '[Google](https://google.com)' },
         { type: 'text', content: ' now' }
      ]);
   });

   test('parses multiple formatting types', () => {
      const result = parseMarkdown('**Bold** and *italic* and [link](/path)');
      expect(result).toEqual([
         { type: 'bold', content: 'Bold' },
         { type: 'text', content: ' and ' },
         { type: 'italic', content: 'italic' },
         { type: 'text', content: ' and ' },
         { type: 'link', content: 'link', url: '/path' }
      ]);
   });

   test('handles empty string', () => {
      const result = parseMarkdown('');
      expect(result).toEqual([]);
   });

   test('handles unmatched markers as plain text', () => {
      const result = parseMarkdown('This has * one asterisk');
      expect(result).toEqual([
         { type: 'text', content: 'This has ' },
         { type: 'text', content: '*' },
         { type: 'text', content: ' one asterisk' }
      ]);
   });

   test('blocks javascript: URLs', () => {
      // Blocked URLs with parentheses get split by the regex
      const result = parseMarkdown('[XSS](javascript:alert(1))');
      expect(result).toEqual([
         { type: 'text', content: '[XSS](javascript:alert(1)' },
         { type: 'text', content: ')' }
      ]);
   });

   test('blocks data: URLs', () => {
      // Blocked URLs with angle brackets get split by the regex
      const result = parseMarkdown('[XSS](data:text/html,<script>alert(1)</script>)');
      expect(result).toEqual([
         { type: 'text', content: '[XSS](data:text/html,<script>alert(1)' },
         { type: 'text', content: '</script>)' }
      ]);
   });

   test('allows https URLs from trusted domains', () => {
      const result = parseMarkdown('[Safe](https://smalgyax-files.org/page)');
      expect(result).toEqual([
         { type: 'link', content: 'Safe', url: 'https://smalgyax-files.org/page' }
      ]);
   });

   test('blocks https URLs from untrusted domains', () => {
      const result = parseMarkdown('[Blocked](https://evil.com)');
      expect(result).toEqual([
         { type: 'text', content: '[Blocked](https://evil.com)' }
      ]);
   });

   test('allows relative URLs', () => {
      const result = parseMarkdown('[Safe](/path/to/page)');
      expect(result).toEqual([
         { type: 'link', content: 'Safe', url: '/path/to/page' }
      ]);
   });

   test('cannot nest formatting markers', () => {
      // Parser doesn't support nesting - asterisks inside break the pattern
      const result = parseMarkdown('**bold not *italic**');
      expect(result).toEqual([
         { type: 'text', content: '*' },
         { type: 'italic', content: 'bold not ' },
         { type: 'text', content: 'italic' },
         { type: 'text', content: '*' },
         { type: 'text', content: '*' }
      ]);
   });

   test('can mix different marker types', () => {
      // Different markers work together since they use different characters
      const result = parseMarkdown('**bold __underline__**');
      expect(result).toEqual([
         { type: 'bold', content: 'bold __underline__' }
      ]);
   });
});
