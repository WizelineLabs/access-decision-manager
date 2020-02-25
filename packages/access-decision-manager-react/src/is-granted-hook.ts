import {useContext, useEffect, useReducer} from 'react';
import { accessDecisionManagerContext } from './access-decision-manager-provider';

const initialState = {
    error: undefined,
    isGranted: undefined,
    loading: true,
};

function reducer(state: any, action: any) {
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
            throw new Error();
    }
}

const useIsGranted = (attribute:any, subject: any) => {
    const  accessDecisionManager = useContext(accessDecisionManagerContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    useEffect
    ( () => {
            const isGrantedDispatcher = async () => {
                dispatch({ type: 'request'});

                try{
                    const isGranted = await accessDecisionManager.isGranted(attribute, subject);
                    dispatch({type: 'response', isGranted})
                } catch (error) {
                    dispatch({type: 'error', error})
                }
            };
            isGrantedDispatcher();
        },
        [accessDecisionManager, attribute, subject]
    );

    return state
};

export default useIsGranted;
