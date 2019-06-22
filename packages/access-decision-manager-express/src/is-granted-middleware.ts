import * as HTTPStatus from 'http-status-codes';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Request, Response, NextFunction } from 'express';

const isGrantedMiddleware = (
  attribute,
  subjectGetter?,
): ((
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>) => async (req, res, next): Promise<void> => {
  try {
    let subject;
    if (subjectGetter) {
      subject = await subjectGetter(req);
    }

    const isGranted = await req.accessDecisionManager.isGranted(
      attribute,
      subject,
    );
    if (!isGranted) {
      res.status(HTTPStatus.FORBIDDEN).end();
      next(HTTPStatus.FORBIDDEN);
      return;
    }
  } catch (e) {
    res.status(HTTPStatus.INTERNAL_SERVER_ERROR).end();
    // eslint-disable-next-line no-console
    console.error(e);
    next(HTTPStatus.INTERNAL_SERVER_ERROR);
    return;
  }
  next();
};

export default isGrantedMiddleware;
