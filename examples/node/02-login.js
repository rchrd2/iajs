const { Auth } = require("../..");

const log = console.log;

const email = "hi@example.com";
const password = "p@ssw0rd";

/*
{
  "success": true,
  "values": {
    "cookies": {
      "logged-in-sig": "x",
      "logged-in-user": "x"
    },
    "email": "x",
    "itemname": "@x",
    "s3": {
      "access": "x",
      "secret": "x"
    },
    "screenname": "x"
  },
  "version": 1
}
*/
(async () => {
  log(await Auth.login(email, password));
})();
