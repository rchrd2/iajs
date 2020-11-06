const fs = require("fs");
const readline = require("readline");
const path = require("path");
const testConfigPath = path.resolve(__dirname, "../../test-config.json");
const { Auth } = require("../..");

async function promptStr(prompt) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(prompt, (answer) => {
      resolve(answer);
      rl.close();
    });
  });
}

async function getTestAuth() {
  console.log(`Reading: ${testConfigPath}`);

  if (fs.existsSync(testConfigPath)) {
    let fileAuth = require(testConfigPath);
    if (fileAuth.success) {
      return fileAuth;
    }
  }

  console.log("Test config not found.");
  console.log("Log in with a test account to create one");
  let email = await promptStr("email: ");
  let password = await promptStr("password (will not be saved): ");
  let auth = await Auth.login(email, password);
  fs.writeFileSync(testConfigPath, JSON.stringify(auth, null, 2));
  console.log(`Wrote config to ${testConfigPath}`);
  return auth;
}

// https://github.com/tcql/node-yesno/blob/master/yesno.js

function defaultInvalidHandler({
  question,
  defaultValue,
  yesValues,
  noValues,
}) {
  process.stdout.write("\nInvalid Response.\n");
  process.stdout.write("Answer either yes : (" + yesValues.join(", ") + ") \n");
  process.stdout.write("Or no: (" + noValues.join(", ") + ") \n\n");
}

async function yesno({ question, defaultValue, yesValues, noValues, invalid }) {
  if (!invalid || typeof invalid !== "function")
    invalid = defaultInvalidHandler;

  const options = {
    yes: ["yes", "y"],
    no: ["no", "n"],
  };
  yesValues = (yesValues || options.yes).map((v) => v.toLowerCase());
  noValues = (noValues || options.no).map((v) => v.toLowerCase());

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(function (resolve, reject) {
    rl.question(question + " ", async function (answer) {
      rl.close();
      const cleaned = answer.trim().toLowerCase();
      if (cleaned == "" && defaultValue != null) return resolve(defaultValue);
      if (yesValues.indexOf(cleaned) >= 0) return resolve(true);
      if (noValues.indexOf(cleaned) >= 0) return resolve(false);
      invalid({ question, defaultValue, yesValues, noValues });
      const result = await ask({
        question,
        defaultValue,
        yesValues,
        noValues,
        invalid,
      });
      resolve(result);
    });
  });
}

module.exports = {
  getTestAuth,
  yesno,
  promptStr,
};
