import React, {createContext} from 'react';
import AccessDecisionManager, {Voter} from '@wizeline/access-decision-manager';

interface AccessDecisionManagerContextType {
  accessDecisionManager: AccessDecisionManager;
}

export const accessDecisionManagerContext = createContext<AccessDecisionManagerContextType>({});

const AccessDecisionManagerProvider = ({voters, children, user}: {voters: Voter[], children: any, user: any}) => {
  const accessDecisionManager = new AccessDecisionManager(user, voters, null);

  return <accessDecisionManagerContext.Provider value={accessDecisionManager}>{children}</accessDecisionManagerContext.Provider>
};

export default AccessDecisionManagerProvider;

