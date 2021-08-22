const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream(process.argv[2]);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let prevMd5 = null;
  let prevPath = null;
  const dupDict = {};

  for await (const line of rl) {
    let m;
    if (m = line.match(/^([a-z0-9]{32})  (.+)/)) {
      const md5 = m[1];
      const path = m[2];
      if (md5 === prevMd5) {
        if (!dupDict[md5]) {
          dupDict[md5] = [prevPath];
        }
        dupDict[md5].push(path);
      }
      prevMd5 = md5;
      prevPath = path;
    } else {
      console.error(`Line error: ${line}`);
      process.exit(1);
    }
  }
  let uselessFileCount = 0;
  Object.keys(dupDict).forEach((md5) => {
    let d = dupDict[md5].length - 1;
    uselessFileCount += d;
    if (d <= 0) {
      console.error('unexpected');
      process.exit(1);
    }
  });
  console.error('duplicate file groups:', Object.keys(dupDict).length);
  console.log('# duplicate file groups:', Object.keys(dupDict).length);
  console.error('useless files:', uselessFileCount);
  console.log('# useless files:', uselessFileCount);
  console.log('# run at ' + (new Date()).toString());
  console.log("\n");
  
  Object.keys(dupDict).forEach((md5) => {
    let pathArr = dupDict[md5];
    console.log('# Group', md5, "members", pathArr.length);
    pathArr.sort((p1, p2) => {
      // SORTING LOGIC
      // Write your own logic here to sort two path
      // The first one in the list will be kept
      // Others will be deleted
      return pl.localeCompare(p2);
    });
    console.log("# KEEPIT\t" + pathArr[0]);
    const rmCommands = [];
    for (let i = 1; i < pathArr.length; i++) {
      console.log("# DELETE\t" + pathArr[i]);
      rmCommands.push("rm '" + pathArr[i] + "'");
    }
    console.log("ls '" + pathArr[0] + "' && " + rmCommands.join(' && '));
    console.log("\n");
  });
}

processLineByLine();
