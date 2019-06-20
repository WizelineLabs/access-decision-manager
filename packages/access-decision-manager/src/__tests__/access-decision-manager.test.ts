import AccessDecisionManager from '../access-decision-manager';
import { Voter } from '../voter';

describe('src', () => {
  describe('access-decision-manager', () => {
    describe('access-decision-manager', () => {
      describe('isGranted', () => {
        it('calls voter.supports with the correct arguments', async () => {
          const mockUser = undefined;
          const mockContext = Symbol('context');

          const voter: Voter = {
            supports: jest.fn().mockReturnValue(true),
            voteOnAttribute: () => true,
          };
          const mockVoters = [voter];

          const adm = new AccessDecisionManager(
            mockUser,
            mockVoters,
            mockContext,
          );

          const attribute = 'SOME-ATTRIBUTE';
          const subject = Symbol('subject');

          await adm.isGranted(attribute, subject);

          expect(voter.supports).toHaveBeenCalledTimes(1);
          expect(voter.supports).toHaveBeenCalledWith(
            attribute,
            subject,
            mockContext,
          );
        });

        it('calls voter.voteOnAttribute with the correct arguments', async () => {
          const mockUser = Symbol('user');
          const mockContext = Symbol('context');

          const voter: Voter = {
            supports: () => true,
            voteOnAttribute: jest.fn().mockReturnValue(true),
          };
          const mockVoters = [voter];

          const adm = new AccessDecisionManager(
            mockUser,
            mockVoters,
            mockContext,
          );

          const attribute = 'SOME-ATTRIBUTE';
          const subject = Symbol('subject');

          await adm.isGranted(attribute, subject);

          expect(voter.voteOnAttribute).toHaveBeenCalledTimes(1);
          expect(voter.voteOnAttribute).toHaveBeenCalledWith(
            attribute,
            subject,
            mockUser,
            mockContext,
          );
        });

        it('only asks voters that support a request to vote', async () => {
          const mockUser = undefined;
          const mockContext = undefined;

          const syncSupportedVoter: Voter = {
            supports: () => true,
            voteOnAttribute: jest.fn().mockReturnValue(false),
          };
          const syncUnsupportedVoter: Voter = {
            supports: () => false,
            voteOnAttribute: jest.fn().mockReturnValue(true),
          };
          const mockVoters = [syncSupportedVoter, syncUnsupportedVoter];

          const adm = new AccessDecisionManager(
            mockUser,
            mockVoters,
            mockContext,
          );

          const result = await adm.isGranted('SOME-ATTRIBUTE', 'SOME-SUBJECT');
          expect(result).toBe(false);
          expect(syncSupportedVoter.voteOnAttribute).toHaveBeenCalledTimes(1);
          expect(syncUnsupportedVoter.voteOnAttribute).toHaveBeenCalledTimes(0);
        });

        it('returns true if at least one voter returns true', async () => {
          const mockUser = undefined;
          const mockContext = undefined;

          const asyncTrueVoter: Voter = {
            supports: () => true,
            voteOnAttribute: () =>
              new Promise((resolve) => {
                setImmediate(() => resolve(true));
              }),
          };
          const mockVoters = [asyncTrueVoter];

          const adm = new AccessDecisionManager(
            mockUser,
            mockVoters,
            mockContext,
          );

          const result = await adm.isGranted('SOME-ATTRIBUTE', 'SOME-SUBJECT');
          expect(result).toBe(true);
        });

        it('returns false if no voters returns true', async () => {
          const mockUser = undefined;
          const mockContext = undefined;

          const syncFalseVoter: Voter = {
            supports: () => true,
            voteOnAttribute: () => false,
          };
          const mockVoters = [syncFalseVoter];

          const adm = new AccessDecisionManager(
            mockUser,
            mockVoters,
            mockContext,
          );

          const result = await adm.isGranted('SOME-ATTRIBUTE', 'SOME-SUBJECT');
          expect(result).toBe(false);
        });

        it("skips a if a voter when it's `supports` method throws an error", async () => {
          const mockUser = undefined;
          const mockContext = undefined;

          const syncErrorVoter: Voter = {
            supports: () => {
              throw new Error('Uhh oh');
            },
            voteOnAttribute: jest.fn().mockReturnValue(true),
          };
          const mockVoters = [syncErrorVoter];

          const adm = new AccessDecisionManager(
            mockUser,
            mockVoters,
            mockContext,
          );

          const result = await adm.isGranted('SOME-ATTRIBUTE', 'SOME-SUBJECT');
          expect(result).toBe(false);
          expect(syncErrorVoter.voteOnAttribute).toHaveBeenCalledTimes(0);
        });

        it("defaults to false if a voter's `voteOnAttribute` method throws an error", async () => {
          const mockUser = undefined;
          const mockContext = undefined;

          const syncErrorVoter: Voter = {
            supports: () => true,
            voteOnAttribute: async () => {
              throw new Error('Uhh oh');
            },
          };
          const mockVoters = [syncErrorVoter];

          const adm = new AccessDecisionManager(
            mockUser,
            mockVoters,
            mockContext,
          );

          const result = await adm.isGranted('SOME-ATTRIBUTE', 'SOME-SUBJECT');
          expect(result).toBe(false);
        });
      });
    });
  });
});
