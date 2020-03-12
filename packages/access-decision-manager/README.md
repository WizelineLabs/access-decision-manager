[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)    [![build](https://img.shields.io/travis/wizeline/access-decision-manager/master.svg)](https://travis-ci.org/wizeline/access-decision-manager)


# Access Decision Manager.


Determines whether or not an entity is entitled to perform a specific action,
for example, request a particular URI or modify a specific object. It relies on
Voters, all voters are called each time you use `isGranted()` method.

The Access Decision Manager takes the responses from all voters
and makes the final verdict (to allow or deny access to the resource)
according to the strategy defined in the application.

It recognizes several strategies:

`affirmative` (default)

grant access as soon as there is one voter granting access;

`unanimous`

only grant access if none of the voters has denied access;

`[custom]`

(any strategy can be defined and passed as an argument)


Usage


``` typescript
user:any = {}
voters:Voter[] = []
context:any = null,
options?: { strategy? = affirmative }

const accessDecisionManager = new AccessDecisionManager(user, voters, context, options)
// Since the default strategy is `affirmative` then the next line has the same result as the prevoius one
const accessDecisionManager = new AccessDecisionManager(user, voters, context)
```

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

Here's a detailed description of the two abstract methods:

`supports(attribute, subject, context)`
When `isGranted()` is called, the first argument is passed here as `attribute` (e.g. `ROLE_USER`, `edit`) and the second argument (if any) is passed as `subject` (e.g. `null`, a `Post` object).
Your job is to determine if your voter should vote on the attribute/subject combination. if you return true, `voteOnAttribute()` will be called. Otherwise, your voter is done:
some other voters should process this. The third argument, `context` is to help you to determine access rights, the access decision manager takes this argument when is created

`voteOnAttribue(attribute, subject, user, context)`
If you return `true` from `supports`, then this method is called. Your job is simple: return `true` to allow access and `false` to deny access. The `user` and `context` properties (if any) can be useful.


For example, the following voter checks attributes related to an admin:

Suppose you have a `Private` object, and you need to decide whether or not the current user can edit the resource.
The only users that can get that resource are the ones who are admins; also, you know that the users who are admins have a `roles` property, which includes `admin`.
So, it would be best if you created a new voter that validates what actions `supports` in this case `GET_PRIVATE`.
And that the `voteOnAttribute` validates that the user is an admin.

This voter can be named `admin.voter.ts` since it is the one which determines access for admin users.

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
