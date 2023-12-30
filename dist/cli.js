#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const shelljs_1 = __importDefault(require("shelljs"));
const figlet_1 = __importDefault(require("figlet"));
const enquirer_1 = require("enquirer");
const colors_1 = __importDefault(require("colors"));
const path_1 = __importDefault(require("path"));
const { version } = require("../package.json");
function handleSelectedOption(selectedOption, directory) {
    // Customize this function to map selected templates to corresponding repository URLs
    // Determine the clone directory
    // const cloneDirectory = directory || ".";
    const cloneDirectory = path_1.default.resolve(directory || ".");
    let repoUrl;
    switch (selectedOption) {
        case "Vite with Content":
            repoUrl = "https://github.com/rustyzone/template-vite-react";
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
    if (shelljs_1.default.test("-d", cloneDirectory)) {
        console.error("Directory already exists.");
        // chck if directory is empty
        if (shelljs_1.default.ls(cloneDirectory).length > 0) {
            console.error("Directory is not empty.");
            // exit
            console.log("Exit process with failure.");
            process.exit(1);
        }
    }
    // check if repo url is valid
    const isValidRepo = shelljs_1.default.exec(`git ls-remote ${repoUrl}`).code === 0;
    if (!isValidRepo) {
        console.error("Invalid repository URL.");
        // exit
        console.log("Exit process with failure.");
        process.exit(1);
    }
    // Run the Git clone command using ShellJS
    const gitCloneResult = shelljs_1.default.exec(`git clone ${repoUrl} ${cloneDirectory}`);
    if (gitCloneResult.code !== 0) {
        console.error("Error:", gitCloneResult.stderr);
        // exit
        console.log("Exit process with failure.");
        process.exit(1);
    }
    else {
        console.log("Clone successful.");
    }
    if (selectedOption === "Vite with Content") {
        // remove pages folder from vite with content template
        shelljs_1.default.rm("-rf", `${cloneDirectory}/src/pages`);
        shelljs_1.default.rm("-rf", `${cloneDirectory}/src/Onboarding.tsx`);
        shelljs_1.default.rm("-rf", `${cloneDirectory}/src/Onboarding-main.tsx`);
        console.log("Template adjustment successful.");
        // TODO: change this when changes are made to the template
        // remove "input: { onboarding: `src/pages/onboarding/index.html` }," from vite.config.js
        shelljs_1.default.sed("-i", "input: { onboarding: `src/pages/onboarding/index.html` },", "", `${cloneDirectory}/vite.config.js`);
        // replace line  "        "src/pages/onboarding/index.html"," from manifest.json
        shelljs_1.default.sed("-i", `"src/pages/onboarding/index.html",`, "", `${cloneDirectory}/manifest.json`);
        console.log("Manifest adjustments successful.");
    }
    console.log(`Run ${colors_1.default.green(`cd ${directory}`)} to begin working on the project.`);
    // copy command to clipboard
    shelljs_1.default.exec(`echo cd ${directory} | pbcopy`);
    // mention to user to paste command into terminal
    console.log("Paste command into terminal to change directory & then install dependencies.");
}
commander_1.program
    .version(version)
    .description("CLI tool for rz-template")
    .option("-t, --template <template>", "Select a template to continue (e.g., react, tailwind)")
    .option("-d, --directory <directory>", "Specify a directory to clone into")
    .parse(process.argv);
console.log(figlet_1.default.textSync("Rusty Zone Templates CLI"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { template, directory } = commander_1.program.opts();
        if (!template) {
            console.log("Select a template below by using the arrow keys and pressing enter.");
            // console.error("Please specify a template with the -t or --template flag.");
        }
        else {
            // Customize this function to map selected templates to corresponding repository URLs
            handleSelectedOption(template, directory);
        }
        if (!template) {
            // If the template is not specified or if the option is provided, show the options.
            yield showOptions();
        }
    });
}
function showOptions() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = [
            "Vite with Content",
            "React, Tailwind",
            "React, Tailwind & Supabase",
            // Add more options as needed
        ];
        const response = yield (0, enquirer_1.prompt)({
            type: "select",
            name: "selectedOption",
            message: "Select template:",
            choices: options,
        });
        // if no directory is specified, ask user for directory
        const directory = yield (0, enquirer_1.prompt)({
            type: "input",
            name: "directory",
            message: "Specify a directory to clone into or press enter to use the current directory:",
        });
        const directoryStr = directory.directory;
        handleSelectedOption(response.selectedOption, directoryStr);
    });
}
main().catch((error) => {
    console.error("Error:", error.message);
});
//# sourceMappingURL=cli.js.map