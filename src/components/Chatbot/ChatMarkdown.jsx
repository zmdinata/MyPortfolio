import React from 'react';

/**
 * ChatMarkdown
 * Zero-dependency, lightweight, and XSS-safe Markdown parser component for Agent-Z chat bubbles.
 * Supports: bold, italic, inline code, code blocks, bullet lists, numbered lists, links, and line breaks.
 */

// Safely sanitize URLs to prevent javascript: or data: injection
function sanitizeUrl(url) {
  if (!url) return '#';
  const trimmed = url.trim();
  if (/^(https?:\/\/|mailto:)/i.test(trimmed)) {
    return trimmed;
  }
  return '#';
}

// Parse inline formatting: bold, italic, inline code, links, and raw URLs
function parseInline(text, keyPrefix = 'inline') {
  if (!text) return null;

  // Tokenize regex for:
  // 1. Code: `code`
  // 2. Bold: **text** or __text__
  // 3. Italic: *text* or _text_
  // 4. Markdown Link: [text](url)
  // 5. Raw URL: https://... or http://...
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s<)]+)/g;

  const parts = [];
  let lastIndex = 0;
  let match;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    // Plain text before match
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const token = match[0];
    const itemKey = `${keyPrefix}-${index++}`;

    if (token.startsWith('`') && token.endsWith('`')) {
      // Inline code
      parts.push(
        <code key={itemKey} className="chat-inline-code">
          {token.slice(1, -1)}
        </code>
      );
    } else if (
      (token.startsWith('**') && token.endsWith('**')) ||
      (token.startsWith('__') && token.endsWith('__'))
    ) {
      // Bold
      parts.push(
        <strong key={itemKey} className="chat-bold">
          {parseInline(token.slice(2, -2), `${itemKey}-b`)}
        </strong>
      );
    } else if (
      (token.startsWith('*') && token.endsWith('*')) ||
      (token.startsWith('_') && token.endsWith('_'))
    ) {
      // Italic
      parts.push(
        <em key={itemKey} className="chat-italic">
          {parseInline(token.slice(1, -1), `${itemKey}-i`)}
        </em>
      );
    } else if (token.startsWith('[') && token.includes('](') && token.endsWith(')')) {
      // Markdown link: [Title](url)
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const linkText = linkMatch[1];
        const linkUrl = sanitizeUrl(linkMatch[2]);
        parts.push(
          <a
            key={itemKey}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="chat-link"
          >
            {linkText}
          </a>
        );
      } else {
        parts.push(token);
      }
    } else if (/^https?:\/\//i.test(token)) {
      // Raw URL
      const cleanUrl = sanitizeUrl(token);
      parts.push(
        <a
          key={itemKey}
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="chat-link"
        >
          {token}
        </a>
      );
    } else {
      parts.push(token);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}

export default function ChatMarkdown({ content }) {
  if (!content) return null;

  // Split into lines to detect block elements (lists, code blocks, paragraphs)
  const lines = content.split('\n');
  const elements = [];
  let i = 0;
  let blockIndex = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code blocks: ```lang ... ```
    if (trimmed.startsWith('```')) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={`codeblock-${blockIndex++}`} className="chat-code-block">
          <code>{codeLines.join('\n')}</code>
        </pre>
      );
      i++;
      continue;
    }

    // 2. Unordered List: lines starting with `- ` or `* `
    if (/^[-*]\s+/.test(trimmed)) {
      const listItems = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        const itemText = lines[i].trim().replace(/^[-*]\s+/, '');
        listItems.push(
          <li key={`ul-item-${listItems.length}`}>
            {parseInline(itemText, `ul-inline-${blockIndex}-${listItems.length}`)}
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${blockIndex++}`} className="chat-list chat-ul">
          {listItems}
        </ul>
      );
      continue;
    }

    // 3. Ordered List: lines starting with `1. `, `2. `, etc.
    if (/^\d+\.\s+/.test(trimmed)) {
      const listItems = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        const itemText = lines[i].trim().replace(/^\d+\.\s+/, '');
        listItems.push(
          <li key={`ol-item-${listItems.length}`}>
            {parseInline(itemText, `ol-inline-${blockIndex}-${listItems.length}`)}
          </li>
        );
        i++;
      }
      elements.push(
        <ol key={`ol-${blockIndex++}`} className="chat-list chat-ol">
          {listItems}
        </ol>
      );
      continue;
    }

    // 4. Empty line -> spacer or ignore
    if (!trimmed) {
      i++;
      continue;
    }

    // 5. Standard paragraph / heading-like line
    // Accumulate consecutive non-empty lines that aren't lists or code
    const paragraphLines = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('```') &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }

    if (paragraphLines.length > 0) {
      elements.push(
        <p key={`p-${blockIndex++}`} className="chat-paragraph">
          {paragraphLines.map((pLine, pIdx) => (
            <React.Fragment key={`pline-${pIdx}`}>
              {pIdx > 0 && <br />}
              {parseInline(pLine, `p-inline-${blockIndex}-${pIdx}`)}
            </React.Fragment>
          ))}
        </p>
      );
    }
  }

  return <div className="chat-markdown-body">{elements}</div>;
}
