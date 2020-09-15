# pd-web (WIP)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fpingcap%2Fpd-web.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fpingcap%2Fpd-web?ref=badge_shield)


PD Web by PingCAP FE.

## The Rules

**Please ensure that each commit is followed the setting of:**

- `.editorconfig`
- `.prettierrc`

### Sass rules

Each `.scss` file is associated with a component, like `Container.scss`.

All components' top class name should keep with `PD-`, for example, `PD-Container` is the top class name of `Container` component.

### Component rules

All main components in the `components` dir should use the form of `index.tsx`, for example:

```sh
Container/
  index.tsx
  Routes.tsx
  Tabs.tsx
Nav/
  index.tsx
```

### Test rules

All test files should be placed in `src/__tests__` dir.

## How to develop

**For development, you must provide a pd client as environment variable.** For example:

```sh
REACT_APP_PD_CLIENT_URL=http://localhost:32845
```

Let's start:

```sh
git clone https://github.com/pingcap-fe/pd-web.git && cd pd-web

# We recommend using yarn
yarn
REACT_APP_PD_CLIENT_URL=http://localhost:32845 BROWSER=none yarn start
```

## Run tests

Make sure the necessary unit tests passed.

```sh
yarn test
```

## License

PD-Web is under the Apache 2.0 license. 


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fpingcap%2Fpd-web.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fpingcap%2Fpd-web?ref=badge_large)