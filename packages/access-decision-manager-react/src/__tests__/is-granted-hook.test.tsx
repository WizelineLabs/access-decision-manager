import { renderHook } from '@testing-library/react-hooks';
import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mocked } from 'ts-jest/utils';
import AccessDecisionManager from '@wizeline/access-decision-manager';
import useIsGranted, {
  errorMessage,
  initialState,
  IsGrantedAction,
  IsGrantedState,
  reducer,
} from '../is-granted-hook';
import AccessDecisionManagerProvider from '../access-decision-manager-provider';

jest.mock('@wizeline/access-decision-manager');

describe('src', () => {
  describe('access-decision-manager-react', () => {
    describe('is-granted-hook', () => {
      describe('useIsGranted', () => {
        beforeEach(() => {
          mocked(AccessDecisionManager).mockClear();
        });

        it("a request that is granted returns `{isGranted: true, status: 'resolved'}`", async () => {
          const mockIsGrantedFn = jest.fn();
          AccessDecisionManager.prototype.isGranted = mockIsGrantedFn;
          mockIsGrantedFn.mockReturnValue(Promise.resolve(true));

          const wrapper = ({ children }: { children?: React.ReactNode }) => (
            <AccessDecisionManagerProvider user={{}} voters={[]}>
              {children}
            </AccessDecisionManagerProvider>
          );
          const { result, waitForNextUpdate } = renderHook(
            () => useIsGranted('SOME'),
            { wrapper },
          );

          expect(result.current).toEqual({
            error: undefined,
            isGranted: undefined,
            status: 'pending',
          });

          await waitForNextUpdate();

          expect(result.current).toEqual({
            error: undefined,
            isGranted: true,
            status: 'resolved',
          });
        });

        it("a request that is not granted returns `{isGranted: false, status: 'resolved'}`", async () => {
          const mockIsGrantedFn = jest.fn();
          AccessDecisionManager.prototype.isGranted = mockIsGrantedFn;
          mockIsGrantedFn.mockReturnValue(Promise.resolve(false));

          const wrapper = ({ children }: { children?: React.ReactNode }) => (
            <AccessDecisionManagerProvider user={{}} voters={[]}>
              {children}
            </AccessDecisionManagerProvider>
          );
          const { result, waitForNextUpdate } = renderHook(
            () => useIsGranted('SOME'),
            { wrapper },
          );

          expect(result.current).toEqual({
            error: undefined,
            isGranted: undefined,
            status: 'pending',
          });

          await waitForNextUpdate();

          expect(result.current).toEqual({
            error: undefined,
            isGranted: false,
            status: 'resolved',
          });
        });

        it('returns an error state when some error occurs`', async () => {
          const error = new Error('Uhh oh');
          const mockIsGrantedFn = jest.fn();
          AccessDecisionManager.prototype.isGranted = mockIsGrantedFn;
          mockIsGrantedFn.mockReturnValue(Promise.reject(error));

          const wrapper = ({ children }: { children?: React.ReactNode }) => (
            <AccessDecisionManagerProvider user={{}} voters={[]}>
              {children}
            </AccessDecisionManagerProvider>
          );
          const { result, waitForNextUpdate } = renderHook(
            () => useIsGranted('SOME'),
            { wrapper },
          );

          expect(result.current).toEqual({
            error: undefined,
            isGranted: undefined,
            status: 'pending',
          });

          await waitForNextUpdate();

          expect(result.current).toEqual({
            error,
            isGranted: undefined,
            status: 'error',
          });
        });

        it('throws error when used outside AccessDecisionManagerProvider', () => {
          const { result } = renderHook(() => useIsGranted('SOME'));
          expect(result.error).toStrictEqual(Error(errorMessage));
        });
      });

      describe('reducer', () => {
        it('returns pending state for `request` type', () => {
          const requestAction: IsGrantedAction = { type: 'request' };
          const requestedState: IsGrantedState = reducer(
            initialState,
            requestAction,
          );
          expect(requestedState).toEqual({
            error: undefined,
            status: 'pending',
            isGranted: undefined,
          });
        });

        it('returns error state for `error` type', () => {
          const error = new Error('Uh ohh');
          const errorAction: IsGrantedAction = { type: 'error', error };
          const errorState: IsGrantedState = reducer(initialState, errorAction);
          expect(errorState).toEqual({
            error,
            isGranted: undefined,
            status: 'error',
          });
        });

        it('returns resolved state for `response` type', () => {
          const isGranted = true;
          const responseAction: IsGrantedAction = {
            type: 'response',
            isGranted,
          };
          const responseState: IsGrantedState = reducer(
            initialState,
            responseAction,
          );
          expect(responseState).toEqual({
            error: undefined,
            isGranted,
            status: 'resolved',
          });
        });
      });
    });
  });
});
