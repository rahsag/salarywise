import {
  createUserWithEmailAndPassword,
  getAuth,
  reload,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from '@react-native-firebase/auth';

function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return "That doesn't look like a valid email address.";
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts — please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export async function signUpWithEmail(email: string, password: string): Promise<void> {
  try {
    const credential = await createUserWithEmailAndPassword(getAuth(), email, password);
    await sendEmailVerification(credential.user);
  } catch (err) {
    throw new Error(friendlyAuthError(err));
  }
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(getAuth(), email, password);
  } catch (err) {
    throw new Error(friendlyAuthError(err));
  }
}

export async function resendVerificationEmail(): Promise<void> {
  const user = getAuth().currentUser;
  if (!user) throw new Error('Not signed in.');
  try {
    await sendEmailVerification(user);
  } catch (err) {
    throw new Error(friendlyAuthError(err));
  }
}

// Firebase caches emailVerified on the local user object — reload() re-fetches
// it from the server, since Firebase has no way to push the change from the
// browser tab where the user tapped the verification link.
export async function refreshEmailVerified(): Promise<boolean> {
  const auth = getAuth();
  if (!auth.currentUser) return false;
  await reload(auth.currentUser);
  return auth.currentUser?.emailVerified ?? false;
}

export function toE164(rawMobile: string): string | null {
  const digits = rawMobile.replace(/\D/g, '').replace(/^0+/, '');
  const last10 = digits.slice(-10);
  if (last10.length !== 10) return null;
  return `+91${last10}`;
}
