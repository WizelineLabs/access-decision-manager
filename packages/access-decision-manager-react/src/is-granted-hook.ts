import {useContext, useEffect, useReducer} from 'react';
import {accessDecisionManagerContext} from './access-decision-manager-provider';

export const initialState = {
  error: undefined,
  isGranted: undefined,
  loading: true,
};

export const reducer = (state: any, action: any) => {
  switch (action.type) {
    case 'error':
      return {
        error: action.error,
        isGranted: undefined,
        loading: false,
      };
    case 'request':
      return initialState;
    case 'response':
      return {
        error: undefined,
        isGranted: action.isGranted,
        loading: false,
      };

    default:
      throw new Error('invalid action type');
  }
}

const useIsGranted = (attribute:any, subject?: any) => {
    const  context = useContext(accessDecisionManagerContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect
    ( () => {
            const isGrantedDispatcher = async () => {
                dispatch({ type: 'request'});

                try{
                    const isGranted = await context.accessDecisionManager.isGranted(attribute, subject);
                    dispatch({type: 'response', isGranted})
                } catch (error) {
                    dispatch({type: 'error', error})
                }
            };
            isGrantedDispatcher();
        },
        [context.accessDecisionManager, attribute, subject]
    );

    return state;
};

export default useIsGranted;
