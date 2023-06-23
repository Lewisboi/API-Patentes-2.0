import puppeteer, {
  ElementHandle,
} from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { cleanKey } from "./keyCleaner.ts";
import { composeMiddleware } from "https://deno.land/x/oak/mod.ts";
// Source URL consts
const SEARCHBOX_ID = "#searchbox";
const INPUT_FIELD_ID = "#txtTerm";
const BUTTON_ID = "#btnConsultar";
const TABLE_ID = "#tblDataVehicle";
const SERVICE_URL = "https://www.patentechile.com/";

export async function getInfoByPlate(
  plate: string,
): Promise<Record<string, string>> {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(SERVICE_URL, { waitUntil: "networkidle0" });

  // Get the search box element and the input field element
  const searchBox = await page.waitForSelector(SEARCHBOX_ID) as ElementHandle<
    ElementHandle
  >;
  const inputField = await searchBox.waitForSelector(
    INPUT_FIELD_ID,
  ) as ElementHandle<ElementHandle>;

  // Type the selected text into the input field
  await inputField.type(plate);

  // Click the search button
  await page.click(BUTTON_ID);

  const content = await page.waitForSelector(".the-content") as ElementHandle<
    ElementHandle
  >;

  // Check if invalid plate message is shown
  const error = (await content.$x(
    "//*[contains(., 'No se encontraron resultados')]",
  ))[0];

  if (error) {
    await browser.close();
    throw new Error("Patente inválida");
  }

  // Wait for the table to load
  await content.waitForSelector(TABLE_ID);

  // Get all rows in the table
  const dataPairs = await content.$$eval(`${TABLE_ID} tr`, (rows) => {
    // Iterate over the rows and extract the data
    const dataPairs = [];
    for (const row of rows) {
      const columns = row.querySelectorAll("td");
      if (columns.length == 2) {
        const description = columns[0].innerText;
        const data = columns[1].innerText;
        dataPairs.push([description, data]);
      }
    }
    return dataPairs;
  });

  const data_to_return: Record<string, string> = {};
  for (const [description, data] of dataPairs) {
    data_to_return[cleanKey(description)] = data;
  }
  await browser.close();
  console.log("Scraping done");
  console.log(`Returning ${JSON.stringify(data_to_return)}`)
  return data_to_return;
}
