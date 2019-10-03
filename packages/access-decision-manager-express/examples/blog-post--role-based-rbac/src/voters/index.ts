import { Voter } from '@wizeline/access-decision-manager-express';
import unAuthenticatedUserVoter from './unAuthenticatedUserVoter';
import editorRoleVoter from './role-based/editor.voter';
import postOwnerVoter from "./attribute-based/owner.voter";

type Options = Parameters<typeof unAuthenticatedUserVoter>[0]

const voterFactory = (options: Options): Voter[] => {
  return [
    unAuthenticatedUserVoter(options),
    editorRoleVoter(options),
    postOwnerVoter(options),
  ];
};

export default voterFactory;
