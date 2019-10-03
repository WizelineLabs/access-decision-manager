import { Voter } from '@wizeline/access-decision-manager-express';
import ATTRIBUTES from '../attributes';

const supportedAttributes = [
  ATTRIBUTES.GET_ONE_POST,
  ATTRIBUTES.GET_ALL_POST
];

const unAuthenticatedUserVoter = (
  _options: {}, // eslint-disable-line @typescript-eslint/no-unused-vars
): Voter => {
  const supports = (attribute): boolean => {
    return supportedAttributes.includes(attribute);
  };

  const voteOnAttribute = (_attribute, subject, user): boolean => {
    return true;
  };

  return {
    supports,
    voteOnAttribute,
  };
};

export default unAuthenticatedUserVoter;
