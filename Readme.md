# Compare JavaScript profiles

This is a small tool designed to help us compare JavaScript benchmark performance between browsers.

It ranks JavaScript functions by the difference in "self time".

## How to use

 1. Have two profiles open in the Firefox Profiler, one from Spidermonkey and one from V8, which were imported with the right tooling. (Ask mstange 
 or jrmuizel for specifics.)
 2. In each profiler tab, change the view to be "[x] JavaScript" and "[x] Invert call stack".
 3. Execute the command from the `get-data` file in the devtools console on the Spidermonkey profile.
 4. Paste the copied JSON into a file in this directory called `sm.json`.
 5. Execute the same command in the V8 profile.
 6. Paste the copied JSON into a file in this directory called `v8.json`.
 7. Run `node analyze.js > result.txt` .
