import * as HTTPStatus from 'http-status-codes';
import isGrantedMiddleware from '../is-granted-middleware';
import mockResponse from '../../mockResponse';

describe('src', () => {
  describe('access-decision-manager-express', () => {
    describe('is-granted-middleware', () => {
      it('a request that is approved continues to the next middleware or controller', async () => {
        const req = {
          accessDecisionManager: {
            isGranted: () => Promise.resolve(true),
          },
        };
        const res = mockResponse();
        const next = jest.fn();
        const isGrantedMiddlewareFunction = isGrantedMiddleware(
          'SOME_ATTRIBUTE',
          () => {},
        );

        // @ts-ignore -- Intentionally not passing proper req, res and next
        await isGrantedMiddlewareFunction(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
      });

      it('should call next with HTTP FORBIDDEN_ERROR when a request that is not approved halts the execution and the request never reaches the controller', async () => {
        const req = {
          accessDecisionManager: {
            isGranted: () => Promise.resolve(false),
          },
        };
        const res = mockResponse();
        const next = jest.fn();
        const isGrantedMiddlewareFunction = isGrantedMiddleware(
          'SOME_ATTRIBUTE',
          () => {},
        );

        // @ts-ignore -- Intentionally not passing proper req, res and next
        await isGrantedMiddlewareFunction(req, res, next);

        expect(res.status).toHaveBeenCalledWith(HTTPStatus.FORBIDDEN);
        expect(res.end).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(HTTPStatus.FORBIDDEN);
      });

      it('should call next with HTTP INTERNAL_SERVER_ERROR when an error processing permissions occurs and the request never reaches the controller', async () => {
        const req = {
          accessDecisionManager: {
            isGranted: jest.fn().mockImplementation(async () => {
              throw new Error('Internal Server error');
            }),
          },
        };
        const res = mockResponse();
        const next = jest.fn();
        const isGrantedMiddlewareFunction = isGrantedMiddleware(
          'SOME_ATTRIBUTE',
          () => {},
        );

        const spy = jest
          .spyOn(global.console, 'error')
          .mockImplementation(() => {});

        // @ts-ignore -- Intentionally not passing proper req, res and next
        await isGrantedMiddlewareFunction(req, res, next);

        expect(global.console.error).toHaveBeenCalledTimes(1);

        expect(res.status).toHaveBeenCalledWith(
          HTTPStatus.INTERNAL_SERVER_ERROR,
        );
        expect(res.end).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(HTTPStatus.INTERNAL_SERVER_ERROR);

        spy.mockRestore();
      });
    });
  });
});
