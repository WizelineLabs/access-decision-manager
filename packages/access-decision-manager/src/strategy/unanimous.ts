import { Strategy } from '../strategy';

const unanimous: Strategy = async (
  voters,
  attribute,
  subject,
  user,
  context,
) => {
  if(voters.length === 0) return false;
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

  return results.every(Boolean);
};

export default unanimous;
