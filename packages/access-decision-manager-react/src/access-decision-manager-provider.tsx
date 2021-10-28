import React, { createContext, useState, useEffect, ReactElement } from 'react';
import AccessDecisionManager, {
  Voter,
} from '@wizeline/access-decision-manager';

import affirmative from '@wizeline/access-decision-manager/lib/strategy/affirmative';
import unanimous from '@wizeline/access-decision-manager/lib/strategy/unanimous';
import { Strategy } from '@wizeline/access-decision-manager/lib/strategy';

export const AccessDecisionManagerContext = createContext<
  AccessDecisionManager
>(null);

type StrategyType = 'affirmative' | 'unanimous';
interface AccessDecisionManagerProviderProps {
  children: any;
  user: any;
  voters: Voter[];
  contextFactory?: any;
  options?: { strategy: Strategy | StrategyType };
}

const AccessDecisionManagerProvider = ({
  children,
  user,
  voters,
  contextFactory,
  options = { strategy: affirmative },
}: AccessDecisionManagerProviderProps): ReactElement => {
  let strategy;

  if (typeof options?.strategy === 'function') {
    strategy = options.strategy;
  }
  if (typeof options?.strategy === 'string') {
    if (options.strategy === 'unanimous') {
      strategy = unanimous;
    } else if (options.strategy === 'affirmative') {
      strategy = affirmative;
    } else {
      throw new Error(
        `Unsupported strategy for AccesDecisionManager ${options.strategy} `,
      );
    }
  }
  if (typeof options?.strategy === 'undefined') {
    // eslint-disable-next-line no-console
    console.error (
      ` invalid strategy provided for AccessDecisionManager: 'undefined'. Will use 'affirmative' strategy by default, `,
    );
    strategy = affirmative
  }

  const [accessDecisionManager, setAccessDecisionManager] = useState<
    AccessDecisionManager
  >(
    new AccessDecisionManager(
      user,
      voters,
      typeof contextFactory === 'function' ? contextFactory() : null,
      { strategy },
    ),
  );

  useEffect(() => {
    setAccessDecisionManager(
      new AccessDecisionManager(
        user,
        voters,
        typeof contextFactory === 'function' ? contextFactory() : null,
        { strategy },
      ),
    );
  }, [user, voters, contextFactory]);

  return (
    <AccessDecisionManagerContext.Provider value={accessDecisionManager}>
      {children}
    </AccessDecisionManagerContext.Provider>
  );
};

export default AccessDecisionManagerProvider;
