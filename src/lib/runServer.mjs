/*
 * This file is part of the @orkans/serve package.
 * Copyright (c) 2023-2023 Orkan <orkans+serve@gmail.com>
 */
import express from "express";
import serveIndex from "serve-index";

/**
 * Start Express server.
 * @link http://expressjs.com
 * 
 * @param home Home dir
 * @param port Port number
 */
export default (home = process.cwd(), port = 3000) => {
  // Create
  const app = express();

  /**
   * Add callbacks:
   * - express.static() middleware: serves files
   * - serveIndex() next-middleware: serves directory index
   * @link http://expressjs.com/en/guide/writing-middleware.html#writing-middleware-for-use-in-express-apps
   */
  app.use("/", express.static(home), serveIndex(home, { icons: true }));

  app.all("/*", (req, res) => {
    res.sendFile(req.url);
  });

  // Start
  app.listen(port);
};
