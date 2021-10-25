import React, {
  createContext,
  useState,
  useEffect,
  ReactElement,
  ReactComponentElement,
  ReactNode,
} from 'react';
import AccessDecisionManager, {
  Voter,
} from '@wizeline/access-decision-manager';

export const AccessDecisionManagerContext = createContext<
  AccessDecisionManager
>(null);

interface IAccessDecisionManagerProviderProps {
  children: any;
  user: any;
  voters: Voter[];
  createContext?: any;
}

const AccessDecisionManagerProvider = ({
  children,
  user,
  voters,
  createContext: createContext,
}: IAccessDecisionManagerProviderProps) => {
  const [accessDecisionManager, setAccessDecisionManager] = useState<
    AccessDecisionManager
  >(
    new AccessDecisionManager(
      user,
      voters,
      typeof createContext === 'function' ? createContext() : null,
    ),
  );

  useEffect(() => {
    setAccessDecisionManager(
      new AccessDecisionManager(
        user,
        voters,
        typeof createContext === 'function' ? createContext() : null,
      ),
    );
  }, [user, voters, createContext]);

  return (
    <AccessDecisionManagerContext.Provider value={accessDecisionManager}>
      {children}
    </AccessDecisionManagerContext.Provider>
  );
};

export default AccessDecisionManagerProvider;
