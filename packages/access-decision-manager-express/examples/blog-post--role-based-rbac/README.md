 # Access Decision Manager - Express   -- blog post.

This repo is intended to simulate the logic of a blog post. This example has 3 different user personas


* Unauthenticated user (can see articles)
* An Editor (can edit/delete any articles)
* Owner of the article (can only edit/delete their own articles)


  ### Setup for this specific project (database and user mocks)
Here we are implementing an in-memory database to handle information but in a real world use case you could use a persistent database

``` typescript
    const posts = database([
      {
        id: 1,
        title: 'User 1\'s first post',
        authorId: 1,
      },
      {
        id: 2,
        title: 'User 2\'s first post',
        authorId: 2,
      },
    ]);
``` 


Since we are going to have user roles, then we are doing this mock implementation for users

``` typescript
app.use(AccessDecisionManagerProvider(
  /**
   * For this use case we will let the user specify an `Authorization` header
   * with their username, and use that to fetch the user.
   *
   * In a real world use case you could use a JWT or make a call to a database or
   * other location to fetch your user data.
   */
  (req) => users[req.headers.authorization],
  voters({})
));
```

This is an example of a request with the previous implementation

``` http request
curl \
  -i \
  -X PATCH \
  -H 'Authorization: editorUser' \
  -H 'Content-Type: application/json' \
  --data '{"title": "test", "authorId": 1}' \
  http://localhost:3000/1
```

  ### Voters

 For example, the following voter checks attributes related to an unauthenticated user:
 We can see that the supported attributes are `  ATTRIBUTES.GET_ONE_POST, ATTRIBUTES.GET_ALL_POST `
 
 #### Unauthenticated user
                                                 
 ``` typescript
import { Voter } from '@wizeline/access-decision-manager-express';
import ATTRIBUTES from '../attributes';

const supportedAttributes = [   // This are the attribute that is voter supports in the use case of wanting add more we should simply add another attribute here
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
    return true;   // Here we don't need more validations since we don't have a user
  };

  return {   // both of these conditions have to be true to grant access
    supports,
    voteOnAttribute,
  };
};

export default unAuthenticatedUserVoter;

 ```

examples of requests

``` http request
curl -X GET \
  http://localhost:3000/ \
  -H 'Content-Type: application/json' \

```

response
 
``` http request
 < HTTP/1.1 200 OK
 < X-Powered-By: Express
 < Content-Type: application/json; charset=utf-8
 < Content-Length: 105
 < ETag: W/"69-DsPrNTnylX0zZHtesmFZEvtob4k"
 < Date: Mon, 07 Oct 2019 15:53:02 GMT
 < Connection: keep-alive
 <
 * Connection #1 to host localhost left intact
 [{"id":1,"title":"User 1's first post","authorId":1},{"id":2,"title":"User 2's first post","authorId":2}]%
``` 
 
 #### Editor user
 
 ``` typescript
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
    if ((user && user.attributes && user.attributes.role)) { // Here 
      return user.attributes.role === 'editor';
    }
    return false;
  };

  return {
    supports,
    voteOnAttribute,
  };
};

export default editorRoleVoter;

```

Request (Observe that we are using a editor user with the Authorization header)

``` http request
curl \
  -i \
  -X PATCH \
  -H 'Authorization: editorUser' \
  -H 'Content-Type: application/json' \
  --data '{"title": "test", "authorId": 1}' \
  http://localhost:3000/1
```


 #### Owner of an article, example of a post being sent as a [subject](src/app.ts#L76)
 
 ``` typescript
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
    // here the subject of this voter is the post.
    return subject.authorId === user.userId;
  };

  return {
    supports,
    voteOnAttribute,
  };
};

export default postOwnerVoter;

```

Request (Observe that we are using a regular user with the Authorization header)

``` http request
   curl -X PATCH \
     http://localhost:3000/2 \
     -H 'Authorization: regularUser' \
     -H 'Content-Type: application/json' \
     -d '{
           "title": "test",
           "authorId": 2
   }'
```

### Usage of voters

Then let's add our voters to our express application, since we are going to have user roles, then we are doing this mock implementation for users


``` typescript
app.use(AccessDecisionManagerProvider(
  /**
   * For this use case we will let the user specify an `Authorization` header
   * with their username, and use that to fetch the user.
   *
   * In a real world use case you could use a JWT or make a call to a dabase or
   * other location to fetch your user data.
   */
  (req) => users[req.headers.authorization],
  voters({})
));
```



Now add the middleware in the routers with their attributes

``` typescript
import AccessDecisionManagerProvider, {isGrantedMiddleware} from '@wizeline/access-decision-manager-express';

const getPost = (req) => {  // this function helps to get an specific posts
  return posts.getOne(req.params.id);
};

app.get('/',
  isGrantedMiddleware(ATTRIBUTES.GET_ALL_POST),
  (req, res) => {
    res.json(posts.getAll());
  }
);

app.post('/',
  isGrantedMiddleware(ATTRIBUTES.CREATE_POST),
  express.json(),
  (req, res) => {
    const post = posts.create(req.body);

    res.location(`/${post.id}`);
    res.json(post);
  }
);

app.patch('/:id',
  isGrantedMiddleware(ATTRIBUTES.EDIT_POST, getPost), // here in the second parameter we are sending the post as a subject
  express.json(),
  (req, res) => {
    try {
      res.json(posts.update(req.params.id, req.body));
    } catch (error) {
      res.status(400);
      res.end();
    }
  }
);

app.delete('/:id',
  isGrantedMiddleware(ATTRIBUTES.DELETE_POST, getPost), // here in the second parameter we are sending the post as a subject
  (req, res) => {
    res.json(posts.delete(req.params.id));
  }
);

app.get('/:id',
  isGrantedMiddleware(ATTRIBUTES.GET_ONE_POST),
  (req, res) => {
    try {
      res.json(posts.getOne(req.params.id));
    } catch (error) {
      res.status(404);
      res.end();
    }
  }
);
```



