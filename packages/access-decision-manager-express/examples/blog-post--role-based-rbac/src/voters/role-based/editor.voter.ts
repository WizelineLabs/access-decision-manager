import {Voter} from '@wizeline/access-decision-manager-express';
import ATTRIBUTES from '../../attributes';

const supportedAttributes = [
  ATTRIBUTES.CREATE_POST,
  ATTRIBUTES.DELETE_POST,
  ATTRIBUTES.EDIT_POST,
];

const editorRoleVoter = (
  _options: {}, // eslint-disable-line @typescript-eslint/no-unused-vars
): Voter => {
  const supports = (attribute): boolean => {
    return supportedAttributes.includes(attribute);
  };

  const voteOnAttribute = (_attribute, subject, user): boolean => {
    return user.attributes.role === 'editor';
  };

  return {
    supports,
    voteOnAttribute,
  };
};

export default editorRoleVoter;
