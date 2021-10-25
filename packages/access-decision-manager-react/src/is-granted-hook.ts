import { useContext, useEffect, useReducer } from 'react';
import { AccessDecisionManagerContext } from './access-decision-manager-provider';

export const errorMessage =
  "'useIsGranted' hook must be rendered within the 'AccessDecisionManagerProvider' provider";

export const initialState = {
  error: null,
  isGranted: null,
  loading: true,
};

export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'error':
      return {
        error: action.error,
        isGranted: null,
        loading: false,
      };
    case 'request':
      return initialState;
    case 'response':
      return {
        error: null,
        isGranted: action.isGranted,
        loading: false,
      };

    default:
      throw new Error('invalid action type');
  }
};

const useIsGranted = (attribute: any, subject?: any) => {
  const accessDecisionManager = useContext(AccessDecisionManagerContext);
  if (!accessDecisionManager) throw Error(errorMessage);
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
