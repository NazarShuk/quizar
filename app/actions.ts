"use server";
import puppeteer from "puppeteer";

export async function cloneQuizlet(data : FormData){
    "use server";
    if (!data.get("url")) return
    const url = data.get("url") as string

    console.log(`clone request for ${url}`)
    
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    
    let screenshot = await page.screenshot({type:"webp", encoding:"base64"})

    await browser.close()
    console.log("did a screenshot")
  }