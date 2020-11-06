const { FavoritesAPI, Auth } = require("../..");
const { getTestAuth, yesno, promptStr } = require("./common");
const log = console.log;

(async () => {
  log(await FavoritesAPI.get({ screenname: "r2_t5" }));

  let auth = await getTestAuth();
  log(await FavoritesAPI.get({ auth }));

  const identifier = "iajs-example-reviews";
  if (
    await yesno({
      question: `Would you like to favorite the item: ${identifier} (y/n)?`,
    })
  ) {
    await FavoritesAPI.add({ identifier, auth });
    log("Pausing for a second to let it process.");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    log("Listing your favorites:");
    log(await FavoritesAPI.get({ auth }));
  }

  if (
    await yesno({
      question: `Would you like to remove your favorite for: ${identifier} (y/n)?`,
    })
  ) {
    await FavoritesAPI.remove({ identifier, auth });
    log("Pausing for a second to let it process.");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  log("Listing your favorites:");
  log(await FavoritesAPI.get({ auth }));
})();
