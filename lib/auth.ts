const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const PASSWORD_MIN_LENGTH = 8;
export const CODE_LENGTH = 6;
export const RESEND_COOLDOWN_SECONDS = 30;

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const validateEmail = (value: string): string | null => {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
  return null;
};

export const validatePassword = (
  value: string,
  { strict = true }: { strict?: boolean } = {},
): string | null => {
  if (!value) return "Enter your password.";
  if (!strict) return null;
  if (value.length < PASSWORD_MIN_LENGTH)
    return `Use at least ${PASSWORD_MIN_LENGTH} characters.`;
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value))
    return "Include at least one letter and one number.";
  return null;
};

export const validatePasswordMatch = (
  password: string,
  confirmation: string,
): string | null => {
  if (!confirmation) return "Confirm your password.";
  if (password !== confirmation) return "Passwords don't match.";
  return null;
};

export const validateCode = (value: string): string | null => {
  if (!value) return "Enter the code we sent you.";
  if (!new RegExp(`^\\d{${CODE_LENGTH}}$`).test(value))
    return `The code is ${CODE_LENGTH} digits.`;
  return null;
};

type ErrorLike = {
  code?: string;
  message?: string;
  longMessage?: string;
  meta?: { paramName?: string };
  errors?: ErrorLike[];
};

const FRIENDLY_MESSAGES: Record<string, string> = {
  form_identifier_not_found: "We couldn't find an account with that email.",
  form_password_incorrect: "That password isn't right. Try again.",
  form_identifier_exists:
    "An account with this email already exists. Sign in instead.",
  form_password_pwned:
    "This password has appeared in a data breach. Please choose another.",
  form_password_compromised:
    "This password has appeared in a data breach. Please choose another.",
  form_password_length_too_short: `Use at least ${PASSWORD_MIN_LENGTH} characters.`,
  form_password_validation_failed: "That password isn't right. Try again.",
  form_param_format_invalid: "Check the format and try again.",
  form_code_incorrect: "That code isn't right. Check your email and try again.",
  verification_expired: "That code has expired. Request a new one.",
  verification_failed: "Too many attempts. Request a new code.",
  user_locked:
    "Your account is temporarily locked after too many attempts. Try again later.",
  too_many_requests: "Too many attempts. Please wait a moment and try again.",
  session_exists: "You're already signed in.",
  network_error: "Can't reach the server. Check your connection and try again.",
};

export const FALLBACK_ERROR = "Something went wrong. Please try again.";

/** Turns any auth error into short, user-facing copy. */
export const getAuthErrorMessage = (error: unknown): string | null => {
  if (!error) return null;
  const err = error as ErrorLike;
  const first = err.errors?.[0] ?? err;
  const code = first.code ?? err.code;
  if (code && FRIENDLY_MESSAGES[code]) return FRIENDLY_MESSAGES[code];
  return first.longMessage || first.message || FALLBACK_ERROR;
};

export type AuthFormField = "email" | "password" | "code";

const PARAM_TO_FIELD: Record<string, AuthFormField> = {
  email_address: "email",
  identifier: "email",
  password: "password",
  code: "code",
};

const CODE_TO_FIELD: Record<string, AuthFormField> = {
  form_identifier_not_found: "email",
  form_identifier_exists: "email",
  form_password_incorrect: "password",
  form_password_pwned: "password",
  form_password_compromised: "password",
  form_code_incorrect: "code",
};

/**
 * Splits an auth error into the form field it belongs to (if any) and a
 * friendly message, so it can render inline under the right input.
 */
export const splitAuthError = (
  error: unknown,
): { field: AuthFormField | null; message: string } | null => {
  if (!error) return null;
  const err = error as ErrorLike;
  const first = err.errors?.[0] ?? err;
  const param = first.meta?.paramName;
  const field =
    (param && PARAM_TO_FIELD[param]) ||
    (first.code && CODE_TO_FIELD[first.code]) ||
    null;
  return { field, message: getAuthErrorMessage(error) ?? FALLBACK_ERROR };
};
