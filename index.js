var fstream = require("fstream");
var tar = require("tar");
var fs = require("fs");
var path = require("path");

var toTar = path.join(__dirname, "example");
var bad = process.argv[2] === "bad";

var untar = function (tarball) {
  console.log("Untarring", tarball);
  var buf = fs.readFileSync(outFile);
  var dest = path.join(__dirname, "extracted-" + Math.random());
  fs.mkdirSync(dest);

  var extractor = new tar.Extract({ path: dest });
  extractor.on("error", function (err) {
    console.log("Untar error:", err);
    process.exit(1);
  });
  extractor.on("end", function () {
    console.log("Untarred without errors to", dest);
    process.exit(0);
  });

  extractor.write(buf);
  extractor.end();
};


console.log("Making example/f not writeable");
fs.chmodSync(path.join(toTar, "f"), 0444);

var reader;
if (bad) {
  reader = fstream.Reader({ path: toTar, type: 'Directory' });
} else {
  reader = fstream.Reader(toTar);
}

var outFile = path.join(__dirname, "out.tgz");

console.log("Tarring to", outFile);
var out = fstream.Writer({ path: outFile });
out.on("close", function () {
  untar(outFile);
});
out.on("error", function (err) {
  console.log("Tar error:", err);
  process.exit(1);
});
reader.pipe(tar.Pack({ noProprietary: true })).pipe(out);
