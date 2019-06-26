import { Voter } from '@wizeline/access-decision-manager';
import publicVoter from './public.voter';
import privateVoter from './private.voter';

type Options = Parameters<typeof publicVoter>[0]

const voterFactory = (options: Options): Voter[] => {
  return [
    publicVoter(options),
    privateVoter(options),
  ];
};

export default voterFactory;
