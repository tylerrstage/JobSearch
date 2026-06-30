// JSearch sometimes appends a "(+N other)" / "(+N others)" suffix to job_location
// when a posting lists multiple locations (e.g. "Austin, TX (+1 other)"). We only
// ever want to show the single primary city/state, so strip that suffix off.
const OTHER_LOCATIONS_SUFFIX = /\s*\(\+\d+\s*others?\)\s*$/i;

export function stripOtherLocationsSuffix(location) {
  if (typeof location !== 'string') return location;
  return location.replace(OTHER_LOCATIONS_SUFFIX, '').trim();
}

// Jobs may store a dedicated `city` field, or only a combined "City, ST"
// `location` string. This pulls out just the city portion for matching.
export function getJobCity(job) {
  if (job?.city) return job.city;
  if (typeof job?.location === 'string' && job.location.includes(',')) {
    return job.location.split(',')[0].trim();
  }
  return job?.location || '';
}

export function jobMatchesCity(job, cityQuery) {
  const query = (cityQuery || '').trim().toLowerCase();
  if (!query) return true;
  return getJobCity(job).toLowerCase().includes(query);
}
