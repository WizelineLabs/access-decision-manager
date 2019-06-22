// eslint-disable-next-line import/no-extraneous-dependencies
import { Request } from 'express';
import AccessDecisionManager from '@wizeline/access-decision-manager';
import AccessDecisionManagerProvider from '../access-decision-manager-provider';

describe('src', () => {
  describe('access-decision-manager-express', () => {
    describe('access-decision-manager-provider', () => {
      it('adds a `accessDecisionManager` to the request', (done) => {
        const mockGetUser = (): void => {};
        const mockVoters = [];
        // @ts-ignore -- We are intentionally not providing a real Request object here
        const req: Request = {};

        const admMiddleware = AccessDecisionManagerProvider(
          mockGetUser,
          mockVoters,
        );

        admMiddleware(req, undefined, () => {
          expect(req.accessDecisionManager).toBeInstanceOf(
            AccessDecisionManager,
          );

          done();
        });
      });

      it('calls the `getUser` method to create the `user`', (done) => {
        const user = Symbol('user');
        const mockGetUser = jest.fn().mockReturnValue(user);
        const mockVoters = [];
        // @ts-ignore -- We are intentionally not providing a real Request object here
        const req: Request = {};

        const admMiddleware = AccessDecisionManagerProvider(
          mockGetUser,
          mockVoters,
        );

        admMiddleware(req, undefined, () => {
          expect(mockGetUser).toHaveBeenCalledTimes(1);
          expect(req.accessDecisionManager.user).toBe(user);

          done();
        });
      });

      it('provides a default context', (done) => {
        const mockGetUser = (): void => {};
        const mockVoters = [];
        // @ts-ignore -- We are intentionally not providing a real Request object here
        const req: Request = {};

        const admMiddleware = AccessDecisionManagerProvider(
          mockGetUser,
          mockVoters,
        );

        admMiddleware(req, undefined, () => {
          expect(req.accessDecisionManager.context).toEqual(
            expect.objectContaining({
              req,
            }),
          );

          done();
        });
      });

      it('allows you to provide a context factory', (done) => {
        const context = Symbol('context');
        const mockGetUser = (): void => {};
        const mockVoters = [];
        const mockContextFactory = jest.fn().mockReturnValue(context);

        // @ts-ignore -- We are intentionally not providing a real Request object here
        const req: Request = {};

        const admMiddleware = AccessDecisionManagerProvider(
          mockGetUser,
          mockVoters,
          mockContextFactory,
        );

        admMiddleware(req, undefined, () => {
          expect(req.accessDecisionManager.context).toBe(context);

          done();
        });
      });
    });
  });
});
