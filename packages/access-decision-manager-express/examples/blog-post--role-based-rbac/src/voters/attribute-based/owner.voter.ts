import {Voter} from '@wizeline/access-decision-manager-express';
import ATTRIBUTES from '../../attributes';

const supportedAttributes = [
  ATTRIBUTES.DELETE_POST,
  ATTRIBUTES.EDIT_POST,
];

const postOwnerVoter = (
  _options: {}, // eslint-disable-line @typescript-eslint/no-unused-vars
): Voter => {
  const supports = (attribute): boolean => {
    return supportedAttributes.includes(attribute);
  };

  const voteOnAttribute = (_attribute, subject, user): boolean => {
    // here the subject of this voter is the post
    if(!subject || !subject.authorId || !user || !user.userId){
      return false;
    }
    return subject.authorId === user.userId;
  };

  return {
    supports,
    voteOnAttribute,
  };
};

export default postOwnerVoter;
