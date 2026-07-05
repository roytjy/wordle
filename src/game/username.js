const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,20}$/;

export function isValidUsername(raw) {
  return typeof raw === 'string' && USERNAME_PATTERN.test(raw.trim());
}

export function normalizeUsername(raw) {
  return raw.trim().toLowerCase();
}
