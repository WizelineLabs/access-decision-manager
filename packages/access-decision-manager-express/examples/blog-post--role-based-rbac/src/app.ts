import AccessDecisionManagerProvider, {isGrantedMiddleware} from '@wizeline/access-decision-manager-express';
import voters from './voters'
import ATTRIBUTES from './attributes';
import database from './database';

import express = require('express');

// Create a new express application instance
const app: express.Application = express();

const users = {
  editorUser: {
    userId: 1,
    attributes: {
      role: 'editor'
    }
  },
};

// app.use(AccessDecisionManagerProvider((req) => user, voters({})));

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
  isGrantedMiddleware(ATTRIBUTES.EDIT_POST),
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
  isGrantedMiddleware(ATTRIBUTES.DELETE_POST),
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


app.listen(3000, function () {
  console.log('app listening on port 3000!');
});
