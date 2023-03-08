const fs = require('fs');

// Load the sm.json and v8.json files
const sm = JSON.parse(fs.readFileSync('sm.json', 'utf8'));
const v8 = JSON.parse(fs.readFileSync('v8.json', 'utf8'));

// Create a hash table that maps function names to objects with sm and v8 totals
const functionMap = {};

sm.forEach((func) => {
  let mangledName = func.funcName.split(' ')[0];
  let path = func.funcName.split(' ')[1]
  if (path) {
    path = path.substring(1, path.length - 1);
    path = path.replace("/home/jrmuizel/src/Speedometer/resources/todomvc/architecture-examples/react/", "")
    path = path.split(":")
    path[2] = +path[2] + 1
    path = path.join(":")
  }

  functionMap[path] = { sm: func.total, smName: mangledName, smPath: path };
});


v8.forEach((func) => {
  let mangledName = func.funcName.split(' ')[0];
  let path = func.funcName.split(' ')[1];

  functionMap[path] = Object.assign(functionMap[path] || {}, { v8: func.total, v8Name: mangledName, v8Path: path });

});

// Sort the functionMap object by the difference between sm and v8
const sortedFunctionMap = Object.entries(functionMap)
  .map(([path, { sm, v8, smName, v8Name}]) => ({ path, sm, v8, diff: (sm || 0) - (v8 || 0), smName, v8Name }))
  .sort((a, b) => b.diff - a.diff);

for (f of sortedFunctionMap) {
        console.log(f.path, f.sm, f.v8, f.diff, (f.sm/f.v8).toFixed(2), f.smName, f.v8Name)
}
