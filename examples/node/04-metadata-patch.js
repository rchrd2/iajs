const { Auth, MetadataAPI } = require("../..");
const fetch = require("node-fetch");
const readline = require("readline");
const { getTestAuth } = require("./common");

const log = console.log;
const enc = encodeURIComponent;

(async () => {
  let auth = await getTestAuth();

  // Modify the title (note you should change this to an item you own)
  const identifier = "iajs-example-reviews";
  const patch = {
    op: "add",
    path: "/title",
    value: `The date is ${new Date().toISOString()}`,
  };
  log(await MetadataAPI.patch({ identifier, patch, auth }));
})();
