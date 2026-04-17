![Publish Status](https://github.com/ether/ep_test_line_attrib/workflows/Node.js%20Package/badge.svg) [![Backend Tests Status](https://github.com/ether/ep_test_line_attrib/actions/workflows/test-and-release.yml/badge.svg)](https://github.com/ether/ep_test_line_attrib/actions/workflows/test-and-release.yml)

# ep_test_line_attrib
Etherpad plugin to allow tests for line attributes on the core code of Etherpad.

**This plugin does nothing on production environment, it is supposed to be used only to run tests related to line attributes on Etherpad core code!!**

## Installation

Install from the Etherpad admin UI (**Admin → Manage Plugins**,
search for `ep_test_line_attrib` and click *Install*), or from the Etherpad
root directory:

```sh
pnpm run plugins install ep_test_line_attrib
```

> ⚠️ Don't run `npm i` / `npm install` yourself from the Etherpad
> source tree — Etherpad tracks installed plugins through its own
> plugin-manager, and hand-editing `package.json` can leave the
> server unable to start.

After installing, restart Etherpad.
