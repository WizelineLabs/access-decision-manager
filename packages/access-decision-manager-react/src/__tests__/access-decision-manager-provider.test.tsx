import React, { useContext, useRef, useState } from 'react';
import AccessDecisionManager from '@wizeline/access-decision-manager';
import AccessDecisionManagerProvider, {
  AccessDecisionManagerContext,
} from '../access-decision-manager-provider';
import testRenderer, { act } from 'react-test-renderer';

const MockConsumer = () => {
  const context = useContext(AccessDecisionManagerContext);
  return (
    <div>
      <h1 id="context-value">{JSON.stringify(context)}</h1>;
    </div>
  );
};
const mockVoters = [];
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
            createContext={mockContextFactory}
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
          mockVoters,
          null,
        );

        const updatedADM = new AccessDecisionManager(
          { id: 2 },
          [...mockVoters, { id: 3 }],
          null,
        );

        let tree;
        act(() => {
          tree = testRenderer.create(
            <AccessDecisionManagerProvider user={mockUser} voters={mockVoters}>
              <MockConsumerRenderCount />
            </AccessDecisionManagerProvider>,
          );
        });

        const context = tree.root.findByProps({ id: 'context-value' });
        expect(context.props.children).toBe(JSON.stringify(initialADM));

        act(() => {
          tree.update(
            <AccessDecisionManagerProvider
              user={{ id: 2 }}
              voters={[...mockVoters, { id: 3 }]}
            >
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
    });
  });
});
