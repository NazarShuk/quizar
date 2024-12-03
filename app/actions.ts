"use server";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { putNewTerm, termsExistFromPath } from "./db/index";

puppeteer.use(StealthPlugin());

const requestHeaders = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
  Referer: "https://www.google.com/",
};

export async function cloneQuizlet(data: FormData) {
  "use server";
  const url = data.get("url") as string;

  if (!url) throw new Error("no url found");
  if (new URL(url).hostname != "quizlet.com")
    throw new Error("the url must be a quizlet.com url");

  const doesExist = await termsExistFromPath(new URL(url).pathname);
  if (doesExist.exists) return doesExist.id;

  console.log(`clone request for ${url}`);

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 1024 });
  await page.setExtraHTTPHeaders(requestHeaders);

  await page.goto(url);
  await page.waitForSelector(".SetPageTerms-termsList", { timeout: 60000 });
  console.log("page loaded.");

  const terms = await page.evaluate(() => {
    const termItems = document.querySelectorAll(".SetPageTerms-term");
    const terms = [];

    for (let i = 0; i < termItems.length; i++) {
      const element = termItems[i];
      // Find the term text element
      const termElement = element.querySelector(
        '.s1mdxb3l[data-testid="set-page-card-side"] .s1q0b356 .TermText',
      );

      // Find the definition text element
      const definitionElement = element.querySelector(
        '.s1mdxb3l[data-testid="set-page-card-side"].l150nly7 .TermText',
      );

      // Check if both elements exist
      if (!termElement || !definitionElement) {
        continue; // Skip this iteration if elements are missing
      }

      // Extract and trim the text
      // @ts-expect-error - we already check if both elements exist above
      const term = termElement.textContent.trim();
      // @ts-expect-error - we already check if both elements exist above
      const definition = definitionElement.textContent.trim();

      terms.push({
        term,
        definition,
      });
    }

    return terms;
  });

  const name = (await page.evaluate(() => {
    return document.querySelector(".SetPage-setIntro .tz2ipyx")?.innerHTML;
  })) as string;

  console.log(terms);
  await browser.close();

  const id = await putNewTerm(
    name,
    new URL(url).pathname,
    JSON.stringify(terms),
  );

  return id;
}
