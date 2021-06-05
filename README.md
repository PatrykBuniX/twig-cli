# twig-cli

## What is it?

`twig-cli` is a cli for creating twig template boilerplate for Wordpress custom theme.
I've created this to make initializing new wp twig themes easier.
**This cli works with specific folder structure only and might break if you change it!**
I think I will make this cli more customizable in the future, but for now you have to follow folder structure described below.

## Folder structure

### `./` (root)

- `header.php`,
- `footer.php`,
- `index.php`,
- `functions.php`,
- `404.php`,
- `styles.css`
- pages' files (e.g. `home.php`)

### `./static`

Folder containing all static files: (images, icons, scripts)

- `script.js` - main JS file
- `no-timber.html` - file showing an error when timber plugin is not activated.

### `./styles/scss`

**\*Do NOT change its name!**

Folder containing all style (`.scss`) files.

- `global.scss`
- `header.scss`
- `footer.scss`
- `style.scss`
- pages' files (e.g. `home.scss`)

### `./templates`

**\*Do NOT change its name!**

Folder containing all template (`.twig`) files.

- `html-header.twig`
- `base.twig`
- `header.twig`
- `footer.twig`
- `404.twig`
- pages' files (e.g. `home.twig`)

## Local usage

```bash
git clone https://github.com/PatrykBuniX/twig-cli.git
npm install
npm start
```

You can make it globally available by using this command in this project's directory:

```bash
npm link
```

## Options:

There are two options available for now:

1.Initialize new project - it will copy all starter files and create pages' files (`.php`, `.twig` and `.scss`) with specified names.

2.Add page(s) to existing project - it will add pages' files (`.php`, `.twig` and `.scss`) with specified names to existing template folder.

## Starter theme files author:

All starter files were copied from `timber/starter-theme` repo (check it out: https://github.com/timber/starter-theme) and modified the way I like it.
