import { Strategy } from '../types';

const affirmative: Strategy = async (
  voters,
  attribute,
  subject,
  user,
  context,
) => {
  const results = await Promise.all(
    voters.map((voter): boolean | Promise<boolean> =>
      voter.voteOnAttribute(attribute, subject, user, context),
    ),
  );

  return results.some(Boolean);
};

export default affirmative;
