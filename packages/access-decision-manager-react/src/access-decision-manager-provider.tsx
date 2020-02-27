import React, {createContext} from 'react';
import AccessDecisionManager, {Voter} from '@wizeline/access-decision-manager';

interface AccessDecisionManagerContextType {
  accessDecisionManager: AccessDecisionManager;
}

export const accessDecisionManagerContext = createContext<AccessDecisionManagerContextType>({
  accessDecisionManager: new AccessDecisionManager({}, [], null)
});

// eslint-disable-next-line no-shadow
const AccessDecisionManagerProvider = ({children, user, createContext, voters,}
: {
  children: any,
  createContext?: any
  user: any,
  voters: Voter[],
}) => {
  const context =
    typeof createContext === 'function'
  ? createContext() : null;

  const accessDecisionManager = new AccessDecisionManager(user, voters, context);
  const value = {
    accessDecisionManager
  };

  return <accessDecisionManagerContext.Provider value={value}>{children}</accessDecisionManagerContext.Provider>
};

export default AccessDecisionManagerProvider;

