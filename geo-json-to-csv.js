const fs = require("fs");
const fsPromise = require("fs").promises;

/* Read json from file given by first argument and write out each object as csv
 * line to stdout.
 * e.g.
 *
    {
      "latitude": 55.9517755,
      "longitude": -3.1991373,
      "altitude": 116,
      "timestamp": 1579441696024
    },
    becomes
    55.9517755,-3.1991373,116,1579441696024

    This can then be loaded into e.g. GpsPrune:
    https://activityworkshop.net/software/gpsprune/download.html
 *
 */

async function readFile(name) {
  return await fsPromise.readFile(name, { encoding: "utf8" });
}

// generic any values
const json2csv = json => Object.values(json).join();

// special gps location keys
const location_json2csv = (json, path) => {
  let csv = ["latitude", "longitude", "altitude", "accuracy", "timestamp", "time"]
    .map(k => (
      path 
        ? json[path][k] 
        : json[k]
    ))
    .join();
  // csv += `, ${json["timestamp"]}`;
  return csv;
};

const jsonarr2csv = (json, path) =>
["latitude", "longitude", "altitude", "accuracy", "timestamp", "time"].join()+"\n"+
  json.reduce((acc, o) => {
    acc = acc + location_json2csv(o, path) + "\n";
    return acc;
  }, "");

async function main() {
  const name = process.argv[2];
  const path = process.argv[3];
  const text = await readFile(name);
  console.log(jsonarr2csv(JSON.parse(text), path));
}

main();
