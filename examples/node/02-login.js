const { Auth } = require("../..");
const readline = require("readline");
const { promptStr, getTestAuth } = require("./common");
const log = console.log;

(async () => {
  let auth;
  if (process.env.TEST_AUTH) {
    auth = await getTestAuth();
  } else {
    let email = await promptStr("email: ");
    let password = await promptStr("password (will not be saved): ");
    auth = await Auth.login(email, password);
  }

  console.log("Auth object:");
  log(auth);

  console.log("Now creating an auth object from cookies:");
  let authFromCookies = await Auth.fromCookies(
    auth.values.cookies["logged-in-sig"].split(";")[0],
    auth.values.cookies["logged-in-user"].split(";")[0]
  );
  log(authFromCookies);
})();
