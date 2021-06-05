#!/usr/bin/env node

const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs-extra");
const { writeFile } = require("fs").promises;

const starterFolderPath = path.resolve(__dirname, "starter-theme");

async function copyStarterFiles(destination) {
  try {
    await fs.copy(starterFolderPath, destination);
    console.log("Starter theme copied successfully!");
  } catch (error) {
    console.error(error);
  }
}

async function createAndWriteFile(filePath, textContent) {
  try {
    await writeFile(filePath, textContent, { flag: "w" });
    console.log("Created: " + filePath);
  } catch (error) {
    console.error(error);
  }
}

function generateMainCssFileContent({ themeName, author }) {
  return `/*
  * Theme Name: ${themeName}
  * Description:
  * Author: ${author}.
*/
  `;
}
function generatePhpFileContent(filename) {
  return `<?php
/**
* Template name: ${filename}
*
* @package  WordPress
* @subpackage  Timber
* @since    Timber 0.1
*/

$context = Timber::get_context();
$post = new TimberPost();

$context['post'] = $post;

Timber::render( array( '${filename}.twig' ), $context );
`;
}

function generateTwigFileContent(filename) {
  return `{% extends "base.twig" %}

{% block content %}
<p>${filename} page</p>
{% endblock %}

{% block js %}
{% endblock %}

{% block head %}
    <link rel="stylesheet" href="{{ site.theme.link }}/styles/css/${filename}.css"/>
{% endblock %}
`;
}

async function createPages(currentDir, pagesArr) {
  try {
    for (const page of pagesArr) {
      await createAndWriteFile(
        path.join(currentDir, `${page}.php`),
        generatePhpFileContent(page)
      );
      await createAndWriteFile(
        path.join(currentDir, "templates", `${page}.twig`),
        generateTwigFileContent(page)
      );
      await createAndWriteFile(
        path.join(currentDir, "styles", "scss", `${page}.scss`),
        ""
      );
    }
  } catch (error) {
    console.error(error);
  }
}

async function initializeNewTemplate() {
  try {
    const {
      themeFolderName,
      themeName,
      author,
      pages: pagesStr,
    } = await inquirer.prompt([
      {
        message: "What's the name of your template's folder?",
        name: "themeFolderName",
      },
      {
        message: "What's your theme's name?",
        name: "themeName",
      },
      {
        message: "Who is the author?",
        name: "author",
      },
      {
        message: `Give the names of all the pages you want to create separated by space character (" ")\n`,
        name: "pages",
      },
    ]);

    const currentDir = path.join(process.cwd(), themeFolderName);

    //copy starter theme's files
    await copyStarterFiles(currentDir);

    //include themeName and author in main style.css file.
    await createAndWriteFile(
      path.join(currentDir, "style.css"),
      generateMainCssFileContent({ themeName, author })
    );

    //TODO: copy starter template and for each page create .php, .twig, and .scss files
    const pagesArr = pagesStr.trim().split(" ");
    await createPages(currentDir, pagesArr);
  } catch (error) {
    if (error.isTtyError) {
      console.log("Prompt couldn't be rendered in the current environment");
    } else {
      console.error(error);
    }
  }
}

async function addPages() {
  try {
    const { themeFolderName, pages: pagesStr } = await inquirer.prompt([
      {
        message: "What's the name of your template's folder?",
        name: "themeFolderName",
      },
      {
        message: `Give the names of all the pages you want to create separated by space character (" ")\n`,
        name: "pages",
      },
    ]);

    const currentDir = path.join(process.cwd(), themeFolderName);
    // Or `import fs from "fs";` with ESM
    if (!fs.existsSync(currentDir)) {
      console.log(`Folder ${currentDir} does not exist!`);
      console.log(`Make sure you've your template initialized.`);
      return;
    }

    //TODO: copy starter template and for each page create .php, .twig, and .scss files
    const pagesArr = pagesStr.trim().split(" ");
    await createPages(currentDir, pagesArr);
  } catch (error) {
    if (error.isTtyError) {
      console.log("Prompt couldn't be rendered in the current environment");
    } else {
      console.error(error);
    }
  }
}

function closeCli() {
  console.log("Bye!");
  process.exit(0);
}

const actionsToRun = {
  init: initializeNewTemplate,
  add: addPages,
  close: closeCli,
};

inquirer
  .prompt([
    {
      type: "list",
      message: "Which functionality would you like to use now?",
      name: "action",
      choices: [
        { name: "Initialize new project", value: "init" },
        { name: "Add page(s) to existing project", value: "add" },
        { name: "None, close CLI.", value: "close" },
      ],
    },
  ])
  .then(({ action }) => {
    actionsToRun[action]();
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log("Prompt couldn't be rendered in the current environment");
    } else {
      console.error(error);
    }
  });
