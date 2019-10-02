import { Voter } from '@wizeline/access-decision-manager-express';
import publicVoter from './public.voter';
import editorRoleVoter from './role-based/editor.voter';

type Options = Parameters<typeof publicVoter>[0]

const voterFactory = (options: Options): Voter[] => {
  return [
    publicVoter(options),
    editorRoleVoter(options),
  ];
};

export default voterFactory;
