const { ItemUtils } = require("../..");

const log = console.log;

(async () => {
  log("Read contents of a zip file.");
  log(
    await ItemUtils.lsZip(
      "goodytwoshoes00newyiala",
      "goodytwoshoes00newyiala_jp2.zip"
    )
  );
})();
