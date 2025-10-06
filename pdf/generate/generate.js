import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export async function generatePDF(slug) {
  chromium.setGraphicsMode = false;

  const executablePath = await chromium.executablePath();

  const browser = await puppeteer.launch({
    executablePath,
    args: [
      ...chromium.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
    ],
    headless: chromium.headless,
  });

  try {
    const page = await browser.newPage();
    await page.goto(slug, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    await page.waitForSelector("#resume", {
      timeout: 15000,
    });
    await page.setViewport({ width: 1280, height: 800 });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: false,
      margin: { top: "30px", bottom: "30px", left: "25px", right: "25px" },
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}
