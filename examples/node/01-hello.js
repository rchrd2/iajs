const { GifcitiesAPI, MetadataAPI, RelatedAPI, SearchAPI } = require("../..");

const log = console.log;

(async () => {
  const identifier = "example-png";
  const searchTerm = "nintendo";

  log(await MetadataAPI.get({ identifier, path: "metadata" }));
  log(await MetadataAPI.get({ identifier, path: "metadata/identifier" }));
  log(await RelatedAPI.get({ identifier }));
  let searchResults = await SearchAPI.get({
    q: searchTerm,
    fields: ["identifier"],
    page: 2,
  });
  log(
    searchResults["response"]["docs"]
      .map((r) => `https://archive.org/details/${r["identifier"]}`)
      .join("\n")
  );
  log((await GifcitiesAPI.search(searchTerm)).slice(0, 10));
})();
