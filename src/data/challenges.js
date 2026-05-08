export const challenges = [
  {
    id: 'comment-preview',
    title: 'Comment preview',
    difficulty: 'Beginner',
    context: 'HTML body',
    vulnerableCode: `function renderComment(comment) {
  preview.innerHTML = comment;
}`,
    prompt: 'Untrusted comment text is parsed as HTML before it is displayed.',
    payload: '<img src=x onerror=alert("comment")>',
    hint: 'The comment does not need markup support. Pick the DOM API that creates a text node.',
    fix: `function renderComment(comment) {
  preview.textContent = comment;
}`,
    lesson: 'When the feature only needs text, do not invoke the HTML parser.',
  },
  {
    id: 'profile-title',
    title: 'Profile title',
    difficulty: 'Beginner',
    context: 'Attribute',
    vulnerableCode: `card.innerHTML =
  '<button title="' + user.title + '">View</button>';`,
    prompt: 'A profile title is concatenated into a quoted attribute.',
    payload: '" autofocus onfocus=alert("title") x="',
    hint: 'If markup generation is required, encode for the exact output context. Better yet, set attributes with the DOM.',
    fix: `const button = document.createElement('button');
button.title = user.title;
button.textContent = 'View';
card.replaceChildren(button);`,
    lesson: 'DOM property assignment keeps the value as data instead of source text.',
  },
  {
    id: 'inline-config',
    title: 'Inline config',
    difficulty: 'Intermediate',
    context: 'JavaScript string',
    vulnerableCode: `<script>
  window.userName = '${'${profile.name}'}';
</script>`,
    prompt: 'A display name is injected into an inline script string.',
    payload: "'; alert('config'); //",
    hint: 'Serialized data must be valid JavaScript data, not string-concatenated source.',
    fix: `<script type="application/json" id="profile-data">
  {"name":"Ahmed"}
</script>`,
    lesson: 'Keep data in JSON and parse it, or safely serialize with JSON.stringify and escape script-breakout sequences.',
  },
  {
    id: 'redirect-link',
    title: 'Redirect link',
    difficulty: 'Intermediate',
    context: 'URL',
    vulnerableCode: `continueLink.href = new URLSearchParams(location.search).get('next');`,
    prompt: 'A query parameter controls a link target.',
    payload: 'javascript:alert("next")',
    hint: 'A URL parser can normalize the value, but you still need an allowlist.',
    fix: `const next = new URLSearchParams(location.search).get('next') || '/';
const url = new URL(next, location.origin);

if (url.origin === location.origin && ['http:', 'https:'].includes(url.protocol)) {
  continueLink.href = url.href;
}`,
    lesson: 'Validate destination origin and protocol before assigning navigation sinks.',
  },
  {
    id: 'markdown-lite',
    title: 'Markdown-lite renderer',
    difficulty: 'Advanced',
    context: 'DOM sink',
    vulnerableCode: `function render(text) {
  return text
    .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
    .replace(/\\n/g, '<br>');
}

output.innerHTML = render(input);`,
    prompt: 'A partial markdown renderer returns HTML and trusts captured user text.',
    payload: '**<img src=x onerror=alert("md")>**',
    hint: 'If you emit markup, text portions need escaping before wrappers are added.',
    fix: `function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => map[char]);
}

output.innerHTML = render(escapeHtml(input));`,
    lesson: 'Custom parsers need context-aware escaping. Avoid writing one unless the rules are very small.',
  },
];
