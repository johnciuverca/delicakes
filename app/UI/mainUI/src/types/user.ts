export type User = {
  accountName: string;
  email: string;
  role: 'user' | 'admin';
  password: string; // TODO: temporary, remove this field after implementing authentication
};
