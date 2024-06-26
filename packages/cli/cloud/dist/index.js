"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const crypto$1 = require("crypto");
const fse = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const axios = require("axios");
const crypto = require("node:crypto");
const utils = require("@strapi/utils");
const fs = require("fs");
const tar = require("tar");
const minimatch = require("minimatch");
const inquirer = require("inquirer");
const fp = require("lodash/fp");
const os = require("os");
const XDGAppPaths = require("xdg-app-paths");
const jwksClient = require("jwks-rsa");
const jwt = require("jsonwebtoken");
const stringify = require("fast-safe-stringify");
const ora = require("ora");
const cliProgress = require("cli-progress");
const EventSource = require("eventsource");
const fs$1 = require("fs/promises");
const pkgUp = require("pkg-up");
const yup = require("yup");
const _interopDefault = (e) => e && e.__esModule ? e : { default: e };
function _interopNamespace(e) {
  if (e && e.__esModule)
    return e;
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const crypto__default = /* @__PURE__ */ _interopDefault(crypto$1);
const fse__default = /* @__PURE__ */ _interopDefault(fse);
const path__namespace = /* @__PURE__ */ _interopNamespace(path);
const chalk__default = /* @__PURE__ */ _interopDefault(chalk);
const axios__default = /* @__PURE__ */ _interopDefault(axios);
const crypto__namespace = /* @__PURE__ */ _interopNamespace(crypto);
const fs__namespace = /* @__PURE__ */ _interopNamespace(fs);
const tar__namespace = /* @__PURE__ */ _interopNamespace(tar);
const inquirer__default = /* @__PURE__ */ _interopDefault(inquirer);
const os__default = /* @__PURE__ */ _interopDefault(os);
const XDGAppPaths__default = /* @__PURE__ */ _interopDefault(XDGAppPaths);
const jwksClient__default = /* @__PURE__ */ _interopDefault(jwksClient);
const jwt__default = /* @__PURE__ */ _interopDefault(jwt);
const stringify__default = /* @__PURE__ */ _interopDefault(stringify);
const ora__default = /* @__PURE__ */ _interopDefault(ora);
const cliProgress__namespace = /* @__PURE__ */ _interopNamespace(cliProgress);
const EventSource__default = /* @__PURE__ */ _interopDefault(EventSource);
const fs__default = /* @__PURE__ */ _interopDefault(fs$1);
const pkgUp__default = /* @__PURE__ */ _interopDefault(pkgUp);
const yup__namespace = /* @__PURE__ */ _interopNamespace(yup);
const apiConfig = {
  apiBaseUrl: utils.env("STRAPI_CLI_CLOUD_API", "https://cloud-cli-api.strapi.io"),
  dashboardBaseUrl: utils.env("STRAPI_CLI_CLOUD_DASHBOARD", "https://cloud.strapi.io")
};
const IGNORED_PATTERNS = [
  "**/.git/**",
  "**/node_modules/**",
  "**/build/**",
  "**/dist/**",
  "**/.cache/**",
  "**/.circleci/**",
  "**/.github/**",
  "**/.gitignore",
  "**/.gitkeep",
  "**/.gitlab-ci.yml",
  "**/.idea/**",
  "**/.vscode/**"
];
const getFiles = (dirPath, ignorePatterns = [], arrayOfFiles = [], subfolder = "") => {
  const entries = fs__namespace.readdirSync(path__namespace.join(dirPath, subfolder));
  entries.forEach((entry) => {
    const entryPathFromRoot = path__namespace.join(subfolder, entry);
    const entryPath = path__namespace.relative(dirPath, entryPathFromRoot);
    const isIgnored = isIgnoredFile(dirPath, entryPathFromRoot, ignorePatterns);
    if (isIgnored) {
      return;
    }
    if (fs__namespace.statSync(entryPath).isDirectory()) {
      getFiles(dirPath, ignorePatterns, arrayOfFiles, entryPathFromRoot);
    } else {
      arrayOfFiles.push(entryPath);
    }
  });
  return arrayOfFiles;
};
const isIgnoredFile = (folderPath, file, ignorePatterns) => {
  ignorePatterns.push(...IGNORED_PATTERNS);
  const relativeFilePath = path__namespace.join(folderPath, file);
  let isIgnored = false;
  for (const pattern of ignorePatterns) {
    if (pattern.startsWith("!")) {
      if (minimatch.minimatch(relativeFilePath, pattern.slice(1), { matchBase: true, dot: true })) {
        return false;
      }
    } else if (minimatch.minimatch(relativeFilePath, pattern, { matchBase: true, dot: true })) {
      if (path__namespace.basename(file) !== ".gitkeep") {
        isIgnored = true;
      }
    }
  }
  return isIgnored;
};
const readGitignore = (folderPath) => {
  const gitignorePath = path__namespace.resolve(folderPath, ".gitignore");
  if (!fs__namespace.existsSync(gitignorePath))
    return [];
  const gitignoreContent = fs__namespace.readFileSync(gitignorePath, "utf8");
  return gitignoreContent.split(/\r?\n/).filter((line) => Boolean(line.trim()) && !line.startsWith("#"));
};
const compressFilesToTar = async (storagePath, folderToCompress, filename) => {
  const ignorePatterns = readGitignore(folderToCompress);
  const filesToCompress = getFiles(folderToCompress, ignorePatterns);
  return tar__namespace.c(
    {
      gzip: true,
      file: path__namespace.resolve(storagePath, filename)
    },
    filesToCompress
  );
};
const APP_FOLDER_NAME = "com.strapi.cli";
const CONFIG_FILENAME = "config.json";
async function checkDirectoryExists(directoryPath) {
  try {
    const fsStat = await fse__default.default.lstat(directoryPath);
    return fsStat.isDirectory();
  } catch (e) {
    return false;
  }
}
async function getTmpStoragePath() {
  const storagePath = path__namespace.default.join(os__default.default.tmpdir(), APP_FOLDER_NAME);
  await fse__default.default.ensureDir(storagePath);
  return storagePath;
}
async function getConfigPath() {
  const configDirs = XDGAppPaths__default.default(APP_FOLDER_NAME).configDirs();
  const configPath = configDirs.find(checkDirectoryExists);
  if (!configPath) {
    await fse__default.default.ensureDir(configDirs[0]);
    return configDirs[0];
  }
  return configPath;
}
async function getLocalConfig() {
  const configPath = await getConfigPath();
  const configFilePath = path__namespace.default.join(configPath, CONFIG_FILENAME);
  await fse__default.default.ensureFile(configFilePath);
  try {
    return await fse__default.default.readJSON(configFilePath, { encoding: "utf8", throws: true });
  } catch (e) {
    return {};
  }
}
async function saveLocalConfig(data) {
  const configPath = await getConfigPath();
  const configFilePath = path__namespace.default.join(configPath, CONFIG_FILENAME);
  await fse__default.default.writeJson(configFilePath, data, { encoding: "utf8", spaces: 2, mode: 384 });
}
const name = "@strapi/cloud-cli";
const version = "4.25.0";
const description = "Commands to interact with the Strapi Cloud";
const keywords = [
  "strapi",
  "cloud",
  "cli"
];
const homepage = "https://strapi.io";
const bugs = {
  url: "https://github.com/strapi/strapi/issues"
};
const repository = {
  type: "git",
  url: "git://github.com/strapi/strapi.git"
};
const license = "SEE LICENSE IN LICENSE";
const author = {
  name: "Strapi Solutions SAS",
  email: "hi@strapi.io",
  url: "https://strapi.io"
};
const maintainers = [
  {
    name: "Strapi Solutions SAS",
    email: "hi@strapi.io",
    url: "https://strapi.io"
  }
];
const main = "./dist/index.js";
const module$1 = "./dist/index.mjs";
const source = "./src/index.ts";
const types = "./dist/src/index.d.ts";
const bin = "./bin/index.js";
const files = [
  "./dist",
  "./bin"
];
const scripts = {
  build: "pack-up build",
  clean: "run -T rimraf ./dist",
  lint: "run -T eslint .",
  watch: "pack-up watch"
};
const dependencies = {
  "@strapi/utils": "4.25.0",
  axios: "1.6.0",
  chalk: "4.1.2",
  "cli-progress": "3.12.0",
  commander: "8.3.0",
  eventsource: "2.0.2",
  "fast-safe-stringify": "2.1.1",
  "fs-extra": "10.0.0",
  inquirer: "8.2.5",
  jsonwebtoken: "9.0.0",
  "jwks-rsa": "3.1.0",
  lodash: "4.17.21",
  minimatch: "9.0.3",
  open: "8.4.0",
  ora: "5.4.1",
  "pkg-up": "3.1.0",
  tar: "6.1.13",
  "xdg-app-paths": "8.3.0",
  yup: "0.32.9"
};
const devDependencies = {
  "@strapi/pack-up": "4.23.0",
  "@types/cli-progress": "3.11.5",
  "@types/eventsource": "1.1.15",
  "@types/lodash": "^4.14.191",
  "eslint-config-custom": "4.25.0",
  tsconfig: "4.25.0"
};
const engines = {
  node: ">=18.0.0 <=20.x.x",
  npm: ">=6.0.0"
};
const packageJson = {
  name,
  version,
  description,
  keywords,
  homepage,
  bugs,
  repository,
  license,
  author,
  maintainers,
  main,
  module: module$1,
  source,
  types,
  bin,
  files,
  scripts,
  dependencies,
  devDependencies,
  engines
};
const VERSION = "v1";
async function cloudApiFactory(token) {
  const localConfig = await getLocalConfig();
  const customHeaders = {
    "x-device-id": localConfig.deviceId,
    "x-app-version": packageJson.version,
    "x-os-name": os__default.default.type(),
    "x-os-version": os__default.default.version(),
    "x-language": Intl.DateTimeFormat().resolvedOptions().locale,
    "x-node-version": process.versions.node
  };
  const axiosCloudAPI = axios__default.default.create({
    baseURL: `${apiConfig.apiBaseUrl}/${VERSION}`,
    headers: {
      "Content-Type": "application/json",
      ...customHeaders
    }
  });
  if (token) {
    axiosCloudAPI.defaults.headers.Authorization = `Bearer ${token}`;
  }
  return {
    deploy({ filePath, project }, { onUploadProgress }) {
      return axiosCloudAPI.post(
        `/deploy/${project.name}`,
        { file: fse__default.default.createReadStream(filePath) },
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
          onUploadProgress
        }
      );
    },
    async createProject({ name: name2, nodeVersion, region, plan }) {
      const response = await axiosCloudAPI.post("/project", {
        projectName: name2,
        region,
        nodeVersion,
        plan
      });
      return {
        data: {
          id: response.data.id,
          name: response.data.name,
          nodeVersion: response.data.nodeVersion,
          region: response.data.region
        },
        status: response.status
      };
    },
    getUserInfo() {
      return axiosCloudAPI.get("/user");
    },
    config() {
      return axiosCloudAPI.get("/config");
    },
    listProjects() {
      return axiosCloudAPI.get("/projects");
    },
    track(event, payload = {}) {
      return axiosCloudAPI.post("/track", {
        event,
        payload
      });
    }
  };
}
const LOCAL_SAVE_FILENAME = ".strapi-cloud.json";
async function save(data, { directoryPath } = {}) {
  const alreadyInFileData = await retrieve({ directoryPath });
  const storedData = { ...alreadyInFileData, ...data };
  const pathToFile = path__namespace.default.join(directoryPath || process.cwd(), LOCAL_SAVE_FILENAME);
  await fse__default.default.ensureDir(path__namespace.default.dirname(pathToFile));
  await fse__default.default.writeJson(pathToFile, storedData, { encoding: "utf8" });
}
async function retrieve({
  directoryPath
} = {}) {
  const pathToFile = path__namespace.default.join(directoryPath || process.cwd(), LOCAL_SAVE_FILENAME);
  const pathExists = await fse__default.default.pathExists(pathToFile);
  if (!pathExists) {
    return {};
  }
  return fse__default.default.readJSON(pathToFile, { encoding: "utf8" });
}
const strapiInfoSave = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  LOCAL_SAVE_FILENAME,
  retrieve,
  save
}, Symbol.toStringTag, { value: "Module" }));
let cliConfig;
async function tokenServiceFactory({ logger }) {
  const cloudApiService = await cloudApiFactory();
  async function saveToken(str) {
    const appConfig = await getLocalConfig();
    if (!appConfig) {
      logger.error("There was a problem saving your token. Please try again.");
      return;
    }
    appConfig.token = str;
    try {
      await saveLocalConfig(appConfig);
    } catch (e) {
      logger.debug(e);
      logger.error("There was a problem saving your token. Please try again.");
    }
  }
  async function retrieveToken() {
    const appConfig = await getLocalConfig();
    if (appConfig.token) {
      if (await isTokenValid(appConfig.token)) {
        return appConfig.token;
      }
    }
    return void 0;
  }
  async function validateToken(idToken, jwksUrl) {
    const client = jwksClient__default.default({
      jwksUri: jwksUrl
    });
    const getKey = (header, callback) => {
      client.getSigningKey(header.kid, (e, key) => {
        if (e) {
          callback(e);
        } else if (key) {
          const publicKey = "publicKey" in key ? key.publicKey : key.rsaPublicKey;
          callback(null, publicKey);
        } else {
          callback(new Error("Key not found"));
        }
      });
    };
    const decodedToken = jwt__default.default.decode(idToken, { complete: true });
    if (!decodedToken) {
      if (typeof idToken === "undefined" || idToken === "") {
        logger.warn("You need to be logged in to use this feature. Please log in and try again.");
      } else {
        logger.error(
          "There seems to be a problem with your login information. Please try logging in again."
        );
      }
    }
    return new Promise((resolve, reject) => {
      jwt__default.default.verify(idToken, getKey, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  async function isTokenValid(token) {
    try {
      const config = await cloudApiService.config();
      cliConfig = config.data;
      if (token) {
        await validateToken(token, cliConfig.jwksUrl);
        return true;
      }
      return false;
    } catch (e) {
      logger.debug(e);
      return false;
    }
  }
  async function eraseToken() {
    const appConfig = await getLocalConfig();
    if (!appConfig) {
      return;
    }
    delete appConfig.token;
    try {
      await saveLocalConfig(appConfig);
    } catch (e) {
      logger.debug(e);
      logger.error(
        "There was an issue removing your login information. Please try logging out again."
      );
      throw e;
    }
  }
  async function getValidToken() {
    const token = await retrieveToken();
    if (!token) {
      logger.log("No token found. Please login first.");
      return null;
    }
    if (!await isTokenValid(token)) {
      logger.log("Unable to proceed: Token is expired or not valid. Please login again.");
      return null;
    }
    return token;
  }
  return {
    saveToken,
    retrieveToken,
    validateToken,
    isTokenValid,
    eraseToken,
    getValidToken
  };
}
const stringifyArg = (arg) => {
  return typeof arg === "object" ? stringify__default.default(arg) : arg;
};
const createLogger = (options = {}) => {
  const { silent = false, debug = false, timestamp = true } = options;
  const state = { errors: 0, warning: 0 };
  return {
    get warnings() {
      return state.warning;
    },
    get errors() {
      return state.errors;
    },
    async debug(...args) {
      if (silent || !debug) {
        return;
      }
      console.log(
        chalk__default.default.cyan(`[DEBUG]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    info(...args) {
      if (silent) {
        return;
      }
      console.info(
        chalk__default.default.blue(`[INFO]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    log(...args) {
      if (silent) {
        return;
      }
      console.info(
        chalk__default.default.blue(`${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    success(...args) {
      if (silent) {
        return;
      }
      console.info(
        chalk__default.default.green(`[SUCCESS]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    warn(...args) {
      state.warning += 1;
      if (silent) {
        return;
      }
      console.warn(
        chalk__default.default.yellow(`[WARN]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    error(...args) {
      state.errors += 1;
      if (silent) {
        return;
      }
      console.error(
        chalk__default.default.red(`[ERROR]${timestamp ? `	[${(/* @__PURE__ */ new Date()).toISOString()}]` : ""}`),
        ...args.map(stringifyArg)
      );
    },
    // @ts-expect-error – returning a subpart of ora is fine because the types tell us what is what.
    spinner(text) {
      if (silent) {
        return {
          succeed() {
            return this;
          },
          fail() {
            return this;
          },
          start() {
            return this;
          },
          text: "",
          isSpinning: false
        };
      }
      return ora__default.default(text);
    },
    progressBar(totalSize, text) {
      if (silent) {
        return {
          start() {
            return this;
          },
          stop() {
            return this;
          },
          update() {
            return this;
          }
        };
      }
      const progressBar = new cliProgress__namespace.SingleBar({
        format: `${text ? `${text} |` : ""}${chalk__default.default.green("{bar}")}| {percentage}%`,
        barCompleteChar: "█",
        barIncompleteChar: "░",
        hideCursor: true,
        forceRedraw: true
      });
      progressBar.start(totalSize, 0);
      return progressBar;
    }
  };
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cloudApiFactory,
  createLogger,
  local: strapiInfoSave,
  tokenServiceFactory
}, Symbol.toStringTag, { value: "Module" }));
async function handleError(ctx, error) {
  const tokenService = await tokenServiceFactory(ctx);
  const { logger } = ctx;
  logger.debug(error);
  if (error instanceof axios.AxiosError) {
    const errorMessage = typeof error.response?.data === "string" ? error.response.data : null;
    switch (error.response?.status) {
      case 401:
        logger.error("Your session has expired. Please log in again.");
        await tokenService.eraseToken();
        return;
      case 403:
        logger.error(
          errorMessage || "You do not have permission to create a project. Please contact support for assistance."
        );
        return;
      case 400:
        logger.error(errorMessage || "Invalid input. Please check your inputs and try again.");
        return;
      case 503:
        logger.error(
          "Strapi Cloud project creation is currently unavailable. Please try again later."
        );
        return;
      default:
        if (errorMessage) {
          logger.error(errorMessage);
          return;
        }
        break;
    }
  }
  logger.error(
    "We encountered an issue while creating your project. Please try again in a moment. If the problem persists, contact support for assistance."
  );
}
const action$3 = async (ctx) => {
  const { logger } = ctx;
  const { getValidToken } = await tokenServiceFactory(ctx);
  const token = await getValidToken();
  if (!token) {
    return;
  }
  const cloudApi = await cloudApiFactory(token);
  const { data: config } = await cloudApi.config();
  const { questions, defaults: defaultValues } = config.projectCreation;
  const projectAnswersDefaulted = fp.defaults(defaultValues);
  const projectAnswers = await inquirer__default.default.prompt(questions);
  const projectInput = projectAnswersDefaulted(projectAnswers);
  const spinner = logger.spinner("Setting up your project...").start();
  try {
    const { data } = await cloudApi.createProject(projectInput);
    await save({ project: data });
    spinner.succeed("Project created successfully!");
    return data;
  } catch (e) {
    spinner.fail("Failed to create project on Strapi Cloud.");
    await handleError(ctx, e);
  }
};
function notificationServiceFactory({ logger }) {
  return (url, token, cliConfig2) => {
    const CONN_TIMEOUT = Number(cliConfig2.notificationsConnectionTimeout);
    const es = new EventSource__default.default(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    let timeoutId;
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        logger.log(
          "We were unable to connect to the server at this time. This could be due to a temporary issue. Please try again in a moment."
        );
        es.close();
      }, CONN_TIMEOUT);
    };
    es.onopen = resetTimeout;
    es.onmessage = (event) => {
      resetTimeout();
      const data = JSON.parse(event.data);
      if (data.message) {
        logger.log(data.message);
      }
      if (data.event === "deploymentFinished" || data.event === "deploymentFailed") {
        es.close();
      }
    };
  };
}
yup__namespace.object({
  name: yup__namespace.string().required(),
  exports: yup__namespace.lazy(
    (value) => yup__namespace.object(
      typeof value === "object" ? Object.entries(value).reduce((acc, [key, value2]) => {
        if (typeof value2 === "object") {
          acc[key] = yup__namespace.object({
            types: yup__namespace.string().optional(),
            source: yup__namespace.string().required(),
            module: yup__namespace.string().optional(),
            import: yup__namespace.string().required(),
            require: yup__namespace.string().required(),
            default: yup__namespace.string().required()
          }).noUnknown(true);
        } else {
          acc[key] = yup__namespace.string().matches(/^\.\/.*\.json$/).required();
        }
        return acc;
      }, {}) : void 0
    ).optional()
  )
});
const loadPkg = async ({ cwd, logger }) => {
  const pkgPath = await pkgUp__default.default({ cwd });
  if (!pkgPath) {
    throw new Error("Could not find a package.json in the current directory");
  }
  const buffer = await fs__default.default.readFile(pkgPath);
  const pkg = JSON.parse(buffer.toString());
  logger.debug("Loaded package.json:", os__default.default.EOL, pkg);
  return pkg;
};
const buildLogsServiceFactory = ({ logger }) => {
  return async (url, token, cliConfig2) => {
    const CONN_TIMEOUT = Number(cliConfig2.buildLogsConnectionTimeout);
    const MAX_RETRIES = Number(cliConfig2.buildLogsMaxRetries);
    return new Promise((resolve, reject) => {
      let timeoutId = null;
      let retries = 0;
      const connect = (url2) => {
        const spinner = logger.spinner("Connecting to server to get build logs");
        spinner.start();
        const es = new EventSource__default.default(`${url2}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const clearExistingTimeout = () => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
        };
        const resetTimeout = () => {
          clearExistingTimeout();
          timeoutId = setTimeout(() => {
            if (spinner.isSpinning) {
              spinner.fail(
                "We were unable to connect to the server to get build logs at this time. This could be due to a temporary issue."
              );
            }
            es.close();
            reject(new Error("Connection timed out"));
          }, CONN_TIMEOUT);
        };
        es.onopen = resetTimeout;
        es.addEventListener("finished", (event) => {
          const data = JSON.parse(event.data);
          logger.log(data.msg);
          es.close();
          clearExistingTimeout();
          resolve(null);
        });
        es.addEventListener("log", (event) => {
          if (spinner.isSpinning) {
            spinner.succeed();
          }
          resetTimeout();
          const data = JSON.parse(event.data);
          logger.log(data.msg);
        });
        es.onerror = async () => {
          retries += 1;
          if (retries > MAX_RETRIES) {
            spinner.fail("We were unable to connect to the server to get build logs at this time.");
            es.close();
            reject(new Error("Max retries reached"));
          }
        };
      };
      connect(url);
    });
  };
};
async function upload(ctx, project, token, maxProjectFileSize) {
  const cloudApi = await cloudApiFactory(token);
  try {
    const storagePath = await getTmpStoragePath();
    const projectFolder = path__namespace.default.resolve(process.cwd());
    const packageJson2 = await loadPkg(ctx);
    if (!packageJson2) {
      ctx.logger.error(
        "Unable to deploy the project. Please make sure the package.json file is correctly formatted."
      );
      return;
    }
    ctx.logger.log("📦 Compressing project...");
    const hashname = crypto__namespace.createHash("sha512").update(packageJson2.name).digest("hex");
    const compressedFilename = `${hashname}.tar.gz`;
    try {
      ctx.logger.debug(
        "Compression parameters\n",
        `Storage path: ${storagePath}
`,
        `Project folder: ${projectFolder}
`,
        `Compressed filename: ${compressedFilename}`
      );
      await compressFilesToTar(storagePath, projectFolder, compressedFilename);
      ctx.logger.log("📦 Project compressed successfully!");
    } catch (e) {
      ctx.logger.error(
        "⚠️ Project compression failed. Try again later or check for large/incompatible files."
      );
      ctx.logger.debug(e);
      process.exit(1);
    }
    const tarFilePath = path__namespace.default.resolve(storagePath, compressedFilename);
    const fileStats = await fse__default.default.stat(tarFilePath);
    if (fileStats.size > maxProjectFileSize) {
      ctx.logger.log(
        "Unable to proceed: Your project is too big to be transferred, please use a git repo instead."
      );
      try {
        await fse__default.default.remove(tarFilePath);
      } catch (e) {
        ctx.logger.log("Unable to remove file: ", tarFilePath);
        ctx.logger.debug(e);
      }
      return;
    }
    ctx.logger.info("🚀 Uploading project...");
    const progressBar = ctx.logger.progressBar(100, "Upload Progress");
    try {
      const { data } = await cloudApi.deploy(
        { filePath: tarFilePath, project },
        {
          onUploadProgress(progressEvent) {
            const total = progressEvent.total || fileStats.size;
            const percentage = Math.round(progressEvent.loaded * 100 / total);
            progressBar.update(percentage);
          }
        }
      );
      progressBar.update(100);
      progressBar.stop();
      ctx.logger.success("✨ Upload finished!");
      return data.build_id;
    } catch (e) {
      progressBar.stop();
      if (e instanceof axios.AxiosError && e.response?.data) {
        if (e.response.status === 404) {
          ctx.logger.error(
            `The project does not exist. Remove the ${LOCAL_SAVE_FILENAME} file and try again.`
          );
        } else {
          ctx.logger.error(e.response.data);
        }
      } else {
        ctx.logger.error("An error occurred while deploying the project. Please try again later.");
      }
      ctx.logger.debug(e);
    } finally {
      await fse__default.default.remove(tarFilePath);
    }
    process.exit(0);
  } catch (e) {
    ctx.logger.error("An error occurred while deploying the project. Please try again later.");
    ctx.logger.debug(e);
    process.exit(1);
  }
}
async function getProject(ctx) {
  const { project } = await retrieve();
  if (!project) {
    try {
      return await action$3(ctx);
    } catch (e) {
      ctx.logger.error("An error occurred while deploying the project. Please try again later.");
      ctx.logger.debug(e);
      process.exit(1);
    }
  }
  return project;
}
const action$2 = async (ctx) => {
  const { getValidToken } = await tokenServiceFactory(ctx);
  const cloudApiService = await cloudApiFactory();
  const token = await getValidToken();
  if (!token) {
    return;
  }
  const project = await getProject(ctx);
  if (!project) {
    return;
  }
  try {
    await cloudApiService.track("willDeployWithCLI", { projectInternalName: project.name });
  } catch (e) {
    ctx.logger.debug("Failed to track willDeploy", e);
  }
  const notificationService = notificationServiceFactory(ctx);
  const buildLogsService = buildLogsServiceFactory(ctx);
  const { data: cliConfig2 } = await cloudApiService.config();
  let maxSize = parseInt(cliConfig2.maxProjectFileSize, 10);
  if (Number.isNaN(maxSize)) {
    ctx.logger.debug(
      "An error occurred while parsing the maxProjectFileSize. Using default value."
    );
    maxSize = 1e8;
  }
  const buildId = await upload(ctx, project, token, maxSize);
  if (!buildId) {
    return;
  }
  try {
    notificationService(`${apiConfig.apiBaseUrl}/notifications`, token, cliConfig2);
    await buildLogsService(`${apiConfig.apiBaseUrl}/v1/logs/${buildId}`, token, cliConfig2);
    ctx.logger.log(
      "Visit the following URL for deployment logs. Your deployment will be available here shortly."
    );
    ctx.logger.log(
      chalk__default.default.underline(`${apiConfig.dashboardBaseUrl}/projects/${project.name}/deployments`)
    );
  } catch (e) {
    if (e instanceof Error) {
      ctx.logger.error(e.message);
    } else {
      throw e;
    }
  }
};
const assertCwdContainsStrapiProject = (name2) => {
  const logErrorAndExit = () => {
    console.log(
      `You need to run ${chalk__default.default.yellow(
        `strapi ${name2}`
      )} in a Strapi project. Make sure you are in the right directory.`
    );
    process.exit(1);
  };
  try {
    const pkgJSON = require(`${process.cwd()}/package.json`);
    if (!fp.has("dependencies.@strapi/strapi", pkgJSON) && !fp.has("devDependencies.@strapi/strapi", pkgJSON)) {
      logErrorAndExit();
    }
  } catch (err) {
    logErrorAndExit();
  }
};
const runAction = (name2, action2) => (...args) => {
  assertCwdContainsStrapiProject(name2);
  Promise.resolve().then(() => {
    return action2(...args);
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
};
const command$3 = ({ command: command2, ctx }) => {
  command2.command("cloud:deploy").alias("deploy").description("Deploy a Strapi Cloud project").option("-d, --debug", "Enable debugging mode with verbose logs").option("-s, --silent", "Don't log anything").action(() => runAction("deploy", action$2)(ctx));
};
const deployProject = {
  name: "deploy-project",
  description: "Deploy a Strapi Cloud project",
  action: action$2,
  command: command$3
};
const openModule = import("open");
const action$1 = async (ctx) => {
  const { logger } = ctx;
  const tokenService = await tokenServiceFactory(ctx);
  const existingToken = await tokenService.retrieveToken();
  const cloudApiService = await cloudApiFactory(existingToken || void 0);
  const trackFailedLogin = async () => {
    try {
      await cloudApiService.track("didNotLogin", { loginMethod: "cli" });
    } catch (e) {
      logger.debug("Failed to track failed login", e);
    }
  };
  if (existingToken) {
    const isTokenValid = await tokenService.isTokenValid(existingToken);
    if (isTokenValid) {
      try {
        const userInfo = await cloudApiService.getUserInfo();
        const { email } = userInfo.data.data;
        if (email) {
          logger.log(`You are already logged into your account (${email}).`);
        } else {
          logger.log("You are already logged in.");
        }
        logger.log(
          "To access your dashboard, please copy and paste the following URL into your web browser:"
        );
        logger.log(chalk__default.default.underline(`${apiConfig.dashboardBaseUrl}/projects`));
        return true;
      } catch (e) {
        logger.debug("Failed to fetch user info", e);
      }
    }
  }
  let cliConfig2;
  try {
    logger.info("🔌 Connecting to the Strapi Cloud API...");
    const config = await cloudApiService.config();
    cliConfig2 = config.data;
  } catch (e) {
    logger.error("🥲 Oops! Something went wrong while logging you in. Please try again.");
    logger.debug(e);
    return false;
  }
  try {
    await cloudApiService.track("willLoginAttempt", {});
  } catch (e) {
    logger.debug("Failed to track login attempt", e);
  }
  logger.debug("🔐 Creating device authentication request...", {
    client_id: cliConfig2.clientId,
    scope: cliConfig2.scope,
    audience: cliConfig2.audience
  });
  const deviceAuthResponse = await axios__default.default.post(cliConfig2.deviceCodeAuthUrl, {
    client_id: cliConfig2.clientId,
    scope: cliConfig2.scope,
    audience: cliConfig2.audience
  }).catch((e) => {
    logger.error("There was an issue with the authentication process. Please try again.");
    if (e.message) {
      logger.debug(e.message, e);
    } else {
      logger.debug(e);
    }
  });
  openModule.then((open) => {
    open.default(deviceAuthResponse.data.verification_uri_complete).catch((e) => {
      logger.error("We encountered an issue opening the browser. Please try again later.");
      logger.debug(e.message, e);
    });
  });
  logger.log("If a browser tab does not open automatically, please follow the next steps:");
  logger.log(
    `1. Open this url in your device: ${deviceAuthResponse.data.verification_uri_complete}`
  );
  logger.log(
    `2. Enter the following code: ${deviceAuthResponse.data.user_code} and confirm to login.
`
  );
  const tokenPayload = {
    grant_type: "urn:ietf:params:oauth:grant-type:device_code",
    device_code: deviceAuthResponse.data.device_code,
    client_id: cliConfig2.clientId
  };
  let isAuthenticated = false;
  const authenticate = async () => {
    const spinner = logger.spinner("Waiting for authentication");
    spinner.start();
    const spinnerFail = () => spinner.fail("Authentication failed!");
    while (!isAuthenticated) {
      try {
        const tokenResponse = await axios__default.default.post(cliConfig2.tokenUrl, tokenPayload);
        const authTokenData = tokenResponse.data;
        if (tokenResponse.status === 200) {
          try {
            logger.debug("🔐 Validating token...");
            await tokenService.validateToken(authTokenData.id_token, cliConfig2.jwksUrl);
            logger.debug("🔐 Token validation successful!");
          } catch (e) {
            logger.debug(e);
            spinnerFail();
            throw new Error("Unable to proceed: Token validation failed");
          }
          logger.debug("🔍 Fetching user information...");
          const cloudApiServiceWithToken = await cloudApiFactory(authTokenData.access_token);
          await cloudApiServiceWithToken.getUserInfo();
          logger.debug("🔍 User information fetched successfully!");
          try {
            logger.debug("📝 Saving login information...");
            await tokenService.saveToken(authTokenData.access_token);
            logger.debug("📝 Login information saved successfully!");
            isAuthenticated = true;
          } catch (e) {
            logger.error(
              "There was a problem saving your login information. Please try logging in again."
            );
            logger.debug(e);
            spinnerFail();
            return false;
          }
        }
      } catch (e) {
        if (e.message === "Unable to proceed: Token validation failed") {
          logger.error(
            "There seems to be a problem with your login information. Please try logging in again."
          );
          spinnerFail();
          await trackFailedLogin();
          return false;
        }
        if (e.response?.data.error && !["authorization_pending", "slow_down"].includes(e.response.data.error)) {
          logger.debug(e);
          spinnerFail();
          await trackFailedLogin();
          return false;
        }
        await new Promise((resolve) => {
          setTimeout(resolve, deviceAuthResponse.data.interval * 1e3);
        });
      }
    }
    spinner.succeed("Authentication successful!");
    logger.log("You are now logged into Strapi Cloud.");
    logger.log(
      "To access your dashboard, please copy and paste the following URL into your web browser:"
    );
    logger.log(chalk__default.default.underline(`${apiConfig.dashboardBaseUrl}/projects`));
    try {
      await cloudApiService.track("didLogin", { loginMethod: "cli" });
    } catch (e) {
      logger.debug("Failed to track login", e);
    }
  };
  await authenticate();
  return isAuthenticated;
};
const command$2 = ({ command: command2, ctx }) => {
  command2.command("cloud:login").alias("login").description("Strapi Cloud Login").addHelpText(
    "after",
    "\nAfter running this command, you will be prompted to enter your authentication information."
  ).option("-d, --debug", "Enable debugging mode with verbose logs").option("-s, --silent", "Don't log anything").action(() => runAction("login", action$1)(ctx));
};
const login = {
  name: "login",
  description: "Strapi Cloud Login",
  action: action$1,
  command: command$2
};
const action = async (ctx) => {
  const { logger } = ctx;
  const { retrieveToken, eraseToken } = await tokenServiceFactory(ctx);
  const token = await retrieveToken();
  if (!token) {
    logger.log("You're already logged out.");
    return;
  }
  const cloudApiService = await cloudApiFactory(token);
  try {
    await eraseToken();
    logger.log(
      "🔌 You have been logged out from the CLI. If you are on a shared computer, please make sure to log out from the Strapi Cloud Dashboard as well."
    );
  } catch (e) {
    logger.error("🥲 Oops! Something went wrong while logging you out. Please try again.");
    logger.debug(e);
  }
  try {
    await cloudApiService.track("didLogout", { loginMethod: "cli" });
  } catch (e) {
    logger.debug("Failed to track logout event", e);
  }
};
const command$1 = ({ command: command2, ctx }) => {
  command2.command("cloud:logout").alias("logout").description("Strapi Cloud Logout").option("-d, --debug", "Enable debugging mode with verbose logs").option("-s, --silent", "Don't log anything").action(() => runAction("logout", action)(ctx));
};
const logout = {
  name: "logout",
  description: "Strapi Cloud Logout",
  action,
  command: command$1
};
const command = ({ command: command2, ctx }) => {
  command2.command("cloud:create-project").description("Create a Strapi Cloud project").option("-d, --debug", "Enable debugging mode with verbose logs").option("-s, --silent", "Don't log anything").action(() => runAction("cloud:create-project", action$3)(ctx));
};
const createProject = {
  name: "create-project",
  description: "Create a new project",
  action: action$3,
  command
};
const cli = {
  deployProject,
  login,
  logout,
  createProject
};
const cloudCommands = [deployProject, login, logout];
async function initCloudCLIConfig() {
  const localConfig = await getLocalConfig();
  if (!localConfig.deviceId) {
    localConfig.deviceId = crypto__default.default.randomUUID();
  }
  await saveLocalConfig(localConfig);
}
async function buildStrapiCloudCommands({
  command: command2,
  ctx,
  argv
}) {
  await initCloudCLIConfig();
  for (const cloudCommand of cloudCommands) {
    try {
      await cloudCommand.command({ command: command2, ctx, argv });
    } catch (e) {
      console.error(`Failed to load command ${cloudCommand.name}`, e);
    }
  }
}
exports.buildStrapiCloudCommands = buildStrapiCloudCommands;
exports.cli = cli;
exports.services = index;
//# sourceMappingURL=index.js.map
