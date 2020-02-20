import React, {createContext, useContext} from 'react';
import AccessDecisionManager, {Voter} from '@wizeline/access-decision-manager';

interface AccessDecisionManagerContextType {
  accessDecisionManager: AccessDecisionManager;
}

const accessDecisionManagerContext = createContext<AccessDecisionManagerContextType>({});


const AccessDecisionManagerProvider = ({voters, children, user}: {voters: Voter[], children: any, user: any}) => {
  const accessDecisionManager = new AccessDecisionManager(user, voters, null);

  return <accessDecisionManagerContext.Provider value={accessDecisionManager}>{children}</accessDecisionManagerContext.Provider>
};

export const useIsGranted = async (attribute:any, subject: any) => {
  const  accessDecisionManager  = useContext(accessDecisionManagerContext);
  const isGranted = await accessDecisionManager.isGranted(attribute, subject);
  return isGranted
};

export default AccessDecisionManagerProvider;

