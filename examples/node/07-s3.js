const { S3API, Auth } = require("../..");
const { getTestAuth, yesno, promptStr } = require("./common");
const log = console.log;

(async () => {
  let auth = await getTestAuth();

  // You can change this identifier to a new unclaimed item
  const identifier = "iajs-example-s3";
  log(`Listing s3 contents of identifier: ${identifier}...`);
  log(await S3API.ls({ identifier }));

  if (
    await yesno({
      question: `Would you like to upload to item: ${identifier} (y/n)?`,
    })
  ) {
    let key = await promptStr("filename: ");
    const body = `The date is ${new Date().toISOString()}`;
    const metadata = { title: "s3 PUT test item" };
    log(
      await S3API.upload({
        identifier,
        key,
        body,
        metadata,
        autocreate: true,
        auth,
      })
    );
  }

  const newIdentifier = `${identifier}-${Date.now()}`;
  if (
    await yesno({
      question: `Would you like to create a new empty test item?: ${newIdentifier} (y/n)?`,
    })
  ) {
    const metadata = {
      title: "S3 PUT empty test item",
      description: `The date is ${new Date().toISOString()}`,
    };
    log(
      await S3API.createEmptyItem({
        identifier: newIdentifier,
        metadata,
        testItem: true,
        auth,
        wait: false,
      })
    );
    log(`https://archive.org/details/${newIdentifier}`);
    log(`https://s3.us.archive.org/${newIdentifier}`);
  }
})();
