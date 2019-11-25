import { Strategy } from '../strategy';

const affirmative: Strategy = async (
  voters,
  attribute,
  subject,
  user,
  context,
) => {
  const results = await Promise.all(
    voters.map((voter): boolean | Promise<boolean> => {
      let ret;
      try {
        ret = voter.voteOnAttribute(attribute, subject, user, context);
      } catch (err) {
        ret = false;
        console.error(err); // eslint-disable-line no-console
      }
      return ret;
    }),
  );

  return results.some(Boolean);
};

export default affirmative;
