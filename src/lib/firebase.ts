// Firebase auth — stubbed for quick test deploy
// Add firebase package and real config when ready to enable auth
export type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export const signInWithGoogle = async () => {
  throw new Error("Firebase auth not configured yet");
};

export const signOutUser = async () => {
  throw new Error("Firebase auth not configured yet");
};

export const onAuthChange = (_callback: (user: User | null) => void) => {
  return () => {};
};
