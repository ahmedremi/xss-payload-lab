const htmlMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

const jsMap = {
  '\\': '\\\\',
  "'": "\\'",
  '"': '\\"',
  '\n': '\\n',
  '\r': '\\r',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
  '<': '\\x3C',
  '>': '\\x3E',
  '&': '\\x26',
};

export const contexts = [
  {
    id: 'html',
    label: 'HTML body',
    vulnerableLabel: 'innerHTML sink',
    encodedLabel: 'HTML encoded',
  },
  {
    id: 'attribute',
    label: 'Attribute',
    vulnerableLabel: 'quoted attribute',
    encodedLabel: 'attribute encoded',
  },
  {
    id: 'javascript',
    label: 'JavaScript',
    vulnerableLabel: 'inline script string',
    encodedLabel: 'JS string escaped',
  },
  {
    id: 'url',
    label: 'URL',
    vulnerableLabel: 'navigation sink',
    encodedLabel: 'URL validated',
  },
];

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (char) => htmlMap[char]);
}

export function escapeAttribute(value = '') {
  return escapeHtml(value).replace(/`/g, '&#x60;');
}

export function escapeJsString(value = '') {
  return String(value).replace(/[\\'"<>&\n\r\u2028\u2029]/g, (char) => jsMap[char]);
}

export function encodeUrlParameter(value = '') {
  return encodeURIComponent(String(value));
}

export function normalizeUrl(value = '') {
  try {
    const parsed = new URL(String(value), 'https://example.test');
    const allowedProtocols = ['https:', 'http:', 'mailto:'];

    if (!allowedProtocols.includes(parsed.protocol)) {
      return '/blocked-url';
    }

    if (parsed.origin === 'https://example.test') {
      return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    }

    return parsed.href;
  } catch {
    return '/blocked-url';
  }
}

export function encodeForContext(value = '', context = 'html') {
  switch (context) {
    case 'attribute':
      return escapeAttribute(value);
    case 'javascript':
      return escapeJsString(value);
    case 'url':
      return normalizeUrl(value);
    case 'html':
    default:
      return escapeHtml(value);
  }
}

export function getContextSnippet(value = '', context = 'html', encoded = false) {
  const renderedValue = encoded ? encodeForContext(value, context) : value;

  switch (context) {
    case 'attribute':
      return `<input value="${renderedValue}" />`;
    case 'javascript':
      return `<script>
  const userInput = '${renderedValue}';
  output.textContent = userInput;
</script>`;
    case 'url':
      return encoded
        ? `<a href="${renderedValue}">Continue</a>`
        : `<a href="${value}">Continue</a>`;
    case 'html':
    default:
      return `<div class="preview">
  ${renderedValue}
</div>`;
  }
}

export function getRiskNotes(value = '') {
  const payload = String(value).toLowerCase();
  const notes = [];

  if (payload.includes('<script')) {
    notes.push('Script tag detected');
  }

  if (/on[a-z]+\s*=/.test(payload)) {
    notes.push('Inline event handler detected');
  }

  if (payload.includes('javascript:')) {
    notes.push('javascript: URL detected');
  }

  if (payload.includes('data:')) {
    notes.push('data: URL detected');
  }

  if (payload.includes('innerhtml')) {
    notes.push('DOM parser sink mentioned');
  }

  return notes.length > 0 ? notes : ['No obvious active marker in this value'];
}
