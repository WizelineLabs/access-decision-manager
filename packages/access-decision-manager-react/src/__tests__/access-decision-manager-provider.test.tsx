import React from 'react'
import AccessDecisionManager from '@wizeline/access-decision-manager';
import AccessDecisionManagerProvider from '../access-decision-manager-provider';

describe('src', () => {
  describe('access-decision-manager-react', () => {
    describe('access-decision-manager-provider', () => {
      it('adds `accessDecisionManager` to the context', () => {
        const mockUser = {
          id: 1,
        };
        const mockVoters = [];
        const component = AccessDecisionManagerProvider({voters: mockVoters, user: mockUser, children: null});
        expect(component.props.value.accessDecisionManager).toBeInstanceOf(AccessDecisionManager);
      })

      it('allows you to provide a context factory', () => {
        const context = Symbol('context');
        const mockUser = {
          id: 1,
        };
        const mockVoters = [];
        const mockContextFactory = jest.fn().mockReturnValue(context);
        const component = AccessDecisionManagerProvider({voters: mockVoters, user: mockUser, children: null, createContext: mockContextFactory});

        expect(component.props.value.accessDecisionManager.context).toBe(context);
      })

      it('provides a null context if any is specified', () => {
        const mockUser = {}
        const mockVoters = [];
        const component = AccessDecisionManagerProvider({voters: mockVoters, user: mockUser, children: null});

        expect(component.props.value.accessDecisionManager.context).toBe(null);
      })
    })
  })
});
