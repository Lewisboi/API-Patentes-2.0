import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { getInfoByPlate } from "./scraper.ts";

const PORT = parseInt(Deno.env.get("PORT") as string) || 8000;

const router = new Router();
router
  .get("/:plate", async (context) => {
    const plate = context.params.plate;
    console.log(`GET /${plate}`, "from", context.request.ip);
    if (context.params && plate) {
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

console.log(`HTTP webserver running. Access it at port ${PORT}`);
await app.listen({ port: PORT });
