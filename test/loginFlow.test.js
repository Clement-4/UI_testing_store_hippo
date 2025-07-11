const puppeteer = require("puppeteer");
const expect = require("chai").expect;
const should = require("chai").should();

describe("Login flow", function () {
  let browser;
  let page;

  const basicScreenshotPath = __dirname + "/results/screenshot";

  const storeUrl = "https://creative-space.storehippo.com/en/";

  const loginStatusSelector = "a.ms-fs-14.ms-ml-m.ms-pl-xs.ng-scope";
  const emailSelector = "#email";
  const passwordSelector = "#password";

  const email = "babiyon.clement@hippoinnovations.com";
  const password = "Clement_store_hippo";

  before(async function () {
    browser = await puppeteer.launch({ headless: false });
  });

  beforeEach(async function () {
    page = await browser.newPage();
  });

  it("should render home page", async function () {
    await page.goto(storeUrl);
    await page.screenshot({
      path: `${basicScreenshotPath}/loginTest/homePageScreenshot.jpg`,
      fullPage: true,
    });
  });

  it("should have login as status", async function () {
    await page.goto(storeUrl);
    await page.waitForSelector(loginStatusSelector);

    const loginStatus = await page.evaluate(() =>
      document
        .querySelector("a.ms-fs-14.ms-ml-m.ms-pl-xs.ng-scope")
        .innerText.trim()
    );
    expect(loginStatus).to.contain("LOGIN or");
  });

  it("should login the user", async function () {
    await page.goto(storeUrl);
    await page.waitForSelector(loginStatusSelector);

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click(loginStatusSelector),
    ]);

    expect(page.url()).to.contain("/user/login");

    await Promise.all([
      page.waitForSelector(emailSelector),
      page.waitForSelector(passwordSelector),
    ]);

    await page.type(emailSelector, email, { delay: 100 });
    await page.type(passwordSelector, password, { delay: 100 });

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click("button[type='submit']"),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    page.on("dialog", async (dialog) => {
      console.log(`Dismissed the dialog with message : ${dialog.message}`);
      await dialog.dismiss();
    });

    const loginStatus = await page.evaluate(() =>
      document
        .querySelector(
          `a.dropdown-toggle.ms-fs-18.account-dropdown-btn.ng-binding[data-toggle="dropdown"]`
        )
        .innerText.trim()
    );

    expect(loginStatus).to.contain("Hi !");
  });

  afterEach(async function () {
    await page.close();
  });

  after(async function () {
    await browser.close();
  });
});
