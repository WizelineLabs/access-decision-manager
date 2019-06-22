// eslint-disable-next-line import/no-extraneous-dependencies
import { Response } from 'express';

function mockResponse(): Partial<Response> {
  const response: Partial<Response> = {
    end: jest.fn().mockImplementation(
      (): Partial<Response> => {
        return response;
      },
    ),
    json: jest.fn().mockImplementation(
      (): Partial<Response> => {
        return response;
      },
    ),
    location: jest.fn().mockImplementation(
      (): Partial<Response> => {
        return response;
      },
    ),
    status: jest.fn().mockImplementation(
      (): Partial<Response> => {
        return response;
      },
    ),
    send: jest.fn().mockImplementation(
      (): Partial<Response> => {
        return response;
      },
    ),
  };

  return response;
}

export default mockResponse;
