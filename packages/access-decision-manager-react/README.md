[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)    [![build](https://img.shields.io/travis/wizeline/access-decision-manager/master.svg)](https://travis-ci.org/wizeline/access-decision-manager)


 # Access Decision Manager - React.


Determines whether or not an entity is entitled to perform a certain action,
for example, request a certain URI or modify a certain object. It relies on
[access-decision-manager](https://github.com/wizeline/access-decision-manager/tree/master/packages/access-decision-manager#readme), and to make a positive verdict, it is sufficient to have the approval
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


 For example, the following voter checks attributes related to a public resources and private ones:

 ``` typescript
import { Voter } from '@wizeline/access-decision-manager-react';

const supportedAttributes = [
  'GET_PUBLIC'
];

const publicVoter = {
  supports(attribute): boolean {
    return supportedAttributes.includes(attribute);
  },
  voteOnAttribute(attribute, subject, user): boolean {
    // Do the logic here to validate determine if has permissions.
    return true;
  }
}

export default publicVoter;

 ```


 ```typescript
import { Voter } from '@wizeline/access-decision-manager-react';

const supportedAttributes = [
  "GET_PRIVATE"
];

const privateVoter = {
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

export default privateVoter;

```

Then let's add our voters to our react application, here we are assuming that we have the data of our user in the `<ProvideUser>` component.


```typescript
import AccessDecisionManagerProvider, {Voter} from '@wizeline/access-decision-manager-react';
import express from 'express'
import publicVoter from '../path/to/voters';
import privateVoter from '../path/to/voters';

const voters: Voter[] = [
    publicVoter,
    privateVoter
];




const App: React.FC = () => {
  return (
      <ProvideUser>
          <AccessDecisionManagerProvider user={user} voters={voters({})}>
          </AccessDecisionManagerProvider>
      </ProvideUser>

  );
}

export default App;
```



Now add the middleware in the routers with their attributes

``` typescript
import React from 'react'
import { useIsGranted } from from '@wizeline/access-decision-manager-react';

const SecretComponent: React.FC =  () => {
    const canSeePrivate =  useIsGranted('GET_PRIVATE');
    const canSeePublic =  useIsGranted('GET_PUBLIC');

    //
```


The result of `useIsGranted([ATTRIBUTE]);` would have the next format

``
  error: undefined | Error,
  isGranted: undefined | boolean,
  loading: boolean,
``

Depending on the state of the right access determination


