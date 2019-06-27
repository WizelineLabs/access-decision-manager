[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)    [![build](https://img.shields.io/travis/wizeline/access-decision-manager/master.svg)](https://travis-ci.org/wizeline/access-decision-manager)


# Access Decision Manager.


Determines whether or not an entity is entitled to perform a certain action,
for example, request a certain URI or modify a certain object. It relies on
Voters, and to make a positive verdict, it is sufficient to have the approval
of only one Voter. Voters are implemented by the client service.



### Implementing Voters

Voters are to determine access rights
The use of Voters to verify permissions is based on [this model](https://symfony.com/doc/current/security/voters.html).
Voters are called to grant access to a resource or an action.
 
 
 Adding a Custom Voter.
 
 
 To create a Voter,
use the `Voter` interface:

```typescript
export interface Voter {
  supports: (attribute: any, subject: any, context: any) => boolean;
  voteOnAttribute: (
    attribute: any,
    subject: any,
    user: any,
    context: any,
  ) => boolean | Promise<boolean>;
}
```

For example, the following voter checks attributes related to an admin:

```typescript
import { Voter } from '@wizeline/access-decision-manager';

const supportedAttributes = [
  "GET_PRIVATE"
];

const adminVoter = {
  supports(attribute): boolean {
    return supportedAttributes.includes(attribute);
  },
  voteOnAttribute(attribute, subject, user): boolean {
    // Do the logic here to validate determine if has permissions.
    return (
      user &&
      user.roles &&
      user.roles.includes('admin')
    );
  }
}

export default adminVoter;

```


### Related links

[Access Decision Manager Express](https://github.com/wizeline/access-decision-manager/tree/master/packages/access-decision-manager-express)
