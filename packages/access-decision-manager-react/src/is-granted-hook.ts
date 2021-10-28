import { useContext, useEffect, useReducer } from 'react';
import { AccessDecisionManagerContext } from './access-decision-manager-provider';

export const errorMessage =
  "'useIsGranted' hook must be rendered within the 'AccessDecisionManagerProvider' provider";

export type IsGrantedState = {
  error: undefined | Error;
  isGranted: undefined | boolean;
  status: 'idle' | 'error' | 'pending' | 'resolved';
};

export interface IsGrantedAction {
  type: 'request' | 'response' | 'error';
  isGranted?: boolean;
  error?: Error;
}

export const initialState: IsGrantedState = {
  error: undefined,
  isGranted: undefined,
  status: 'idle',
};

export const reducer = (
  state: IsGrantedState,
  action: IsGrantedAction,
): IsGrantedState => {
  switch (action.type) {
    case 'error':
      return {
        ...state,
        status: 'error',
        error: action.error,
      };
    case 'request':
      return {
        status: 'pending',
        error: undefined,
        isGranted: undefined,
      };
    case 'response':
      return {
        ...state,
        status: 'resolved',
        isGranted: action.isGranted,
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const useIsGranted = (attribute: any, subject?: any) => {
  const accessDecisionManager = useContext(AccessDecisionManagerContext);
  if (!accessDecisionManager) {
    throw Error(errorMessage);
  }
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    const isGrantedDispatcher = async () => {
      dispatch({ type: 'request' });

      try {
        const isGranted = await accessDecisionManager.isGranted(
          attribute,
          subject,
        );
        dispatch({ type: 'response', isGranted });
      } catch (error) {
        dispatch({ type: 'error', error });
      }
    };
    isGrantedDispatcher();
  }, [accessDecisionManager, attribute, subject]);

  return state;
};

export default useIsGranted;
