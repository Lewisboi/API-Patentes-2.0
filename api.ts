import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { getInfoByPlate } from "./scraper.ts";

const router = new Router();
router
  .get("/:plate", async (context) => {
    if (context.params && context.params.plate) {
      const plate = context.params.plate;
      try {
        const info = await getInfoByPlate(plate);
        context.response.body = info;
      } catch (error) {
        context.response.status = 400;
        context.response.body = { error: error.message };
      }
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`HTTP webserver running. Access it at: http://localhost:8000/`);
await app.listen({ port: 8000 });
