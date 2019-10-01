// eslint-disable-next-line import/no-extraneous-dependencies
import { NextFunction, Request, Response } from 'express';
import AccessDecisionManager, { Voter } from '@wizeline/access-decision-manager/src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ADMArgumentFactory = (req: Request) => any;

const AccessDecisionManagerProvider = (
  getUser: ADMArgumentFactory,
  voters: Voter[],
  createContext?: ADMArgumentFactory,
): ((
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>) => async (req, _res, next): Promise<void> => {
  // Call a function to create a context if provided, otherwise fall back to a default context that contains only the request.
  const context =
    typeof createContext === 'function'
      ? createContext(req)
      : {
          req,
        };

  req.accessDecisionManager = new AccessDecisionManager(
    await getUser(req),
    voters,
    context,
  );
  next();
};

export default AccessDecisionManagerProvider;
