import { Voter } from './voter';
import { Strategy } from './types';
import affirmative from './strategy/affirmative';

class AccessDecisionManager {
  private readonly context;

  private readonly user;

  private readonly voters: Voter[];

  private readonly strategy: Strategy;

  public constructor(user, voters: Voter[], context, strategy = affirmative) {
    this.context = context;
    this.user = user;
    this.voters = voters;
    this.strategy = strategy;
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

    return this.strategy(
      relevantVoters,
      attribute,
      subject,
      this.user,
      this.context,
    );
  }
}

export default AccessDecisionManager;
