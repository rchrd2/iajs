const { MetadataAPI, RelatedAPI, SearchAPI } = require("../../index");

const log = console.log;
const identifier = "example-png";

(async () => {
  log(await MetadataAPI.get({ identifier, path: "metadata" }));
  log(await MetadataAPI.get({ identifier, path: "metadata/identifier" }));
  log(await RelatedAPI.get({ identifier }));
  let searchResults = await SearchAPI.get({
    q: "nintendo",
    fields: ["identifier"],
    page: 2,
    foo: "bar",
  });
  log(
    searchResults["response"]["docs"]
      .map((r) => `https://archive.org/details/${r["identifier"]}`)
      .join("\n")
  );
})();
