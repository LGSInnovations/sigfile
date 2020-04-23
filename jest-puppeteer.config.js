module.exports = {
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS !== "false",
  },
  browser: "chromium",
  browserContext: "default",
  server: {
    command: "npx http-server -p 3000 --cors",
    port: 3000,
    launchTimeout: 10000,
    debug: true,
  },
};
