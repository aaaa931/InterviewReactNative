export interface User {
  id: number;
  username: string;
  email: string;
  displayName: string;
  photoURL: {
    url: string;
  };
  accessToken: string;
}
