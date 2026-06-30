import axios from "axios";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const admin = require("firebase-admin");

// Load environment variables from the project root .env file.
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const apiKey = process.env.JSEARCH_API_KEY;
const apiUrl = process.env.JSEARCH_API_URL || "https://api.openwebninja.com/jsearch/search-v2";

if (!apiKey) {
  console.error("Missing JSEARCH_API_KEY. Add it to your .env file.");
  process.exit(1);
}

// Initialize Firebase Admin so we can write to Firestore.
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.getApps().length) {
  admin.initializeApp({
    credential: admin.cert(serviceAccount),
  });
}

const db = getFirestore();

function normalizeLocation(job) {
  if (job.job_location) return job.job_location;
  if (job.job_city && job.job_state) return `${job.job_city}, ${job.job_state}`;
  return job.job_city || "Remote";
}

function extractSkills(job) {
  const highlightSkills = Object.values(job.job_highlights || {})
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter(Boolean);

  const description = job.job_description || "";
  const keywordSkills = Array.from(
    description.matchAll(/\b(JavaScript|TypeScript|React|Node\.js|Python|Java|C#|AWS|SQL|Docker|Kubernetes|MongoDB|PostgreSQL|Git|CI\/CD)\b/gi),
    (match) => match[1]
  );

  return [...new Set([...highlightSkills, ...keywordSkills])].slice(0, 8);
}

function mapJobToFirestore(job) {
  return {
    title: job.job_title || "Untitled",
    company: job.employer_name || "Unknown",
    type: job.job_employment_type || "Unknown",
    experience: job.job_required_experience?.required_experience_in_field || "Not specified",
    location: normalizeLocation(job),
    skills: extractSkills(job),
    job_link: job.job_google_link || job.job_apply_link || "",
    salary: job.job_salary || job.job_salary_string || null,
    description: job.job_description || "",
    isRemote: Boolean(job.job_is_remote),
    postedOn: job.job_posted_at_datetime_utc
      ? Timestamp.fromDate(new Date(job.job_posted_at_datetime_utc))
      : FieldValue.serverTimestamp(),
    source: "jsearch",
    createdAt: FieldValue.serverTimestamp(),
    rawId: job.job_id || null,
  };
}

function createDocId(job) {
  const base = `${job.title}-${job.company}-${job.location}`.toLowerCase();
  return base.replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function fetchJobs(query = "developer jobs in chicago") {
  const response = await axios.request({
    method: "GET",
    url: apiUrl,
    params: {
      query,
      num_pages: 1,
      country: "us",
      language: "en",
    },
    headers: {
      "X-API-Key": apiKey,
    },
  });

  console.log("Raw JSearch response:");
  console.log(JSON.stringify(response.data, null, 2));

  const jobs = response.data?.data?.jobs || [];

  if (!jobs.length) {
    console.log("No jobs returned from JSearch.");
    return;
  }

  for (const job of jobs) {
    const mappedJob = mapJobToFirestore(job);
    const docId = job.job_id || createDocId(mappedJob);

    await db.collection("jobs").doc(docId).set(mappedJob, { merge: true });
    console.log(`Saved job: ${mappedJob.title} at ${mappedJob.company}`);
  }

  console.log(`Imported ${jobs.length} jobs into Firestore.`);
}

fetchJobs();
