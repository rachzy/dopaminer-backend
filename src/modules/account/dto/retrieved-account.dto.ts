export const RetrievedAccount = {
  id: true,
  email: true,
  lastAuthentication: true,
  lastConnection: true,
  verified: true,
};

export class RetrievedAccountDto {
  id: number;
  email: string;
  lastAuthentication: string;
  lastConnection: string;
  verified: boolean;
}
