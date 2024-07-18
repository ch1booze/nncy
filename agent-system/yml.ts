import * as fs from 'fs/promises';
import YAML from "yaml";

const file = await fs.readFile("prompts.yml", { encoding: "utf-8" });
YAML.parse(file)
