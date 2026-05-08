# I built a static XSS playground that runs payloads safely in the browser - here's how the sandbox works

Most XSS learning resources have a tradeoff. They either explain payloads theoretically without letting you see execution, or they require a deliberately vulnerable backend. I wanted a safer middle ground: a fully static frontend app where payloads can run, but only inside an isolated preview.

The core of the project is a sandboxed iframe:

```jsx
<iframe
  title="Sandboxed XSS payload preview"
  sandbox="allow-scripts"
  srcDoc={generatedHtml}
/>
```

The important detail is what is **not** allowed. The iframe has `allow-scripts`, so payloads can execute inside the preview, but it does not have `allow-same-origin`. That means the iframe gets a unique opaque origin. The payload can demonstrate behavior, but it cannot access the parent page's origin, storage, or DOM.

I also override risky browser APIs inside the frame:

```js
window.alert = (message) => {
  parent.postMessage({ type: 'xss-alert', message }, '*')
}

window.open = () => null
window.fetch = () => Promise.reject(new Error('Network disabled'))
```

That lets the app show when a payload fires without letting the preview become a real attack surface.

The lab focuses on four common output contexts.

HTML body:

```js
preview.innerHTML = userInput
```

Fix:

```js
preview.textContent = userInput
```

Attribute context:

```js
button.innerHTML = `<span title="${userInput}">View</span>`
```

Fix:

```js
button.title = userInput
```

JavaScript string:

```html
<script>
  const name = '${userInput}'
</script>
```

Fix: keep data as JSON, not executable source.

```html
<script type="application/json" id="profile-data">
  {"name":"Ahmed"}
</script>
```

URL context:

```js
link.href = userInput
```

Fix:

```js
const url = new URL(userInput, location.origin)

if (['http:', 'https:'].includes(url.protocol)) {
  link.href = url.href
}
```

The biggest CSP reminder while building this was simple: allowing inline scripts often defeats the point of the policy. A strong CSP can reduce XSS impact, but it is not a replacement for correct output encoding and safe DOM APIs.

The result is XSS Payload Lab: a static React app with a payload library, context explorer, sandbox preview, fix-the-sink challenges, and a CSP playground.

Live tool: https://xss-payload-lab.vercel.app  
GitHub: https://github.com/ahmedremi/xss-payload-lab
