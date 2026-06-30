import axios from "axios";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import { stripOtherLocationsSuffix } from "../../utils/location.js";

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
  // Prefer the discrete city/state fields since job_location can include a
  // "(+N other)" suffix when the posting lists multiple locations.
  if (job.job_city && job.job_state) return `${job.job_city}, ${job.job_state}`;
  if (job.job_location) return stripOtherLocationsSuffix(job.job_location);
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

function formatSalary(job) {
  const formatAmount = (amount) => `$${Number(amount).toLocaleString("en-US")}`;

  const periodLabels = {
    YEAR: "per year",
    MONTH: "per month",
    WEEK: "per week",
    HOUR: "per hour",
  };
  const period = periodLabels[job.job_salary_period] || "";

  const min = job.job_min_salary;
  const max = job.job_max_salary;

  if (min && max) {
    return `${formatAmount(min)} - ${formatAmount(max)} ${period}`.trim();
  }
  if (min || max) {
    return `${formatAmount(min || max)} ${period}`.trim();
  }

  const fallbackSalary = job.job_salary ?? job.job_salary_string;
  if (fallbackSalary != null) {
    if (typeof fallbackSalary === "number") return formatAmount(fallbackSalary);

    const trimmed = String(fallbackSalary).trim();
    if (!trimmed) return "Salary not listed";
    // Strings like "80k-100k a year" or "133K–185K a year" come pre-formatted.
    // Expand any k/m suffix into the full amount and prefix each number with $
    // (skip non-numeric values like "Competitive" or strings that already have $).
    if (!trimmed.includes("$") && /\d/.test(trimmed)) {
      return trimmed.replace(/\b(\d[\d.,]*)([kKmM])?\b/g, (match, num, suffix) => {
        const value = parseFloat(num.replace(/,/g, ""));
        if (Number.isNaN(value)) return match;
        const multiplier = suffix ? (/[kK]/.test(suffix) ? 1_000 : 1_000_000) : 1;
        return `$${(value * multiplier).toLocaleString("en-US")}`;
      });
    }
    return trimmed;
  }

  return "Salary not listed";
}

function deriveWorkplaceType(job) {
  return job.job_is_remote ? "Remote" : "On-site";
}

function deriveExperience(job) {
  const title = (job.job_title || "").toLowerCase();

  if (/\bintern(ship)?\b/.test(title)) return "Intern";
  if (/\b(senior|lead|principal)\b/.test(title)) return "Senior";
  return "Junior";
}

function mapJobToFirestore(job) {
  return {
    title: job.job_title || "Untitled",
    company: job.employer_name || "Unknown",
    type: job.job_employment_type || "Unknown",
    experience: deriveExperience(job),
    location: normalizeLocation(job),
    workplaceType: deriveWorkplaceType(job),
    skills: extractSkills(job),
    job_link: job.job_apply_link || job.employer_website || "",
    salary: formatSalary(job),
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

async function fetchJobs(query = "developer jobs in texas") {
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
