import AccessDecisionManagerProvider, { isGrantedMiddleware } from '@wizeline/access-decision-manager-express';
import voters from './voters'
import ATTRIBUTES from './attributes';

import express = require('express');

// Create a new express application instance
const app: express.Application = express();

const user = {
  userId: 1,
  attributes: {
    role: 'editor'
  }
};

app.use(AccessDecisionManagerProvider((req) => user, voters({})));

app.get('/',
  isGrantedMiddleware(ATTRIBUTES.GET_ALL_POST),
  (req, res) => {
    res.send('res send something');
  }
);

app.post('posts/',
  isGrantedMiddleware(ATTRIBUTES.CREATE_POST),
  (req, res) => {
    res.send('post created');
  }
);

app.patch('posts/:id',
  isGrantedMiddleware(ATTRIBUTES.EDIT_POST),
  (req, res) => {
    res.send('post edited');
  }
);

app.delete('posts/:id',
  isGrantedMiddleware(ATTRIBUTES.DELETE_POST),
  (req, res) => {
    res.send('res send something');
  }
);

app.get('posts/:id',
  isGrantedMiddleware(ATTRIBUTES.GET_ONE_POST),
  (req, res) => {
    res.send('res send something');
  }
);


app.listen(3000, function () {
  console.log('app listening on port 3000!');
});
