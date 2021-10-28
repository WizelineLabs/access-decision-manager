import React, { useContext, useRef, useState } from 'react';
import AccessDecisionManager, {
  Voter,
} from '@wizeline/access-decision-manager';
import AccessDecisionManagerProvider, {
  AccessDecisionManagerContext,
} from '../access-decision-manager-provider';
import testRenderer, { act } from 'react-test-renderer';
import affirmative from '@wizeline/access-decision-manager/lib/strategy/affirmative';
import { renderHook } from '@testing-library/react-hooks';
import useIsGranted from '../is-granted-hook';

const MockConsumer = () => {
  const context = useContext(AccessDecisionManagerContext);
  return (
    <div>
      <h1 id="context-value">{JSON.stringify(context)}</h1>;
    </div>
  );
};

const positiveVoter = {
  supports(attribure): boolean {
    return true;
  },

  voteOnAttribute(attribure, subject, user): boolean {
    return true;
  },
};

const negativeVoter = {
  supports(attribure): boolean {
    return true;
  },

  voteOnAttribute(attribure, subject, user): boolean {
    return false;
  },
};

const moreThanTreeVotersStrategy = (
  voters: Voter[],
  attribute,
): Promise<boolean> => {
  if (voters.length < 3) {
    return Promise.resolve(false);
  } else {
    return affirmative(voters, attribute);
  }
};

const mockVoters = [positiveVoter, negativeVoter];
const mockUser = {
  id: 1,
};

describe('src', () => {
  describe('access-decision-manager-react', () => {
    describe('access-decision-manager-provider', () => {
      it('provides `accessDecisionManager` with null context if none specified', () => {
        const tree = testRenderer.create(
          <AccessDecisionManagerProvider user={mockUser} voters={mockVoters}>
            <MockConsumer />
          </AccessDecisionManagerProvider>,
        );

        const initialADM = new AccessDecisionManager(
          mockUser,
          mockVoters,
          null,
        );

        const context = tree.root.findByProps({ id: 'context-value' });
        expect(context.props.children).toBe(JSON.stringify(initialADM));
      });

      it('allows you to provide a context factory', () => {
        const context = Symbol('context');
        const mockContextFactory = jest.fn().mockReturnValue(context);

        const tree = testRenderer.create(
          <AccessDecisionManagerProvider
            user={mockUser}
            voters={mockVoters}
            contextFactory={mockContextFactory}
          >
            <MockConsumer />
          </AccessDecisionManagerProvider>,
        );

        const initialADM = new AccessDecisionManager(
          mockUser,
          mockVoters,
          context,
        );

        const node = tree.root.findByProps({ id: 'context-value' });
        expect(mockContextFactory).toBeCalled();
        expect(node.props.children).toBe(JSON.stringify(initialADM));
      });

      it('updates `accessDecisionManager` on props changed', () => {
        let mountCounter = 1;
        const MockConsumerRenderCount = () => {
          const context = useContext(AccessDecisionManagerContext);
          const id = useRef(mountCounter++);
          return (
            <div>
              <h1 data-testid="context-value" id="context-value">
                {JSON.stringify(context)}
              </h1>
              ;
              <div data-testid="mount-counter" id="mount-counter">
                {id.current}
              </div>
            </div>
          );
        };

        const initialADM = new AccessDecisionManager(
          mockUser,
          [mockVoters[0]],
          null,
        );

        const updatedADM = new AccessDecisionManager(
          { id: 2 },
          mockVoters,
          null,
        );

        let tree;
        act(() => {
          tree = testRenderer.create(
            <AccessDecisionManagerProvider
              user={mockUser}
              voters={[mockVoters[0]]}
            >
              <MockConsumerRenderCount />
            </AccessDecisionManagerProvider>,
          );
        });

        const context = tree.root.findByProps({ id: 'context-value' });
        expect(context.props.children).toBe(JSON.stringify(initialADM));

        act(() => {
          tree.update(
            <AccessDecisionManagerProvider user={{ id: 2 }} voters={mockVoters}>
              <MockConsumerRenderCount />
            </AccessDecisionManagerProvider>,
          );
        });

        expect(
          tree.root.findByProps({ id: 'mount-counter' }).props.children,
        ).toBe(1);
        expect(
          tree.root.findByProps({ id: 'context-value' }).props.children,
        ).toBe(JSON.stringify(updatedADM));
      });

      it('sets default strategy to `affirmative`', async () => {
        var wrapper = ({ children }: { children?: React.ReactNode }) => (
          <AccessDecisionManagerProvider user={{}} voters={mockVoters}>
            {children}
          </AccessDecisionManagerProvider>
        );
        const { result, waitForNextUpdate, rerender } = renderHook(
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

      it('can set strategy providing a strategy type in options', async () => {
        var wrapper = ({ children }: { children?: React.ReactNode }) => (
          <AccessDecisionManagerProvider
            user={{}}
            voters={mockVoters}
            options={{ strategy: 'unanimous' }}
          >
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

      it('allows to provide a custom strategy', async () => {
        var wrapper = ({ children }: { children?: React.ReactNode }) => (
          <AccessDecisionManagerProvider
            user={{}}
            voters={mockVoters}
            options={{ strategy: moreThanTreeVotersStrategy }}
          >
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
    });
  });
});
