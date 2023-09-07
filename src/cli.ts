import { program } from "commander";
import shell from "shelljs";
import figlet from "figlet";
import { prompt } from "enquirer";

interface ResponseOpt {
  selectedOption: string;
}

const getRepositoryURL = (selectedTemplate: string): string => {
  // Customize this function to map selected templates to repository URLs
  // Return the appropriate URL based on the user's selection.
  return `example-url-for-${selectedTemplate}`;
};

function handleSelectedOption(selectedOption: string, directory: string) {
  // Customize this function to map selected templates to corresponding repository URLs
  const repositoryURL = getRepositoryURL(selectedOption);

  // Determine the clone directory
  const cloneDirectory = directory || ".";

  // log path to the clone directory wuth full path and cwd
  console.log(`Clone directory: ${shell.pwd()}/${cloneDirectory}`);

  console.log(`Cloning ${repositoryURL} into ${cloneDirectory}...`);

  let repoUrl: string;

  switch (selectedOption) {
    case "Option 1":
      console.log("You selected Option 1.");
      repoUrl = "https://github.com/rustyzone/rz-template-react.git";
      break;
    case "Option 2":
      console.log("You selected Option 2.");
      repoUrl = "https://github.com/rustyzone/rz-template-tailwind.git";
      break;
    case "Option 3":
      console.log("You selected Option 3.");
      repoUrl = "https://github.com/rustyzone/rz-template-tailwind.git";
      break;
    // Add more cases for additional options
    default:
      console.error("Invalid option err msg");
      // exit process with failure
      process.exit(1);
  }

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
    `git clone ${repositoryURL} ${cloneDirectory}`
  );

  if (gitCloneResult.code !== 0) {
    console.error("Error:", gitCloneResult.stderr);
    // exit
    console.log("Exit process with failure.");
    process.exit(1);
  } else {
    console.log("Clone successful.");
  }

  // cd into the clone directory and run yarn install / npm install
  // ask for project name and update package.json and manifest.json
  shell.cd(cloneDirectory);

  // Run yarn install or npm install
  const installResult = shell.exec("yarn install");
  if (installResult.code !== 0) {
    console.error("Error:", installResult.stderr);
  } else {
    console.log("Install successful.");
  }
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

console.log(figlet.textSync("Rusty Zone Template CLI"));

async function main() {
  const { template, directory } = program.opts();

  if (!template) {
    console.error("Please specify a template with the -t or --template flag.");
  } else {
    // Customize this function to map selected templates to corresponding repository URLs
    handleSelectedOption(template, directory);
  }

  if (!template) {
    // || program.option) {
    // If the template is not specified or if the option is provided, show the options.
    await showOptions();
  }
}

async function showOptions() {
  const options = [
    "Option 1",
    "Option 2",
    "Option 3",
    // Add more options as needed
  ];

  const response: ResponseOpt = await prompt({
    type: "select",
    name: "selectedOption",
    message: "Select an option:",
    choices: options,
  });

  // Customize this function to map selected options to corresponding actions

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
