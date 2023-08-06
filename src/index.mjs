/*
 * This file is part of the @orkans/serve package.
 * Copyright (c) 2023-2023 Orkan <orkans+serve@gmail.com>
 */
import fs from "fs";
import path from "path";
import { Command, Option } from "commander";
import clipboard from "clipboardy";
import open, { apps as browsers } from "open";
import Logger from "./lib/Logger.mjs";
import findPort from "./lib/findPort.mjs";
import runServer from "./lib/runServer.mjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default () => {
  /*
   * ==========================================================================
   * Init app
   */
  const pkg = require("../package.json");
  const log = new Logger();
  const cli = new Command();

  // prettier-ignore
  cli
    .name("serve")
    .version(pkg.version)
    .description(pkg.description)
    .addOption(new Option("-p, --port <number>", "port number").default(3000))
    .addOption(new Option("-d, --dir <path>", "home dir").default(process.cwd(), "current working dir"))
    .option("-c, --clip", "copy url to clipboard")
    .option("-o, --open [browser]", "open url in browser. Use 'cfg' to load settings from ./open.json file")
    .option("-f, --file [path]", "open path")
    .option("--debug", "output extra debugging")
    .parse(process.argv);

  const opts = cli.opts();
  opts.debug && console.log(opts);

  /*
   * ==========================================================================
   * Verify
   */
  let home = opts.dir;
  if (!path.isAbsolute(home)) {
    home = home.replace(/^\\\/+|\\\/+$/g, "");
    home = path.resolve(process.cwd() + "/" + home);
    if (!fs.existsSync(home)) {
      throw new Error(`Home dir not found! ${home}`);
    }
    opts.debug && console.log("Resolved home dir: %s", home);
  }

  /*
   * ==========================================================================
   * Start
   */
  findPort(opts.port).then((port) => {
    runServer(home, port);

    const url = `http://localhost:${port}`;
    log.extra("Url:  ", url);
    log.extra("Dir:  ", home);
    if (opts.port != port) {
      log.error(`This port was picked because ${opts.port} is in use.`);
    }

    /*
     * ------------------------------------------------------------------------
     * Clipboard
     */
    if (opts.clip) {
      clipboard.write(url);
      log.info("Copied local address to clipboard!");
    }

    /*
     * ------------------------------------------------------------------------
     * Open browser?
     */
    if (opts.open) {
      let args = {
        app: { name: browsers[opts.open] ?? null },
        url: opts.file ? `${url}/${opts.file}` : url,
      };
      if ("cfg" === opts.open) {
        args = { ...args, ...require(path.resolve("./open.json")) };
      }
      opts.debug && console.log("openArgs", args);
      open(args.url, args);
      log.info("Opening browser...");
    }

    /*
     * ------------------------------------------------------------------------
     * Finalize...
     */
    log.render();
  });
};
