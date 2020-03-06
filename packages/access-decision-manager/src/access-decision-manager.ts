import { Voter } from './voter';
import { Strategy } from './strategy';
import affirmative from './strategy/affirmative';

class AccessDecisionManager {
  private readonly context;

  private readonly user;

  private readonly voters: Voter[];

  private readonly options?: {strategy?: Strategy}

  public constructor(user, voters: Voter[], context, options={strategy: affirmative}) {
    this.context = context;
    this.user = user;
    this.voters = voters;
    this.options = options;
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

    return this.options.strategy(
      relevantVoters,
      attribute,
      subject,
      this.user,
      this.context,
    );
  }
}

export default AccessDecisionManager;
