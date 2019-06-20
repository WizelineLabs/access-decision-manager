/* eslint-disable @typescript-eslint/no-explicit-any, import/prefer-default-export */
export interface Voter {
  supports: (attribute: any, subject: any, context: any) => boolean;
  voteOnAttribute: (
    attribute: any,
    subject: any,
    user: any,
    context: any,
  ) => boolean | Promise<boolean>;
}
