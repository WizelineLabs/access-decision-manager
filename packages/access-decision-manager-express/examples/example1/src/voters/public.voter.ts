import { Voter } from '@wizeline/access-decision-manager-express';
import ATTRIBUTES from '../attributes';

const supportedAttributes = [
  ATTRIBUTES.OPEN_RESOURCE_GET
];

const publicVoter = (
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

export default publicVoter;
