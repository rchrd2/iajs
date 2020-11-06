const { WaybackAPI, Auth } = require("../..");
const { getTestAuth, yesno, promptStr } = require("./common");
const log = console.log;

(async () => {
  // query the available api
  log(
    await WaybackAPI.available({
      url: "archive.org",
      timestamp: "202011050000",
    })
  );

  // query cdx api
  log(
    await WaybackAPI.cdx({
      url: "archive.org",
      matchType: "host",
      limit: 2,
    })
  );

  // prompt for user/pass for save page now
  let choice = await yesno({
    question: "Would you like to save a page now? (y/n)",
  });
  if (choice) {
    let auth = await getTestAuth();
    let url = await promptStr("Enter a URL: ");
    log(await WaybackAPI.savePageNow({ url, auth }));
  }
})();
