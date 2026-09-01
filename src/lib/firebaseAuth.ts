import { getAuth, signInWithPhoneNumber, type ConfirmationResult } from '@react-native-firebase/auth';

export type Confirmation = ConfirmationResult;

function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/invalid-phone-number':
      return "That doesn't look like a valid phone number.";
    case 'auth/too-many-requests':
      return 'Too many attempts — please try again later.';
    case 'auth/invalid-verification-code':
      return 'Incorrect code. Check the digits and try again.';
    case 'auth/code-expired':
      return 'That code expired — request a new one.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export async function sendOtp(phoneE164: string): Promise<Confirmation> {
  try {
    return await signInWithPhoneNumber(getAuth(), phoneE164);
  } catch (err) {
    throw new Error(friendlyAuthError(err));
  }
}

export async function confirmOtp(confirmation: Confirmation, code: string): Promise<void> {
  try {
    await confirmation.confirm(code);
  } catch (err) {
    throw new Error(friendlyAuthError(err));
  }
}

export function toE164(rawMobile: string): string | null {
  const digits = rawMobile.replace(/\D/g, '').replace(/^0+/, '');
  const last10 = digits.slice(-10);
  if (last10.length !== 10) return null;
  return `+91${last10}`;
}
