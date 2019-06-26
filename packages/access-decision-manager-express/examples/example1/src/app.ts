import AccessDecisionManagerProvider, { isGrantedMiddleware } from '@wizeline/access-decision-manager-express';
import voters from './voters'
import ATTRIBUTES from './attributes';

import express = require('express');

// Create a new express application instance
const app: express.Application = express();


app.use(AccessDecisionManagerProvider((req) => req, voters({})));

app.get('/',
  isGrantedMiddleware(ATTRIBUTES.OPEN_RESOURCE_GET),
  (req, res) => {
    res.send('res send something');
  }
);

app.get('/private',
  isGrantedMiddleware(ATTRIBUTES.CLOSE_RESOURCE_GET),
  (req, res) => {
    res.send('sensitive information');
  }
);

app.listen(3000, function () {
  console.log('app listening on port 3000!');
});
