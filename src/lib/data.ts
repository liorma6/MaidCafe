import { promises as fs } from "fs";
import path from "path";
import type { SiteContent } from "./types";

const DATA_PATH = path.join(process.cwd(), "data", "content.json");

export async function readContent(): Promise<SiteContent> {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as SiteContent;
}

export async function writeContent(content: SiteContent): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(content, null, 2), "utf-8");
}
