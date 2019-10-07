import { Voter } from '@wizeline/access-decision-manager-express';
import editorRoleVoter from './role-based/editor.voter';
import postOwnerVoter from "./attribute-based/owner.voter";
import unauthenticatedUserVoter from './unauthenticated-user.voter';

type Options = Parameters<typeof editorRoleVoter>[0] &
                Parameters<typeof postOwnerVoter>[0] &
                Parameters<typeof unauthenticatedUserVoter>[0]

const voterFactory = (options: Options): Voter[] => {
  return [
    unauthenticatedUserVoter(options),
    editorRoleVoter(options),
    postOwnerVoter(options),
  ];
};

export default voterFactory;
