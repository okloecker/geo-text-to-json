const debug = require("debug")("csv");
const fs = require("fs");
const fsPromise = require("fs").promises;
const parse = require("csv-parse/lib/sync");

async function readFile(name) {
  return await fsPromise.readFile(name, { encoding: "utf8" });
}

async function main() {
  const name = process.argv[2];
  const text = await readFile(name);

  const records = parse(text.trim(), {
    columns: header => header.map(column => column ? `${column}`.trim() : undefined),
    cast: function(value, context) {
      if (isNaN(value)) {
        return value;
      } else {
        return +value;
      }
    },
    skip_empty_lines: true
  });

  console.log(records);
}

main();
