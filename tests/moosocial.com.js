const { chromium } = require("playwright");

(async () => {
  const proxies = [
    "a8F7h9Jp:d3jF6y7HkL@192.168.1.1:8080",
    "K3hL9mNp:X8vL5p2KjM@10.0.0.1:5432",
    "Q1wE4rT7:Y3uI9o0PmN@172.16.0.1:1234",
    "Z5xC8vB2:a7L3mN1PjK@192.168.100.100:5678",
    "j7F5k3L1:q2W3e4R5tY@172.31.255.255:4321",
  ];
  const selectedProxy = proxies[Math.floor(Math.random() * proxies.length)];
  const [username, password, ip, port] = selectedProxy.split(/:|@/);
  const loginUser = "demo@moosocial.com";
  const loginPass = "admin";

  const browser = await chromium.launch({
    headless: false,
    proxy: {
      username,
      password,
      server: `http://${ip}:${port}`,
      bypass: "*.moosocial.com, playwright.dev", // temporary bypass proxy since random proxies does not work
    },
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://admin-demo.moosocial.com/admin/home/login");
  await page.locator("#UserEmail").fill(loginUser);
  await page.locator("#UserPassword").fill(loginPass);
  await page.locator(`input[type="submit"]`).click();

  // open side menu
  await page.evaluate(() => {
    const adminSubMenu = document.querySelector(
      "ul.page-sidebar-menu > li:nth-child(3) > ul"
    );

    const siteManSubMenu = document.querySelector(
      "ul.page-sidebar-menu > li:nth-child(4) > ul"
    );

    adminSubMenu.style.display = "none";
    siteManSubMenu.style.display = "block";

    siteManSubMenu
      .querySelector(
        "ul.page-sidebar-menu > li:nth-child(4) > ul > li:nth-child(2) > a"
      )
      .click();
  });

  // download
  const downloadFirstEntryBtn = page.locator(
    `table[class="table table-striped table-bordered table-hover"] > tbody > tr:nth-child(1) > td:nth-child(5) > a:nth-child(3)`
  );
  const downloadPromise = page.waitForEvent("download");
  await downloadFirstEntryBtn.click();
  const downloadFile = await downloadPromise;
  await downloadFile.saveAs("../" + downloadFile.suggestedFilename());

  // logout
  await page.route("**/*.{png,jpg,jpeg,css}", (route) => route.abort());

  await page.evaluate(() => {
    const dropDownUser = document.querySelector(
      `ul[class="nav navbar-nav pull-right"] > li:nth-child(1)`
    );
    dropDownUser.classList.add("open");

    dropDownUser.querySelector("ul >li:nth-child(8) > a").click();
  });

  // i add this since clicking the logout button does not logout the user in the actual site.
  await context.clearCookies();

  await browser.close();
})();
