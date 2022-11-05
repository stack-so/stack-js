import {
  initStack,
  LoggableActivityType,
  STACK_API_ENDPOINTS,
  STACK_CLIENT_ERRORS,
  StackClient,
} from '../src';

describe('index', () => {
  describe('Client', () => {
    const validKey = '123';
    // This is invalid, because it's an object containing the key.
    const invalidKey = { key: validKey };

    describe('constructor', () => {
      describe('when no key is given', () => {
        it(`should throw this error: \n\t\t${STACK_CLIENT_ERRORS.NO_API_KEY_PROVIDED}`, () => {
          expect(() => {
            // @ts-ignore
            initStack();
          }).toThrow(STACK_CLIENT_ERRORS.NO_API_KEY_PROVIDED);
        });

        describe('when an invalid key is given', () => {
          it(`should throw this error: \n\t\t${STACK_CLIENT_ERRORS.INVALID_API_KEY}`, () => {
            expect(() => {
              // @ts-ignore
              initStack(invalidKey);
            }).toThrow(STACK_CLIENT_ERRORS.INVALID_API_KEY);
          });
        });

        describe('when given a valid key', () => {
          it('should not throw', () => {
            expect(() => {
              initStack(validKey);
            }).not.toThrow(STACK_CLIENT_ERRORS.INVALID_API_KEY);
          });

          it('should return a valid client with the key set', () => {
            const client = initStack(validKey);

            expect(client).toMatchObject({ config: { key: validKey } });
          });
        });
      });

      describe('query', () => {
        let client: StackClient;

        beforeAll(() => {
          client = initStack(validKey);
        });

        beforeEach(() => {
          // @ts-ignore
          global.fetch = jest.fn(() => {
            return Promise.resolve({
              json: () => Promise.resolve({ success: true }),
            });
          });
        });

        beforeEach(async () => {
          await client.query();
        });

        it('calls the api', () => {
          // Only gets called once.
          expect(fetch).toHaveBeenCalledTimes(1);
          // Gets called with the expected properties.
          expect(fetch).toHaveBeenCalledWith(STACK_API_ENDPOINTS.QUERY, {
            headers: {
              Authorization: `Bearer ${validKey}`,
              'Content-Type': 'application/json',
            },
            method: 'GET',
          });
        });
      });

      describe('track', () => {
        const validType = 'CONNECT_WALLET';
        let client: StackClient;

        beforeAll(() => {
          client = initStack(validKey);
        });

        beforeEach(() => {
          // @ts-ignore
          global.fetch = jest.fn(() => {
            return Promise.resolve({
              json: () => Promise.resolve({ success: true }),
            });
          });
        });

        describe('when not given any type', () => {
          it(`throws this error: ${STACK_CLIENT_ERRORS.NO_ACTIVITY_TYPE_PROVIDED}`, async () => {
            await expect(async () => {
              // @ts-ignore
              await client.track();
            }).rejects.toThrow(STACK_CLIENT_ERRORS.NO_ACTIVITY_TYPE_PROVIDED);
          });
        });

        describe('when given an invalid type', () => {
          it(`throws this error: ${STACK_CLIENT_ERRORS.INVALID_ACTIVITY_TYPE_PROVIDED}`, async () => {
            await expect(async () => {
              // @ts-ignore
              await client.track(123);
            }).rejects.toThrow(
              STACK_CLIENT_ERRORS.INVALID_ACTIVITY_TYPE_PROVIDED
            );
          });
        });

        describe('when given a valid type', () => {
          let response: LoggableActivityType;

          beforeEach(async () => {
            response = await client.track(validType);
          });

          it('returns the full activity to log', () => {
            expect(response.type === validType);
            expect(typeof response.published === 'number');
          });

          it('sends the data to the API', () => {
            // Only gets called once.
            expect(fetch).toHaveBeenCalledTimes(1);
            // Gets called with the expected properties.
            expect(fetch).toHaveBeenCalledWith(STACK_API_ENDPOINTS.TRACK, {
              body: JSON.stringify(response),
              headers: {
                Authorization: `Bearer ${validKey}`,
                'Content-Type': 'application/json',
              },
              method: 'POST',
            });
          });
        });

        describe('when given a valid type and invalid activity', () => {
          it(`throws this error: ${STACK_CLIENT_ERRORS.INVALID_ACTIVITY_PROVIDED}`, async () => {
            await expect(async () => {
              await client.track(validType, {
                // @ts-ignore
                nothing: 'good will come of this',
              });
            }).rejects.toThrow(STACK_CLIENT_ERRORS.INVALID_ACTIVITY_PROVIDED);
          });
        });

        describe('when given a valid type and an actor and an object', () => {
          const validType = 'CONNECT_WALLET';
          const actor = {
            type: 'wallet',
            address: '0x375892Bb243D35E4c12e8a87b95e24F7F53d493E',
          };

          const object = {
            type: 'contract',
            address: '0xFB72CD75d0b9022810F7748Dd36D767836FBcBDE',
            id: 3,
          };

          let activity: LoggableActivityType;

          beforeEach(async () => {
            const response = await client.track(validType, {
              actor,
              object,
            });
            activity = response.activity;
          });

          it('returns the full activity to log', () => {
            expect(activity.type === validType);
            expect(typeof activity.published === 'number');
            expect(activity.actor).toMatchObject(actor);
            expect(activity.object).toMatchObject(object);
          });

          it('sends the data to the API', () => {
            // Only gets called once.
            expect(fetch).toHaveBeenCalledTimes(1);
            // Gets called with the expected properties.
            expect(fetch).toHaveBeenCalledWith(STACK_API_ENDPOINTS.TRACK, {
              body: JSON.stringify({ activity }),
              headers: {
                Authorization: `Bearer ${validKey}`,
                'Content-Type': 'application/json',
              },
              method: 'POST',
            });
          });
        });
      });
    });
  });
});
