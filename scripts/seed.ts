import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { seedData } from "../src/lib/data/seed";

async function main() {
  const target = resolve(process.cwd(), "supabase", "seed.json");
  await writeFile(target, JSON.stringify(seedData, null, 2));
  console.log(`Seed data written to ${target}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
