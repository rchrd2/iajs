const { Auth, ReviewsAPI } = require("../..");
const fetch = require("node-fetch");
const readline = require("readline");
const { getTestAuth } = require("./common");

const log = console.log;
const enc = encodeURIComponent;

(async () => {
  let auth = await getTestAuth();

  const identifier = "iajs-example-reviews";
  const title = "Hello, World!";
  const body = `The date is ${new Date().toISOString()}`;
  const stars = 5;

  log(`Adding a review to ${identifier} from user ${auth.values.itemname}.`);
  await ReviewsAPI.add({ identifier, title, body, stars, auth });
  log(`https://archive.org/details/${identifier}`);

  log("Pausing for a second to let it process.");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  log(`Listing reviews of the item ${auth.values.itemname}.`);
  log(await ReviewsAPI.get({ identifier }));
})();
