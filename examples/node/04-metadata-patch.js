const { Auth, MetadataAPI } = require("../..");
const fetch = require("node-fetch");
const readline = require("readline");

const log = console.log;
const enc = encodeURIComponent;

(async () => {
  async function main(email, password) {
    const auth = await Auth.login(email, password);

    // Modify the title (note you should change this to an item you own)
    const identifier = "iajs-example-reviews";
    const patch = {
      op: "add",
      path: "/title",
      value: `The date is ${new Date().toISOString()}`,
    };
    log(await MetadataAPI.patch({ identifier, patch, auth }));
  }

  // prompt for user/pass
  let email = "";
  let password = "";
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("email: ", (answer) => {
    email = answer;
    console.log(email);
    rl.question("password (will be plain text): ", async (answer) => {
      password = answer;
      rl.close();
      await main(email, password);
    });
  });
})();
