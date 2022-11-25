# create-mpl

Create a project in seconds!

[![asciicast](https://asciinema.org/a/455622.svg)](https://asciinema.org/a/455622)

## Usage

With NPM:

```bash
npm init mpl@latest
```

With Yarn:

```bash
yarn create mpl
```

With PNPM:

```bash
pnpm create mpl
```

Then follow the prompts!

## Application Types

- `web` - Web App
  - `remix` - Remix
  - `vite` - Vite
  - `cra` - React
  - `umi` - UmiJS
  - `vue` - Vuejs
  - `svelte` - Svelte
  - `angular` - Angular
- `tauri` - Tauri
- `wasm` - WebAssembly
- `mini` - Mini Program
  - `taro` - Taro
  - `uni` - uni-app
- `electron` - Electron
  - `electron-quick-start` - Electron Quick Start
  - `electron-quick-start-typescript` - Electron Quick Start (TypeScript)
- `extension` - Extension
  - `vscode` - Visual Studio Code
  - `chrome` - Chrome
- `github` - GitHub Template (Custom)
- ... - (TODO)

You can also directly specify the `project name` and the `app type` you want to use via additional command line options.

```bash
# --type, -t: web | wasm | mini | electron | extension | chrome | github

# npm 6.x
npm init mpl@latest my-app --type web

# npm 7+, extra double-dash is needed:
npm init mpl@latest my-app -- --type web

# yarn
yarn create mpl my-app --type web

# pnpm
pnpm create mpl my-app -- --type web
```

## Community Template

Check out [awesome/mpl](https://github.com/lencx/awesome/blob/main/mpl.md) - you can also submit a PR to list your template there.

```bash
> npm init mpl@latest my-app --type github
⚡️ v0.1.x
✔ github owner: … <owner>
✔ github repo: … <repo>
✔ repo branch: … <branch>
✔ sub dir: … <sub_dir> # '/' - root path
[dgh::download] <owner>/<repo>:<branch>/<sub_dir> /<your_path>/my-app

$ cd my-app
```

## FAQ

[mpl FAQ](https://github.com/lencx/create-mpl/issues/4) - Encountered an unknown error, please try again after clearing the cache.

`rm -rf $(npm get cache)/_npx/*`

## Related

- [awesome/mpl](https://github.com/lencx/awesome/blob/main/mpl.md) - Awesome mpl template.
- [download-github](https://github.com/lencx/download-github) - ⬇️ Download directory from a GitHub repo.
