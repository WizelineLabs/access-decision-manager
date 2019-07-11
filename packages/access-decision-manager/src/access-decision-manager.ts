import { Voter } from './voter';

class AccessDecisionManager {
  private readonly context;

  private readonly user;

  private readonly voters: Voter[];

  public constructor(user, voters: Voter[], context) {
    this.context = context;
    this.user = user;
    this.voters = voters;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async isGranted(attribute: string, subject?: any): Promise<boolean> {
    const relevantVoters = this.voters.filter((voter): boolean => {
      try {
        return voter.supports(attribute, subject, this.context);
      } catch (error) {
        return false;
      }
    });
    return (await Promise.all(
      relevantVoters.map((voter): boolean | Promise<boolean> => {
        let ret;
        try {
          ret = voter.voteOnAttribute(
            attribute,
            subject,
            this.user,
            this.context,
          );
        } catch (err) {
          ret = false;
          console.error(err); // eslint-disable-line no-console
        }
        return ret;
      }),
    )).some(Boolean);
  }
}

export default AccessDecisionManager;
