import { AccessDecisionManager } from '@wizeline/access-decision-manager-express';
import voterFactory from '../../index';
import ATTRIBUTES from "../../../attributes";

describe('server', () => {
    describe('voters', () => {
      describe('role-based', () => {
        describe('editor', () => {
          describe('create', () => {
            it('can create a new post if has the `editor` role attribute', async () => {
              const mockUser = {
                userId: 1,
                attributes: {
                  role: 'editor'
                }
              };
              const mockVoterOpcs = {};
              const mockContext = {};
              // @ts-ignore -- Intentionally not passing full options
              const voters = voterFactory(mockVoterOpcs);
              const adm = new AccessDecisionManager(mockUser, voters, mockContext);

              expect(await adm.isGranted(ATTRIBUTES.CREATE_POST)).toBe(true);
            });
            it('can not create a new post if does not have the `editor` role attribute', async () => {
              const mockUser = {
                userId: 1,
                attributes: {
                  role: 'visitor'
                }
              };
              const mockVoterOpcs = {};
              const mockContext = {};
              // @ts-ignore -- Intentionally not passing full options
              const voters = voterFactory(mockVoterOpcs);
              const adm = new AccessDecisionManager(mockUser, voters, mockContext);

              expect(await adm.isGranted(ATTRIBUTES.CREATE_POST)).toBe(false);
            });
          });

          describe('delete', () => {
            it('can delete post any if has the `editor` role attribute', async () => {
              const mockUser = {
                userId: 1,
                attributes: {
                  role: 'editor'
                }
              };
              const mockVoterOpcs = {};
              const mockContext = {};
              // @ts-ignore -- Intentionally not passing full options
              const voters = voterFactory(mockVoterOpcs);
              const adm = new AccessDecisionManager(mockUser, voters, mockContext);

              expect(await adm.isGranted(ATTRIBUTES.DELETE_POST)).toBe(true);
            });
          });

          describe('edit', () => {
            it('can edit post any if has the `editor` role attribute', async () => {
              const mockUser = {
                userId: 1,
                attributes: {
                  role: 'editor'
                }
              };
              const mockVoterOpcs = {};
              const mockContext = {};
              // @ts-ignore -- Intentionally not passing full options
              const voters = voterFactory(mockVoterOpcs);
              const adm = new AccessDecisionManager(mockUser, voters, mockContext);

              expect(await adm.isGranted(ATTRIBUTES.EDIT_POST)).toBe(true);
            });
          });
        });
      });
    });
});
