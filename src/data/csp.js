export const cspRules = [
  {
    id: 'blockInlineScripts',
    label: 'Block inline scripts',
    directive: "script-src 'self'",
    description: 'Blocks script tags, inline handlers, and javascript: URLs unless a nonce or hash allows them.',
    defaultEnabled: true,
  },
  {
    id: 'blockInlineHandlers',
    label: 'Block inline handlers',
    directive: "script-src-attr 'none'",
    description: 'Targets event attributes such as onerror and onclick.',
    defaultEnabled: true,
  },
  {
    id: 'blockDataUrls',
    label: 'Block data URLs',
    directive: "object-src 'none'; img-src 'self' https:",
    description: 'Reduces abuse of data: payloads in navigations and embeddable content.',
    defaultEnabled: true,
  },
  {
    id: 'trustedTypes',
    label: 'Require Trusted Types',
    directive: "require-trusted-types-for 'script'",
    description: 'Prevents dangerous DOM sink assignment unless a Trusted Types policy approves it.',
    defaultEnabled: false,
  },
  {
    id: 'noExternalScripts',
    label: 'Self-host scripts',
    directive: "script-src 'self'",
    description: 'Blocks third-party scripts that are not on the same origin.',
    defaultEnabled: true,
  },
];

export const cspTestCases = [
  {
    id: 'script-tag',
    name: 'Inline script tag',
    sample: '<script>alert(1)</script>',
    blockedBy: ['blockInlineScripts'],
    note: 'A nonce or hash can allow specific inline scripts, but the default should block them.',
  },
  {
    id: 'event-handler',
    name: 'Image onerror handler',
    sample: '<img src=x onerror=alert(1)>',
    blockedBy: ['blockInlineHandlers', 'blockInlineScripts'],
    note: 'Inline event handlers are script attributes.',
  },
  {
    id: 'javascript-url',
    name: 'javascript: link',
    sample: '<a href="javascript:alert(1)">open</a>',
    blockedBy: ['blockInlineScripts'],
    note: 'Script execution through URL navigation is governed by script-src.',
  },
  {
    id: 'data-svg',
    name: 'data: SVG image',
    sample: '<img src="data:image/svg+xml,...">',
    blockedBy: ['blockDataUrls'],
    note: 'The safest image policy usually excludes data: unless there is a clear product need.',
  },
  {
    id: 'inner-html',
    name: 'innerHTML assignment',
    sample: 'element.innerHTML = userInput',
    blockedBy: ['trustedTypes'],
    note: 'Trusted Types protects DOM XSS sinks in supporting browsers.',
  },
  {
    id: 'cdn-script',
    name: 'Third-party script',
    sample: '<script src="https://cdn.example/app.js"></script>',
    blockedBy: ['noExternalScripts'],
    note: 'Self-hosting scripts reduces supply-chain exposure and policy complexity.',
  },
];
