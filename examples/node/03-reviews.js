const { Auth, ReviewsAPI } = require("../..");
const fetch = require("node-fetch");
const readline = require("readline");

const log = console.log;
const enc = encodeURIComponent;

(async () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let email = "";
  let password = "";

  rl.question("email: ", (answer) => {
    email = answer;
    console.log(email);
    rl.question("password (will be plain text): ", async (answer) => {
      password = answer;
      rl.close();

      const auth = await Auth.login(email, password);

      const identifier = "iajs-example-reviews";
      let title = "Hello, World!";
      let body = `The date is ${new Date().toISOString()}`;
      let stars = 5;
      await ReviewsAPI.add({ identifier, title, body, stars, auth });

      // TODO handle exception
    });
  });
})();
