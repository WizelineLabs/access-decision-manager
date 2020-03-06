import AccessDecisionManager from '../../access-decision-manager';
import { Voter } from '../../voter';
import affirmative from "../../strategy/affirmative";

describe('src', () => {
  describe('strategy', () => {
    describe('affirmative', () => {
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

        const asyncFalseVoter: Voter = {
          supports: () => true,
          voteOnAttribute: () =>
            new Promise((resolve) => {
              setImmediate(() => resolve(false));
            }),
        };

        const mockVoters = [asyncFalseVoter, asyncTrueVoter];
        const mockOptions = {
          strategy: affirmative
        };

        const adm = new AccessDecisionManager(
          mockUser,
          mockVoters,
          mockContext,
          mockOptions
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
        const mockOptions = {
          strategy: affirmative
        };

        const adm = new AccessDecisionManager(
          mockUser,
          mockVoters,
          mockContext,
          mockOptions
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
        const mockOptions = {
          strategy: affirmative
        };

        const adm = new AccessDecisionManager(
          mockUser,
          mockVoters,
          mockContext,
          mockOptions
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
          voteOnAttribute: () => {
            throw new Error('Uhh oh');
          },
        };
        const mockVoters = [syncErrorVoter];
        const mockOptions = {
          strategy: affirmative
        };

        const adm = new AccessDecisionManager(
          mockUser,
          mockVoters,
          mockContext,
          mockOptions
        );

        const result = await adm.isGranted('SOME-ATTRIBUTE', 'SOME-SUBJECT');
        expect(result).toBe(false);
      });

      it("returns true when at least one voter is true and another voter's `voteOnAttribute` method throws an error", async () => {
        const mockUser = undefined;
        const mockContext = undefined;

        const syncErrorVoter: Voter = {
          supports: () => true,
          voteOnAttribute: () => {
            throw new Error('Uhh oh');
          },
        };
        const asyncTrueVoter: Voter = {
          supports: () => true,
          voteOnAttribute: () => Promise.resolve(true),
        };
        const asyncFalseVoter: Voter = {
          supports: () => true,
          voteOnAttribute: () =>
            new Promise((resolve) => {
              setImmediate(() => resolve(false));
            }),
        };

        const mockVoters = [syncErrorVoter, asyncFalseVoter, asyncTrueVoter];
        const mockOptions = {
          strategy: affirmative
        };

        const adm = new AccessDecisionManager(
          mockUser,
          mockVoters,
          mockContext,
          mockOptions
        );

        const result = await adm.isGranted('SOME-ATTRIBUTE', 'SOME-SUBJECT');
        expect(result).toBe(true);
      });
    });
  });
});
