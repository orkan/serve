/*
 * This file is part of the @orkans/serve package.
 * Copyright (c) 2023-2023 Orkan <orkans+serve@gmail.com>
 */
import express from "express";
import serveIndex from "serve-index";

/**
 * Start Express server.
 * @param home Home dir
 * @param port Port number
 */
export default (home = process.cwd(), port = 3000) => {
  // Create Express server
  const app = express();

  // Lookup the files in 'home' directory
  // The express.static serves the file contents
  // The serveIndex is this module serving the directory
  app.use("/", express.static(home), serveIndex(home, { icons: true }));

  app.all("/*", (req, res) => {
    res.sendFile(req.url);
  });

  // Start Express server
  app.listen(port);
};
