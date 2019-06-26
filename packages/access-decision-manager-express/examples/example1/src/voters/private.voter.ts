import { Voter } from '@wizeline/access-decision-manager';

const supportedAttributes = [
  "GET_PRIVATE"
];

const publicVoter = (
  _options: {}, // eslint-disable-line @typescript-eslint/no-unused-vars
): Voter => {
  const supports = (attribute): boolean => {
    return supportedAttributes.includes(attribute);
  };

  const voteOnAttribute = (_attribute, subject, user): boolean => {
    // do the logic here to validate determine if has permissions.. maybe
    // return user.username === 'admin'
    return false;
  };

  return {
    supports,
    voteOnAttribute,
  };
};

export default publicVoter;
