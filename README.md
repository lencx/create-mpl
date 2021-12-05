# create-mpl

Create a project in seconds!

## Usage

```bash
npm init mpl
```

## Community Template

Check out [awesome/mpl](https://github.com/lencx/awesome/blob/main/mpl.md) - you can also submit a PR to list your template there.

```bash
> npm init mpl
⚡️ v0.1.x
✔ Project name: … my-app
✔ Select an application types: › GitHub Template
✔ github owner: … <owner>
✔ github repo: … <repo>
✔ repo branch: … <branch>
[dgh::download] <owner>/<repo>:<branch> /<your_path>/my-app

$ cd my-app
```

## Application Types

- `Web App` - web
  - `Remix` - remix
  - `Vite` - vite
  - `React` - cra
  - `UmiJS` - umi
  - `Vue.js` - vue
  - `Svelte` - svelte
  - `Angular` - angular
- `WebAssembly` - wasm
- `Mini Program` - mini
  - `Taro` - taro
  - `uni-app` - uni
  <!-- - `Kbone` - kbone -->
- `Electron` - electron
  - `Electron Quick Start` - electron-quick-start
  - `Electron Quick Start (TypeScript)` - electron-quick-start-typescript
- `Extension` - extension
  - `Visual Studio Code` - vscode
  - `Chrome` - chrome
- `GitHub Template (Custom)` - github
- ... - (TODO)

## FAQ

[mpl FAQ](https://github.com/lencx/create-mpl/issues/4) - Encountered an unknown error, please try again after clearing the cache.

`rm -rf $(npm get cache)/_npx/*`

## Related

- [download-github](https://github.com/lencx/download-github) - ⬇️ Download directory from a GitHub repo.
