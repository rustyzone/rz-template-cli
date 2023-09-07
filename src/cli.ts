#!/usr/bin/env node

import { program } from "commander";
import shell from "shelljs";
import figlet from "figlet";
import { prompt } from "enquirer";
import colors from "colors";
import path from "path";

interface ResponseOpt {
  selectedOption: string;
}

function handleSelectedOption(selectedOption: string, directory: string) {
  // Customize this function to map selected templates to corresponding repository URLs
 
  // Determine the clone directory
  // const cloneDirectory = directory || ".";

  const cloneDirectory = path.resolve(directory || ".");
  
  let repoUrl: string;
  
  switch (selectedOption) {
    case "React, Tailwind":
      repoUrl = "https://github.com/rustyzone/template-vite-react";
    break;
    case "React, Tailwind & Supabase":
        repoUrl = "https://github.com/rustyzone/template-vite-rts";
    break;
      // Add more cases for additional options
    default:
      console.error("Invalid option err msg");
      // exit process with failure
      process.exit(1);
    }
        
  console.log(`Cloning ${repoUrl} into ${cloneDirectory}`);
  // before clone check if directory exists && check repo url is valid
  if (shell.test("-d", cloneDirectory)) {
    console.error("Directory already exists.");
    // chck if directory is empty
    if (shell.ls(cloneDirectory).length > 0) {
      console.error("Directory is not empty.");
      // exit
      console.log("Exit process with failure.");
      process.exit(1);
    }
  }

  // check if repo url is valid
  const isValidRepo = shell.exec(`git ls-remote ${repoUrl}`).code === 0;
  if (!isValidRepo) {
    console.error("Invalid repository URL.");
    // exit
    console.log("Exit process with failure.");
    process.exit(1);
  }

  // Run the Git clone command using ShellJS

  const gitCloneResult = shell.exec(
    `git clone ${repoUrl} ${cloneDirectory}`
  );

  if (gitCloneResult.code !== 0) {
    console.error("Error:", gitCloneResult.stderr);
    // exit
    console.log("Exit process with failure.");
    process.exit(1);
  } else {
    console.log("Clone successful.");

  }

  console.log(`Run ${colors.green(`cd ${directory}`)} to begin working on the project.`);
  // copy command to clipboard
  shell.exec(`echo cd ${directory} | pbcopy`);

  // mention to user to paste command into terminal
  console.log("Paste command into terminal to change directory & then install dependencies.");
}

program
  .version("1.0.0")
  .description("CLI tool for rz-template")
  .option(
    "-t, --template <template>",
    "Select a template to continue (e.g., react, tailwind)"
  )
  .option("-d, --directory <directory>", "Specify a directory to clone into")
  .parse(process.argv);

console.log(figlet.textSync("Rusty Zone Templates CLI"));

async function main() {
  const { template, directory } = program.opts();

  if (!template) {
    console.log("Select a template below by using the arrow keys and pressing enter.");
    // console.error("Please specify a template with the -t or --template flag.");
  } else {
    // Customize this function to map selected templates to corresponding repository URLs
    handleSelectedOption(template, directory);
  }

  if (!template) {
    // If the template is not specified or if the option is provided, show the options.
    await showOptions();
  }
}

async function showOptions() {
  const options = [
    "React, Tailwind",
    "React, Tailwind & Supabase",
    // Add more options as needed
  ];

  const response: ResponseOpt = await prompt({
    type: "select",
    name: "selectedOption",
    message: "Select template:",
    choices: options,
  });

  // if no directory is specified, ask user for directory
  const directory: any = await prompt({
    type: "input",
    name: "directory",
    message:
      "Specify a directory to clone into or press enter to use the current directory:",
  });

  const directoryStr = directory.directory;

  handleSelectedOption(response.selectedOption, directoryStr);
}

main().catch((error) => {
  console.error("Error:", error.message);
});
