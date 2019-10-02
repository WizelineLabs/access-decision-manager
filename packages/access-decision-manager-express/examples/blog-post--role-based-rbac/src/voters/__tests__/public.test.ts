import { AccessDecisionManager } from '@wizeline/access-decision-manager-express';
import voterFactory from '../index';
import ATTRIBUTES from '../../attributes';

describe('server', () => {
    describe('voters', () => {
      describe('public', () => {
        it('can get the root page', async () => {
          const mockUser = undefined;
          const mockVoterOpcs = {};
          const mockContext = {};
          // @ts-ignore -- Intentionally not passing full options
          const voters = voterFactory(mockVoterOpcs);
          const adm = new AccessDecisionManager(mockUser, voters, mockContext);

          expect(await adm.isGranted(ATTRIBUTES.PUBLIC)).toBe(true);
        });

        describe('posts', () => {
          it('can get a single post', async () => {
            const mockUser = undefined;
            const mockVoterOpcs = {};
            const mockContext = {};
            // @ts-ignore -- Intentionally not passing full options
            const voters = voterFactory(mockVoterOpcs);
            const adm = new AccessDecisionManager(mockUser, voters, mockContext);

            expect(await adm.isGranted(ATTRIBUTES.GET_ONE_POST)).toBe(true);
          });

          it('can get all the single posts', async () => {
            const mockUser = undefined;
            const mockVoterOpcs = {};
            const mockContext = {};
            // @ts-ignore -- Intentionally not passing full options
            const voters = voterFactory(mockVoterOpcs);
            const adm = new AccessDecisionManager(mockUser, voters, mockContext);

            expect(await adm.isGranted(ATTRIBUTES.GET_ALL_POST)).toBe(true);
          });
        });
      })
    });
});
