#!/usr/bin/env node

const DEFAULT_PLATFORM = 'other';
const DEFAULT_URL = 'https://sentry.io';
const RESERVED_PROJECT_SLUGS = new Set(['babysea']);

const token = readRequiredEnv('SENTRY_AUTH_TOKEN');
const org = readRequiredEnv('SENTRY_ORG');
const project = readRequiredEnv('SENTRY_PROJECT');
const expectedPlatform =
  process.env.SENTRY_EXPECTED_PLATFORM || DEFAULT_PLATFORM;
const allowPermissionSkip = process.env.SENTRY_ALLOW_PERMISSION_SKIP === '1';
const sentryUrl = normalizeSentryUrl(process.env.SENTRY_URL || DEFAULT_URL);

if (RESERVED_PROJECT_SLUGS.has(project.toLowerCase())) {
  fail('Refusing to check the reserved main Sentry project.');
}

const response = await fetch(
  `${sentryUrl}/api/0/projects/${encodeURIComponent(org)}/${encodeURIComponent(project)}/`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  },
);

if (!response.ok) {
  if (
    (response.status === 401 || response.status === 403) &&
    allowPermissionSkip
  ) {
    console.log(
      `[sentry-project-check] Permission-limited response ${response.status}; skipping because SENTRY_ALLOW_PERMISSION_SKIP=1.`,
    );
    process.exit(0);
  }

  fail(`Sentry project lookup failed with HTTP ${response.status}.`);
}

const body = await response.json();
const slug = typeof body.slug === 'string' ? body.slug : '';
const platform = typeof body.platform === 'string' ? body.platform : '';

if (slug !== project) {
  fail(
    `Sentry project slug mismatch: expected ${project}, received ${slug || '<missing>'}.`,
  );
}

if (expectedPlatform && platform && platform !== expectedPlatform) {
  fail(
    `Sentry project platform mismatch: expected ${expectedPlatform}, received ${platform}.`,
  );
}

console.log(
  `[sentry-project-check] Verified Sentry project ${org}/${project}.`,
);

function readRequiredEnv(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    fail(`${name} is required.`);
  }

  return value;
}

function normalizeSentryUrl(value) {
  let url;

  try {
    url = new URL(value);
  } catch {
    fail('SENTRY_URL must be a valid URL.');
  }

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  const isLocalhost =
    hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';

  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && isLocalhost)) {
    fail('SENTRY_URL must use HTTPS unless it points to localhost.');
  }

  url.search = '';
  url.hash = '';

  return url.toString().replace(/\/+$/, '');
}

function fail(message) {
  console.error(`[sentry-project-check] ${message}`);
  process.exit(1);
}
