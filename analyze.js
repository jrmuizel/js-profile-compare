const fs = require("fs");

// Load the sm.json and v8.json files
const sm = JSON.parse(fs.readFileSync("sm.json", "utf8"));
const v8 = JSON.parse(fs.readFileSync("v8.json", "utf8"));

// Create a hash table that maps function names to objects with sm and v8 totals
const functionMap = {};

for (const func of sm) {
  const [smName, path] = func.funcName.split(" ");
  if (path) {
    const smPath = normalizeSpidermonkeyPath(path);
    functionMap[smPath] = { sm: func.total, smName, smPath };
  }
}

for (const func of v8) {
  let [v8Name, v8Path] = func.funcName.split(" ");

  functionMap[v8Path] = {
    ...(functionMap[v8Path] || {}),
    v8: func.total,
    v8Name,
    v8Path,
  };
}

// Sort the functionMap object by the difference between sm and v8
const sortedFunctionMap = Object.entries(functionMap)
  .map(([path, { sm, v8, smName, v8Name }]) => ({
    path,
    sm,
    v8,
    diff: (sm || 0) - (v8 || 0),
    smName,
    v8Name,
  }))
  .sort((a, b) => b.diff - a.diff);

console.log(
  "Diff".padStart(5),
  "SM".padStart(5),
  "V8".padStart(5),
  "Factor".padStart(6),
  "Name and path"
);
for (f of sortedFunctionMap) {
  console.log(
    `${f.diff}`.padStart(5),
    `${f.sm ?? "-"}`.padStart(5),
    `${f.v8 ?? "-"}`.padStart(5),
    `${isNaN(f.sm / f.v8) ? "n/a" : (f.sm / f.v8).toFixed(2)}`.padStart(6),
    f.smName,
    f.v8Name,
    f.path
  );
}

function normalizeSpidermonkeyPath(path) {
  let p = path.slice(1, -1);
  p = p.replace(
    "/home/jrmuizel/src/Speedometer/resources/todomvc/architecture-examples/react/",
    ""
  );
  p = p.replace(
    "/home/jrmuizel/src/sps/Speedometer/resources/todomvc/architecture-examples/emberjs/dist/",
    ""
  );
  const [file, line, col] = p.split(":");
  const normalizedCol = +col + 1;
  return `${file}:${line}:${normalizedCol}`;
}
