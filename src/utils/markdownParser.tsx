import React from 'react';

/**
 * Lightweight Markdown parser for inline formatting only.
 * Supports: bold, italic, underline, strikethrough, inline code, highlight, and links.
 * Does NOT support: headers, tables, lists, code blocks, etc.
 */
interface ParsedSegment
{
   type: 'text' | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'highlight' | 'link';
   content: string;
   url?: string;
}

/** Get trusted domains based on environment */
const getTrustedDomains = (): string[] =>
{
   return [ 'localhost', '127.0.0.1',
            'smalgyax-files.org', 'd1nnyhcu0aulq5.amplifyapp.com'
   ];
};

/** Check if URL domain is trusted */
const isTrustedDomain = (url: string): boolean =>
{
   try
   {
      const urlObj = new URL(url, window.location.origin);
      const hostname = urlObj.hostname.toLowerCase();
      const trustedDomains = getTrustedDomains();
      
      return trustedDomains.some(domain => 
         hostname === domain || hostname.endsWith(`.${domain}`)
      );
   }
   catch { return false; }
};

/** Sanitize URL to prevent XSS attacks and restrict to trusted domains */
const sanitizeUrl = (url: string): string | null =>
{
   const trimmed = url.trim();
   
   // Block javascript: and data: URLs
   if ( /^(javascript|data|vbscript):/i.test(trimmed) ) { return null; }
   
   // Allow relative paths
   if ( trimmed.startsWith('/') ) { return trimmed; }
   
   // Allow mailto
   if ( /^mailto:/i.test(trimmed) ) { return trimmed; }
   
   // Check if external URL is from trusted domain
   if ( /^https?:\/\//i.test(trimmed) )
   {
      if ( isTrustedDomain(trimmed) ) { return trimmed; }
      return null;
   }
   
   // Block everything else
   return null;
};

/** Parse Markdown text into segments with formatting metadata */
export const parseMarkdown = (text: string): ParsedSegment[] =>
{
   const segments: ParsedSegment[] = [];
   let remaining = text;
   let index = 0;

   while ( 0 < remaining.length )
   {
      // Links: [text](url)
      const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
      if ( linkMatch )
      {
         const sanitizedUrl = sanitizeUrl(linkMatch[2]);
         if ( sanitizedUrl )
         { segments.push({ type: 'link', content: linkMatch[1], url: sanitizedUrl }); }
         else
         { segments.push({ type: 'text', content: linkMatch[0] }); }
         remaining = remaining.slice(linkMatch[0].length);
         continue;
      }

      // Inline code: `code`
      const codeMatch = remaining.match(/^`([^`]+)`/);
      if ( codeMatch )
      {
         segments.push({ type: 'code', content: codeMatch[1] });
         remaining = remaining.slice(codeMatch[0].length);
         continue;
      }

      // Highlight: ==text==
      const highlightMatch = remaining.match(/^==([^=]+)==/);
      if ( highlightMatch )
      {
         segments.push({ type: 'highlight', content: highlightMatch[1] });
         remaining = remaining.slice(highlightMatch[0].length);
         continue;
      }

      // Bold: **text**
      const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
      if ( boldMatch )
      {
         segments.push({ type: 'bold', content: boldMatch[1] });
         remaining = remaining.slice(boldMatch[0].length);
         continue;
      }

      // Italic: *text*
      const italicMatch = remaining.match(/^\*([^*]+)\*/);
      if ( italicMatch )
      {
         segments.push({ type: 'italic', content: italicMatch[1] });
         remaining = remaining.slice(italicMatch[0].length);
         continue;
      }

      // Underline: __text__
      const underlineMatch = remaining.match(/^__([^_]+)__/);
      if ( underlineMatch )
      {
         segments.push({ type: 'underline', content: underlineMatch[1] });
         remaining = remaining.slice(underlineMatch[0].length);
         continue;
      }

      // Strikethrough: ~~text~~
      const strikeMatch = remaining.match(/^~~([^~]+)~~/);
      if ( strikeMatch )
      {
         segments.push({ type: 'strikethrough', content: strikeMatch[1] });
         remaining = remaining.slice(strikeMatch[0].length);
         continue;
      }

      // Plain text: consume until next special character
      const plainMatch = remaining.match(/^[^*_~`=[]+/);
      if ( plainMatch )
      {
         segments.push({ type: 'text', content: plainMatch[0] });
         remaining = remaining.slice(plainMatch[0].length);
         continue;
      }

      // Single character that didn't match (edge case)
      segments.push({ type: 'text', content: remaining[0] });
      remaining = remaining.slice(1);
   }

   return segments;
};

/** Render parsed Markdown segments as React elements */
export const renderMarkdown = (text: string): React.ReactNode =>
{
   const segments = parseMarkdown(text);

   return segments.map((segment, index) =>
   {
      const key = `${segment.type}-${index}`;

      switch ( segment.type )
      {
         case 'bold':
            return <strong key={key}>{segment.content}</strong>;

         case 'italic':
            return <em key={key}>{segment.content}</em>;

         case 'underline':
            return <u key={key}>{segment.content}</u>;

         case 'strikethrough':
            return <s key={key}>{segment.content}</s>;

         case 'code':
            return <code key={key}
                         style={{ backgroundColor: 'rgba(0,0,0,0.3)',
                                  padding: '2px 4px', borderRadius: '3px',
                                   fontFamily: 'monospace' }}
                   >
                     {segment.content}
                   </code>;

         case 'highlight':
            return <mark key={key}
                         style={{ backgroundColor: 'rgba(255,255,0,0.7)',
                                  padding: '2px 4px' }}
                   >
                     {segment.content}
                   </mark>;

         case 'link':
            if ( !segment.url )
            { return <span key={key}>{segment.content}</span>; }
            // Use regular anchor tag for all links (internal and external)
            // Internal links will navigate via browser, external open in new tab
            const isExternal = segment.url.startsWith('http');
            return <a key={key} 
                      href={segment.url} 
                      target={isExternal ? '_blank' : '_self'}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      style={{ color: 'inherit', textDecoration: 'underline' }}>
                      {segment.content}
                   </a>;

         case 'text':
         default:
            return <span key={key}>{segment.content}</span>;
      }
   });
};
