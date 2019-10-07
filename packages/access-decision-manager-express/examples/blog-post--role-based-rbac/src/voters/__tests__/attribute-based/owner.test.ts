import { AccessDecisionManager } from '@wizeline/access-decision-manager-express';
import voterFactory from '../../index';
import ATTRIBUTES from "../../../attributes";

describe('server', () => {
    describe('voters', () => {
      describe('attribute-based', () => {
        describe('owner', () => {
          describe('delete', () => {
            it('can delete a post if the user is the owner of the post', async () => {
              const mockUser = {
                userId: 1,
              };
              const mockVoterOpcs = {};
              const mockContext = {};
              const mockSubject = {
                authorId: 1
              };

              // @ts-ignore -- Intentionally not passing full options
              const voters = voterFactory(mockVoterOpcs);
              const adm = new AccessDecisionManager(mockUser, voters, mockContext);

              expect(await adm.isGranted(ATTRIBUTES.DELETE_POST, mockSubject)).toBe(true);
            });

            it('can not a delete post if the user is not the owner of the post', async () => {
              const mockUser = {
                userId: 2,
              };
              const mockVoterOpcs = {};
              const mockContext = {};
              const mockSubject = {
                authorId: 1
              };

              // @ts-ignore -- Intentionally not passing full options
              const voters = voterFactory(mockVoterOpcs);
              const adm = new AccessDecisionManager(mockUser, voters, mockContext);

              expect(await adm.isGranted(ATTRIBUTES.DELETE_POST, mockSubject)).toBe(false);
            });
          });

          describe('edit', () => {
            it('can edit a if the user is the owner of the post', async () => {
              const mockUser = {
                userId: 1,
              };
              const mockVoterOpcs = {};
              const mockContext = {};
              const mockSubject = {
                authorId: 1
              };
              // @ts-ignore -- Intentionally not passing full options
              const voters = voterFactory(mockVoterOpcs);
              const adm = new AccessDecisionManager(mockUser, voters, mockContext);

              expect(await adm.isGranted(ATTRIBUTES.EDIT_POST, mockSubject)).toBe(true);
            });

            it('can not edit a if the user is not the owner of the post', async () => {
              const mockUser = {
                userId: 2,
              };
              const mockVoterOpcs = {};
              const mockContext = {};
              const mockSubject = {
                authorId: 1
              };
              // @ts-ignore -- Intentionally not passing full options
              const voters = voterFactory(mockVoterOpcs);
              const adm = new AccessDecisionManager(mockUser, voters, mockContext);

              expect(await adm.isGranted(ATTRIBUTES.EDIT_POST, mockSubject)).toBe(false);
            });
          });
        });
      });
    });
});
