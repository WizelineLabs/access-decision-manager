import { Voter } from '../voter';

// eslint-disable-next-line import/prefer-default-export
export type Strategy = (
  voters: Voter[],
  attribute: string,
  subject?: any,
  user?: any,
  context?: any,
) => Promise<boolean>;
