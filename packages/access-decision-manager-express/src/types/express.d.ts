/* eslint-disable @typescript-eslint/no-explicit-any */
declare namespace Express {
  // eslint-disable-next-line import/prefer-default-export
  export interface Request {
    accessDecisionManager: any;
  }
}
