import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.setViewport({width:1024, height:1024})
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

await page.goto("https://quizlet.com/977867742/unit-3-a-new-government-flash-cards/")
await new Promise(r => setTimeout(r, 5000));


const body = await page.evaluate(()=>document.body.innerHTML)
console.log(body)

await browser.close()