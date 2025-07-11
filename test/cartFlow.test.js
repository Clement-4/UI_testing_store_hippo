const puppeteer = require("puppeteer");
const expect = require("chai").expect;
const should = require("chai").should();
const { sleep } = require("../utils");

describe("Cart flow", function () {
  let browser;
  let page;

  const storeUrl = "https://creative-space.storehippo.com/en/";
  const productSelector = ".product-grid-item.product-grid";

  const loginStatusSelector = "a.ms-fs-14.ms-ml-m.ms-pl-xs.ng-scope";
  const increaseQuantityButtonSelector =
    "span.input-group-btn:nth-of-type(2) > button";

  const cartCountSelector = 'div.pull-right a[href="/cart"] .badge';

  const emailSelector = "#email";
  const passwordSelector = "#password";

  const email = "babiyon.clement@hippoinnovations.com";
  const password = "Clement_store_hippo";

  async function closeAlert() {
    page.on("dialog", async (dialog) => {
      console.log(`Dismissed the dialog with message : ${dialog.message}`);
      await dialog.dismiss();
    });
  }

  before(async function () {
    browser = await puppeteer.launch({ headless: false });
  });

  beforeEach(async function () {
    page = await browser.newPage();
    await page.setViewport({
      width: 1200,
      height: 1000,
      isMobile: false,
      isLandscape: true,
      hasTouch: false,
      deviceScaleFactor: 1,
    });
    await page.goto(storeUrl);
    await page.waitForSelector(loginStatusSelector);

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click(loginStatusSelector),
    ]);

    await Promise.all([
      page.waitForSelector(emailSelector),
      page.waitForSelector(passwordSelector),
    ]);

    await page.type(emailSelector, email, { delay: 50 });
    await page.type(passwordSelector, password, { delay: 50 });

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0" }),
      page.click("button[type='submit']"),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    await closeAlert();
  });

  it("should add item", async function () {
    await page.waitForSelector(productSelector);
    page.click(productSelector);
    Promise.all[
      (closeAlert(), page.waitForNavigation({ waitUntil: "networkidle0" }))
    ];

    await page.waitForSelector(cartCountSelector);

    let cartBadgeValue = await page.$eval(
      'div.pull-right a[href="/cart"] .badge',
      (el) => el.textContent.trim()
    );

    expect(cartBadgeValue).to.equals("0");

    await page.waitForSelector(increaseQuantityButtonSelector);

    await page.click(increaseQuantityButtonSelector);
    await page.click(increaseQuantityButtonSelector);

    await page.waitForSelector(`.addtocart-btn`);

    await page.click(`.addtocart-btn`);

    Promise.all([closeAlert(), closeAlert()]);

    await sleep(1000);

    cartBadgeValue = await page.$eval(
      'div.pull-right a[href="/cart"] .badge',
      (el) => el.textContent.trim()
    );

    expect(cartBadgeValue).to.equals("3");
  });

  it("should add address", async function () {
    await page.goto("https://creative-space.storehippo.com/en/account/address");

    Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" })]);

    const selector = 'a[ng-click="Edit1(1)"][title="Add Address"]';

    await page.waitForSelector(selector);
    await page.click(selector);
    await sleep(1000);

    await Promise.allSettled([
      page.waitForSelector("#full_name"),
      page.waitForSelector("#address"),
      page.waitForSelector("#city"),
      page.waitForSelector("#zip"),
      page.waitForSelector("#phone"),
    ]);

    await page.type("#full_name", "Babiyon Clement C", { delay: 50 });
    await page.type("#address", "1/77 Pattabiram street, Arassur, Sirakali", {
      delay: 50,
    });
    await page.type("#city", "Mayiladuthurai");
    await page.type("#zip", "609114");
    await page.type("#phone", "6374917474");

    await page.waitForSelector("#country");
    await page.select("#country", "string:IN");

    await page.waitForSelector("#state");
    await page.select("#state", "string:Tamil Nadu");

    await page.click("button[type='submit']");
  });

  afterEach(async function () {
    await page.close();
  });

  after(async function () {
    await browser.close();
  });
});
