<!-- next-release -->

## 6.5.3 (2026-06-23)

### Fixed Bugs

- align shared preview runtime logic ([commit 70159e4](https://github.com/imzbf/md-editor-rt/commit/70159e43918f20c474a67ee1d8c10b4dfd94193a))
  - Move @vavt/markdown-theme into production dependencies and keep preview icon sizing aligned with the Vue package.
  - Match the shared editor behavior for CodeMirror extension order, task-list token attrs, and scroll margin handling.

**Full Changelog**: [v6.5.2...v6.5.3](https://github.com/imzbf/md-editor-rt/compare/v6.5.2...v6.5.3)

---

## 6.5.2 (2026-06-22)

### Refactors

- replace Less with Sass and optimize project build scripts ([commit 1b6f4cc](https://github.com/imzbf/md-editor-rt/commit/1b6f4ccbc3412aff1850eca3d2aa9bc26987ca28))

### Fixed Bugs

- handle content before first preview anchor ([commit abba880](https://github.com/imzbf/md-editor-rt/commit/abba88072957bf4ef7601fb9b67b949c30b9e57f))

**Full Changelog**: [v6.5.1...v6.5.2](https://github.com/imzbf/md-editor-rt/compare/v6.5.1...v6.5.2)

---

## 6.5.1 (2026-05-22)

### Refactors

- upgrade lucide-react ([commit afa50fc](https://github.com/imzbf/md-editor-rt/commit/afa50fc4f52c9b8a574354290369ed936b38911e))

- replace axios with native fetch for image upload Extract a shared `uploadImage` helper that uses the Fetch API with proper HTTP status and response-code validation, and remove the `axios` dev dependency. ([commit c615e49](https://github.com/imzbf/md-editor-rt/commit/c615e494d07f0ae5e9bb440ad7b637f57af24a95))

### Others

- build(scripts): replace tsx with native Node TypeScript support ([commit c3cc143](https://github.com/imzbf/md-editor-rt/commit/c3cc14332702b176e93a080deea72f3fdc12e202))
  - Remove the `tsx` dev dependency and switch npm scripts to use `node` directly, leveraging Node's
  - built-in TypeScript stripping. Update imports to use `.ts` extensions and type-only imports where
  - appropriate, and add the required tsconfig flags (`allowImportingTsExtensions`,
  - `emitDeclarationOnly`).

- docs(skill): update echarts parser guidance ([commit 73953d4](https://github.com/imzbf/md-editor-rt/commit/73953d46efa23455ea2795631b8ef7472f960d08))

**Full Changelog**: [v6.5.0...v6.5.1](https://github.com/imzbf/md-editor-rt/compare/v6.5.0...v6.5.1)

---

## 6.5.0 (2026-04-28)

### Features

- allow custom option parser ([commit a1a1ec8](https://github.com/imzbf/md-editor-rt/commit/a1a1ec8b77b851c2b7a5f602d03af516215abe7d))

### Others

- docs(skill): add downstream usage skill for react consumers ([commit 30b6db6](https://github.com/imzbf/md-editor-rt/commit/30b6db63a19aa17ec258127b16853660a3f63bfc))

**Full Changelog**: [v6.4.2...v6.5.0](https://github.com/imzbf/md-editor-rt/compare/v6.4.2...v6.5.0)

---

## 6.4.2 (2026-04-06)

### Fixed Bugs

- remove lru-cache runtime dependency ([commit 1f4f52d](https://github.com/imzbf/md-editor-rt/commit/1f4f52d37c7ccb6152c468f4d0eae78b67b9ed3e))
  - Replace the mermaid cache implementation with an internal TTL/LRU cache and stop externalizing lru-cache in library builds.

**Full Changelog**: [v6.4.1...v6.4.2](https://github.com/imzbf/md-editor-rt/compare/v6.4.1...v6.4.2)

---

## 6.4.1 (2026-03-21)

### Fixed Bugs

- bump @vavt/util to address prototype pollution ([commit 863662c](https://github.com/imzbf/md-editor-rt/commit/863662c6b013857676ffb276cef7dea527e80675))

**Full Changelog**: [v6.4.0...v6.4.1](https://github.com/imzbf/md-editor-rt/compare/v6.4.0...v6.4.1)

---

## 6.4.0 (2026-03-05)

### Features

- use white mermaid theme in light mode ([commit 7412331](https://github.com/imzbf/md-editor-rt/commit/74123316f07f51b87e5b3552d84d4f653e65dc6e))

### Fixed Bugs

- bump @vavt/markdown-theme to fix mermaid overflow ([commit e5f3277](https://github.com/imzbf/md-editor-rt/commit/e5f327751264be5ae4b75a9f7537913a9982e118))
  - Fixes preview clipping where mermaid blocks with many lines overflow on the last line due to p line-height behavior.

### Others

- docs(readme): clarify commit message should include solved problem ([commit 889bb45](https://github.com/imzbf/md-editor-rt/commit/889bb456711592f95e932ca39e60dd386a7e1162))

**Full Changelog**: [v6.3.2...v6.4.0](https://github.com/imzbf/md-editor-rt/compare/v6.3.2...v6.4.0)

---

## 6.3.2 (2026-03-04)

### Refactors

- replace dts pipeline with rollup-plugin-dts ([commit 467bb1f](https://github.com/imzbf/md-editor-rt/commit/467bb1f937c7efdec6838152830a44e8afc65b28))

### Others

- chore(deps): upgrade highlightjs/prettier/mermaid/katex and refresh sri ([commit e4b7bb5](https://github.com/imzbf/md-editor-rt/commit/e4b7bb5c7cac610fbaf2196b744c90270a19e793))

- docs(readme): add release-aligned commit convention ([commit 8b18232](https://github.com/imzbf/md-editor-rt/commit/8b18232521617d7bf9a03fe35dd1ab8804238c53))

- chore(deps): migrate package management from yarn to npm ([commit bcc8597](https://github.com/imzbf/md-editor-rt/commit/bcc859766476316b56540547d3e8fff20c1d65f8))

- ci(github): automate issue triage and release workflows ([commit bcaf1cd](https://github.com/imzbf/md-editor-rt/commit/bcaf1cd115f36519a91027c04fab035ad3e30a9e))

**Full Changelog**: [v6.3.1...v6.3.2](https://github.com/imzbf/md-editor-rt/compare/v6.3.1...v6.3.2)

---
