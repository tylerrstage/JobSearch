import axios from "axios";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const apiKey = process.env.JSEARCH_API_KEY;
const apiUrl = process.env.JSEARCH_API_URL || "https://api.openwebninja.com/jsearch/search-v2";

if (!apiKey) {
  console.error("Missing JSEARCH_API_KEY. Add it to your .env file.");
  process.exit(1);
}

async function fetchJobs(query = "developer jobs in chicago") {
  const response = await axios.request({
    method: "GET",
    url: apiUrl,
    params: { query },
    headers: {
      "X-API-Key": apiKey,
    },
  });

  console.log(JSON.stringify(response.data, null, 2));
}

fetchJobs();
