const puppeteer = require("puppeteer");
const expect = require("chai").expect;
const should = require("chai").should();

describe("Login flow", function () {
  let browser;
  let page;

  const basicScreenshotPath = __dirname + "/results/screenshot";

  before(async function () {
    browser = await puppeteer.launch({ headless: false });
  });

  beforeEach(async function () {
    page = await browser.newPage();
  });

  it("should render home page", async function () {
    await page.goto("https://creative-space.storehippo.com/en/");
    await page.screenshot({
      path: `${basicScreenshotPath}/loginTest/homePageScreenshot.jpg`,
      fullPage: true,
    });
  });

  it("should have login as status", async function () {
    await page.goto("https://creative-space.storehippo.com/en/");
    await page.waitForSelector("a.ms-fs-14.ms-ml-m.ms-pl-xs.ng-scope");

    const loginStatus = await page.evaluate(() =>
      document
        .querySelector("a.ms-fs-14.ms-ml-m.ms-pl-xs.ng-scope")
        .innerText.trim()
    );
    expect(loginStatus).to.contain("LOGIN or");
  });

  afterEach(async function () {
    await page.close();
  });

  after(async function () {
    await browser.close();
  });
});
