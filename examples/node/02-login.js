const { Auth } = require("../..");
const readline = require("readline");
const { getTestAuth } = require("./common");
const log = console.log;

(async () => {
  let auth;
  auth = await getTestAuth();

  console.log("Auth object:");
  log(auth);

  console.log("Demo creating an auth object from cookies:");
  let authFromCookies = await Auth.fromCookies(
    auth.values.cookies["logged-in-sig"].split(";")[0],
    auth.values.cookies["logged-in-user"].split(";")[0]
  );
  log(authFromCookies);
})();
