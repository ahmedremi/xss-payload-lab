# XSS Payload Lab Sharing Drafts

## LinkedIn

I built XSS Payload Lab, a fully static browser security playground for learning injection contexts, output encoding, DOM sinks, and CSP behavior.

The interesting part is the sandbox preview:

```jsx
<iframe sandbox="allow-scripts" srcDoc={generatedHtml} />
```

Scripts can execute inside the iframe, but without `allow-same-origin` the frame gets a unique opaque origin. That lets the lab show when a payload fires without giving it access to the parent page's DOM or storage.

It includes:

- Payload library
- HTML / attribute / JavaScript / URL context explorer
- Safe sandbox preview
- Fix-the-sink challenges
- CSP playground

Live: https://xss-payload-lab.vercel.app
GitHub: https://github.com/ahmedremi/xss-payload-lab

## r/websecurity

Title:

```text
I built a static XSS playground with sandboxed iframe previews
```

Body:

```text
I built a small static React tool for learning XSS contexts safely in the browser.

The main idea is an iframe preview using sandbox="allow-scripts" with srcDoc, but without allow-same-origin. Payloads can execute inside the preview, while the frame keeps a unique opaque origin and cannot access the parent page's DOM/storage.

The tool covers:

- HTML body, attribute, JavaScript string, and URL contexts
- Context-specific encoding examples
- Safe sandbox event log for fired payloads
- Fix-the-sink challenges
- A small CSP playground

Live: https://xss-payload-lab.vercel.app
Source: https://github.com/ahmedremi/xss-payload-lab

Feedback on the sandbox model or context examples is welcome.
```

## Discord / Slack

```text
I built XSS Payload Lab, a static playground for learning XSS contexts, output encoding, DOM sinks, and CSP.

The sandbox preview uses <iframe sandbox="allow-scripts" srcDoc={...}> without allow-same-origin, so payloads can fire inside the preview while staying isolated from the parent app.

Live: https://xss-payload-lab.vercel.app
GitHub: https://github.com/ahmedremi/xss-payload-lab
```
