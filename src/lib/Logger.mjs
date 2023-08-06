/*
 * This file is part of the @orkans/serve package.
 * Copyright (c) 2023-2023 Orkan <orkans+serve@gmail.com>
 */
import chalk from "chalk";
import boxen from "boxen";

/**
 * Simple logger.
 */
export default class {
  /**
   * Define record types and rendering order.
   */
  logs = { ext: [], err: [], inf: [] };

  /**
   * Styling functions for each log type.
   */
  styles = {
    ext: chalk.cyanBright,
    err: chalk.red,
    inf: (s) => s,
  };

  /**
   * Add record.
   * 
   * @param s1 Styled string
   * @param type Record type
   * @param s2 Unstyled string
   */
  record(s1, type = "inf", s2 = "") {
    let s = this.styles[type](s1) + s2;
    this.logs[type].push(s);
  }

  /**
   * Print all logs.
   */
  render() {
    let out = [];
    for (const type in this.logs) {
      let v = this.logs[type] ?? null;
      if (v != null && v.length !== 0) {
        out.push(v.join("\n"));
      }
    }
    console.log(
      boxen(out.join("\n\n"), {
        title: "Serving!",
        margin: 1,
        padding: 1,
        borderColor: "white",
      })
    );
  }

  /**
   * Log error.
   */
  error(s) {
    this.record(s, "err");
  }

  /**
   * Log info.
   */
  info(s) {
    this.record(s, "inf");
  }

  /**
   * Log double styled record.
   * 
   * @param s1 Styled string
   * @param s2 Unstyled string
   */
  extra(s1, s2) {
    this.record(s1, "ext", s2);
  }
}
