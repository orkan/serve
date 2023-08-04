/*
 * This file is part of the @orkans/serve package.
 * Copyright (c) 2023-2023 Orkan <orkans+serve@gmail.com>
 */
import { createServer } from "net";

/**
 * Find next free localhost port.
 * @param port Initial port number
 */
export default (port = 3000, opts = {}) =>
  new Promise((resolve, reject) => {
    const server = createServer();
    server
      .on("error", (e) => {
        if ("EADDRINUSE" === e.code) {
          opts.debug &&
            console.error("Port %d is currently in use, retrying...", port);
          port = ++port > 65535 ? 3000 : port;
          setTimeout(() => {
            server.close();
            server.listen(port);
          }, 1000);
        }
      })
      .on("listening", () => {
        server.close();
        resolve(port);
      })
      .listen(port);
  });
