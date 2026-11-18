# md-editor-rt integration examples

Standalone applications that consume the published `md-editor-rt` 7.x package. Install dependencies in the example you want to run. Node.js 22.12 or later is required by the example tooling; this is separate from the library's React 18+ compatibility.

| Example | Demonstrates |
| --- | --- |
| [Next.js](next/README.md) | Pages Router, server rendering, editing, preview and an external catalog |
| [Web Component](web-component/README.md) | A React editor in Shadow DOM, local dependencies and custom-element lifecycle |

The examples use `^7.1.0`, not an unbounded `latest` dependency. They do not automatically consume uncommitted library changes; check the installed package version when verifying a fix that has not yet been released.

The [downstream skill](../skills/md-editor-rt/SKILL.md) provides focused API and integration patterns. Image uploads and article persistence require application endpoints and are not implemented by these standalone examples.
