const { Auth } = require("../..");
const readline = require("readline");
const log = console.log;

const email = "hi@example.com";
const password = "p@ssw0rd";

(async () => {
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
      log(await Auth.login(email, password));
    });
  });
})();
