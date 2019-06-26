import AccessDecisionManager from '@wizeline/access-decision-manager';
import voterFactory from '../index';
import ATTRIBUTES from '../../attributes';

describe('server', () => {
    describe('voters', () => {
        it('returns false to deny access', async () => {
          const mockUser = undefined;
          const mockVoterOpcs = {};
          const mockContext = {};
          // @ts-ignore -- Intentionally not passing full options
          const voters = voterFactory(mockVoterOpcs);
          const adm = new AccessDecisionManager(mockUser, voters, mockContext);

          expect(await adm.isGranted(ATTRIBUTES.CLOSE_RESOURCE_GET)).toBe(false);
        });
    });
});
