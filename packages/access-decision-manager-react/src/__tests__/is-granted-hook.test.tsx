import {renderHook} from '@testing-library/react-hooks'
import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mocked } from 'ts-jest/utils';
import AccessDecisionManager from '@wizeline/access-decision-manager';
import useIsGranted, {initialState, reducer} from '../is-granted-hook';
import AccessDecisionManagerProvider from '../access-decision-manager-provider';

jest.mock('@wizeline/access-decision-manager');

describe('src', () => {
  describe('access-decision-manager-react', () => {
    describe('is-granted-hook', () => {
      describe('useIsGranted', () => {
        beforeEach(() => {
          mocked(AccessDecisionManager).mockClear();
        })
        it('a request that is granted returns `{isGranted: true, loading: false}`',  async() => {

          const mockIsGrantedFn = jest.fn();
          AccessDecisionManager.prototype.isGranted = mockIsGrantedFn
          mockIsGrantedFn.mockReturnValue(Promise.resolve(true));

          const wrapper = ({children}) => <AccessDecisionManagerProvider user={{}} voters={[]}>{children}</AccessDecisionManagerProvider>
          const { result, waitForNextUpdate } = renderHook(() => useIsGranted('SOME'), {wrapper})

          expect(result.current).toEqual({ error: undefined, isGranted: undefined, loading: true })

          await waitForNextUpdate()

          expect(result.current).toEqual({ error: undefined, isGranted: true, loading: false })
        })

        it('a request that is not granted returns `{isGranted: false, loading: false}`',  async() => {
          const mockIsGrantedFn = jest.fn();
          AccessDecisionManager.prototype.isGranted = mockIsGrantedFn
          mockIsGrantedFn.mockReturnValue(Promise.resolve(false));

          const wrapper = ({children}) => <AccessDecisionManagerProvider user={{}} voters={[]}>{children}</AccessDecisionManagerProvider>
          const { result, waitForNextUpdate } = renderHook(() => useIsGranted('SOME'), {wrapper})

          expect(result.current).toEqual({ error: undefined, isGranted: undefined, loading: true });

          await waitForNextUpdate();

          expect(result.current).toEqual({ error: undefined, isGranted: false, loading: false });
        })

        it('returns an error state when some error occurs`',  async() => {
          const error = new Error('Uhh oh');
          const mockIsGrantedFn = jest.fn();
          AccessDecisionManager.prototype.isGranted = mockIsGrantedFn
          mockIsGrantedFn.mockReturnValue(Promise.reject(error));

          const wrapper = ({children}) => <AccessDecisionManagerProvider user={{}} voters={[]}>{children}</AccessDecisionManagerProvider>
          const { result, waitForNextUpdate } = renderHook(() => useIsGranted('SOME'), {wrapper})

          expect(result.current).toEqual({ error: undefined, isGranted: undefined, loading: true });

          await waitForNextUpdate();

          expect(result.current).toEqual({ error, isGranted: undefined, loading: false });
        })
      })

      describe('reducer', () => {
        it('returns the initial state for `request` type', () => {
          const requestAction = {type: 'request'};
          const requestedState = reducer(initialState, requestAction);
          expect(requestedState).toEqual(initialState)
        })

        it('returns error state for `error` type', () => {
          const error = new Error('Uh ohh');
          const errorAction = {type: 'error', error};
          const errorState = reducer(initialState, errorAction);
          expect(errorState).toEqual({
            error,
            isGranted: undefined,
            loading: false,
          })
        })

        it('returns response state for `response` type', () => {
          const isGranted = true;
          const responseAction =  {type: 'response', isGranted};
          const responseState = reducer(initialState, responseAction);
          expect(responseState).toEqual({
            error: undefined,
            isGranted,
            loading: false,
          })
        })
      })
    })
  })
})
