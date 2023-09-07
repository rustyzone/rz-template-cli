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
const getRepositoryURL = (selectedTemplate) => {
    return `example-url-for-${selectedTemplate}`;
};
function handleSelectedOption(selectedOption, directory) {
    const repositoryURL = getRepositoryURL(selectedOption);
    const cloneDirectory = directory || ".";
    console.log(`Clone directory: ${shelljs_1.default.pwd()}/${cloneDirectory}`);
    console.log(`Cloning ${repositoryURL} into ${cloneDirectory}...`);
    let repoUrl;
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
        default:
            console.error("Invalid option err msg");
            process.exit(1);
    }
    if (shelljs_1.default.test("-d", cloneDirectory)) {
        console.error("Directory already exists.");
        if (shelljs_1.default.ls(cloneDirectory).length > 0) {
            console.error("Directory is not empty.");
            console.log("Exit process with failure.");
            process.exit(1);
        }
    }
    const isValidRepo = shelljs_1.default.exec(`git ls-remote ${repoUrl}`).code === 0;
    if (!isValidRepo) {
        console.error("Invalid repository URL.");
        console.log("Exit process with failure.");
        process.exit(1);
    }
    const gitCloneResult = shelljs_1.default.exec(`git clone ${repositoryURL} ${cloneDirectory}`);
    if (gitCloneResult.code !== 0) {
        console.error("Error:", gitCloneResult.stderr);
        console.log("Exit process with failure.");
        process.exit(1);
    }
    else {
        console.log("Clone successful.");
    }
    shelljs_1.default.cd(cloneDirectory);
    const installResult = shelljs_1.default.exec("yarn install");
    if (installResult.code !== 0) {
        console.error("Error:", installResult.stderr);
    }
    else {
        console.log("Install successful.");
    }
}
commander_1.program
    .version("1.0.0")
    .description("CLI tool for rz-template")
    .option("-t, --template <template>", "Select a template to continue (e.g., react, tailwind)")
    .option("-d, --directory <directory>", "Specify a directory to clone into")
    .parse(process.argv);
console.log(figlet_1.default.textSync("Rusty Zone Template CLI"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { template, directory } = commander_1.program.opts();
        if (!template) {
            console.error("Please specify a template with the -t or --template flag.");
        }
        else {
            handleSelectedOption(template, directory);
        }
        if (!template) {
            yield showOptions();
        }
    });
}
function showOptions() {
    return __awaiter(this, void 0, void 0, function* () {
        const options = [
            "Option 1",
            "Option 2",
            "Option 3",
        ];
        const response = yield (0, enquirer_1.prompt)({
            type: "select",
            name: "selectedOption",
            message: "Select an option:",
            choices: options,
        });
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