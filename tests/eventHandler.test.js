const EventHandler = require('../src6/lib/eventHandler');
const createValidator = require('../src6/lib/validator');

describe('Event Handler Tests', () => {
  describe('Registration', () => {
    test('inits event', () => {
      const handler = new EventHandler();
      handler.initEvent('test');
      expect(handler._events).toBeTruthy();
      expect(handler._events).toMatchObject({ test: {} });
    });
    test('can register prevalidator for event', () => {
      const handler = new EventHandler();
      handler.registerPreValidator('ev1', () => {});
      expect(handler._events.ev1).toBeDefined();
      expect(handler._events.ev1.preValidators).toBeDefined();
      expect(handler._events.ev1.preValidators).toHaveLength(1);
    });
    test('can register prevalidator for existing event', () => {
      const handler = new EventHandler();
      handler.registerPreValidator('ev1', () => {});
      handler.registerPreValidator('ev1', () => {});
      expect(handler._events.ev1).toBeDefined();
      expect(handler._events.ev1.preValidators).toBeDefined();
      expect(handler._events.ev1.preValidators).toHaveLength(2);
    });

    test('can register postvalidator for event', () => {
      const handler = new EventHandler();
      handler.registerPostValidator('ev1', () => {});
      expect(handler._events.ev1).toBeDefined();
      expect(handler._events.ev1.postValidators).toBeDefined();
      expect(handler._events.ev1.postValidators).toHaveLength(1);
    });
    test('can register postvalidator for existing event', () => {
      const handler = new EventHandler();
      handler.registerPostValidator('ev1', () => {});
      handler.registerPostValidator('ev1', () => {});
      expect(handler._events.ev1).toBeDefined();
      expect(handler._events.ev1.postValidators).toBeDefined();
      expect(handler._events.ev1.postValidators).toHaveLength(2);
    });

    test('can register middleware for event', () => {
      const handler = new EventHandler();
      handler.registerMiddleware('ev1', () => {});
      expect(handler._events.ev1).toBeDefined();
      expect(handler._events.ev1.middlewares).toBeDefined();
      expect(handler._events.ev1.middlewares).toHaveLength(1);
    });
    test('can register middleware for existing event', () => {
      const handler = new EventHandler();
      handler.registerMiddleware('ev1', () => {});
      handler.registerMiddleware('ev1', () => {});
      expect(handler._events.ev1).toBeDefined();
      expect(handler._events.ev1.middlewares).toBeDefined();
      expect(handler._events.ev1.middlewares).toHaveLength(2);
    });

    test('can register handler for event', () => {
      const handler = new EventHandler();
      handler.registerHandler('ev1', () => {});
      expect(handler._events.ev1).toBeDefined();
      expect(handler._events.ev1.handlers).toBeDefined();
      expect(handler._events.ev1.handlers).toHaveLength(1);
    });
    test('can register handler for existing event', () => {
      const handler = new EventHandler();
      handler.registerHandler('ev1', () => {});
      handler.registerHandler('ev1', () => {});
      expect(handler._events.ev1).toBeDefined();
      expect(handler._events.ev1.handlers).toBeDefined();
      expect(handler._events.ev1.handlers).toHaveLength(2);
    });
  });

  describe('Prop Settings', () => {
    test('sets opts', () => {
      const handler = new EventHandler();
      const opts = { preFailFast: false, postFailFast: false, unknownActionMsg: 'test', ignoreUnregisteredEvents: false };
      handler.setOpts(opts);
      expect(handler._opts).toEqual(opts);
    });
    test('sets error handler', () => {
      const handler = new EventHandler();
      const errorHandler = () => {};
      handler.setErrorHandler(errorHandler);
      expect(handler._errorHandler).toEqual(errorHandler);
    });
  });

  describe('Validation Running Tests', () => {
    test('should fail fast if set', async () => {
      const handler = new EventHandler();
      const predicate1 = jest.fn().mockImplementation(() => true);
      const predicate2 = jest.fn().mockImplementation(() => false);
      const predicate3 = jest.fn().mockImplementation(() => true);
      const validator1 = createValidator(predicate1, 'test1');
      const validator2 = createValidator(predicate2, 'test2');
      const validator3 = createValidator(predicate3, 'test3');
      await handler._validate('test', [ validator1, validator2, validator3 ], [ 1, 2, 3 ], true);
      expect(predicate1).toHaveBeenCalledTimes(1);
      expect(predicate2).toHaveBeenCalledTimes(1);
      expect(predicate3).not.toHaveBeenCalled();
    });
    test('should not fail fast if not set', async () => {
      const handler = new EventHandler();
      const predicate1 = jest.fn().mockImplementation(() => true);
      const predicate2 = jest.fn().mockImplementation(() => false);
      const predicate3 = jest.fn().mockImplementation(() => true);
      const validator1 = createValidator(predicate1, 'test1');
      const validator2 = createValidator(predicate2, 'test2');
      const validator3 = createValidator(predicate3, 'test3');
      await handler._validate('test', [ validator1, validator2, validator3 ], [ 1, 2, 3 ], false);
      expect(predicate1).toHaveBeenCalledTimes(1);
      expect(predicate2).toHaveBeenCalledTimes(1);
      expect(predicate3).toHaveBeenCalledTimes(1);
    });
    test('should call error handler on validate if specified', async () => {
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler, { ignoreUnregisteredEvents: false });
      const predicate1 = jest.fn().mockImplementation(() => false);
      const predicate2 = jest.fn().mockImplementation(() => false);
      const validator1 = createValidator(predicate1, 'test1');
      const validator2 = createValidator(predicate2, 'test2');
      await handler._validate('test', [ validator1, validator2 ], [ 1, 2, 3 ], false);
      expect(errorHandler).toHaveBeenCalledTimes(1);
    });
    test('should not call error handler on unregistered event if not specified', async () => {
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler);
      await handler.handle('test');
      expect(errorHandler).not.toHaveBeenCalled();
    });
    test('should call error handler on unregistered event if specified', async () => {
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler, { ignoreUnregisteredEvents: false });
      await handler.handle('test');
      expect(errorHandler).toHaveBeenCalledTimes(1);
    });
    test('fails if one test fails', async () => {
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler);
      const predicate1 = jest.fn().mockImplementation(() => true);
      const predicate2 = jest.fn().mockImplementation(() => false);
      const predicate3 = jest.fn().mockImplementation(() => true);
      const validator1 = createValidator(predicate1, 'test1');
      const validator2 = createValidator(predicate2, 'test2');
      const validator3 = createValidator(predicate3, 'test3');
      const res = await handler._validate('test', [ validator1, validator2, validator3 ], [], false);
      expect(res).toBe(false);
    });
    test('succeeds if all tests succeed', async () => {
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler);
      const predicate1 = jest.fn().mockImplementation(() => true);
      const predicate2 = jest.fn().mockImplementation(() => true);
      const predicate3 = jest.fn().mockImplementation(() => true);
      const validator1 = createValidator(predicate1, 'test1');
      const validator2 = createValidator(predicate2, 'test2');
      const validator3 = createValidator(predicate3, 'test3');
      const res = await handler._validate('test', [ validator1, validator2, validator3 ], [], false);
      expect(res).toBe(true);
    });
    test('respects function ordering odd mix async sync', async () => {
      const arr = [];
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler);
      const predicate1 = jest.fn().mockImplementation(() => { arr.push(1); return true; });
      const predicate2 = jest.fn().mockImplementation(async () => { arr.push(2); return true; });
      const predicate3 = jest.fn().mockImplementation(() => { arr.push(3); return true; });
      const predicate4 = jest.fn().mockImplementation(async () => { arr.push(4); return true; });
      const validator1 = createValidator(predicate1, 'test1');
      const validator2 = createValidator(predicate2, 'test2');
      const validator3 = createValidator(predicate3, 'test3');
      const validator4 = createValidator(predicate4, 'test4');
      await handler._validate('test', [ validator1, validator2, validator3, validator4 ], [], false);
      expect(predicate1).toHaveBeenCalledTimes(1);
      expect(predicate2).toHaveBeenCalledTimes(1);
      expect(predicate3).toHaveBeenCalledTimes(1);
      expect(predicate4).toHaveBeenCalledTimes(1);
      expect(arr).toEqual([ 1, 2, 3, 4 ]);
    });
    test('respects function ordering even mix async sync', async () => {
      const arr = [];
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler);
      const predicate1 = jest.fn().mockImplementation(async () => { arr.push(1); return true; });
      const predicate2 = jest.fn().mockImplementation(() => { arr.push(2); return true; });
      const predicate3 = jest.fn().mockImplementation(async () => { arr.push(3); return true; });
      const predicate4 = jest.fn().mockImplementation(() => { arr.push(4); return true; });
      const validator1 = createValidator(predicate1, 'test1');
      const validator2 = createValidator(predicate2, 'test2');
      const validator3 = createValidator(predicate3, 'test3');
      const validator4 = createValidator(predicate4, 'test4');
      await handler._validate('test', [ validator1, validator2, validator3, validator4 ], [], false);
      expect(predicate1).toHaveBeenCalledTimes(1);
      expect(predicate2).toHaveBeenCalledTimes(1);
      expect(predicate3).toHaveBeenCalledTimes(1);
      expect(predicate4).toHaveBeenCalledTimes(1);
      expect(arr).toEqual([ 1, 2, 3, 4 ]);
    });
    test('respects function ordering sync only', async () => {
      const arr = [];
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler);
      const predicate1 = jest.fn().mockImplementation(() => { arr.push(1); return true; });
      const predicate2 = jest.fn().mockImplementation(() => { arr.push(2); return true; });
      const predicate3 = jest.fn().mockImplementation(() => { arr.push(3); return true; });
      const predicate4 = jest.fn().mockImplementation(() => { arr.push(4); return true; });
      const validator1 = createValidator(predicate1, 'test1');
      const validator2 = createValidator(predicate2, 'test2');
      const validator3 = createValidator(predicate3, 'test3');
      const validator4 = createValidator(predicate4, 'test4');
      await handler._validate('test', [ validator1, validator2, validator3, validator4 ], [], false);
      expect(predicate1).toHaveBeenCalledTimes(1);
      expect(predicate2).toHaveBeenCalledTimes(1);
      expect(predicate3).toHaveBeenCalledTimes(1);
      expect(predicate4).toHaveBeenCalledTimes(1);
      expect(arr).toEqual([ 1, 2, 3, 4 ]);
    });
    test('respects function ordering async only', async () => {
      const arr = [];
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler);
      const predicate1 = jest.fn().mockImplementation(async () => { arr.push(1); return true; });
      const predicate2 = jest.fn().mockImplementation(async () => { arr.push(2); return true; });
      const predicate3 = jest.fn().mockImplementation(async () => { arr.push(3); return true; });
      const predicate4 = jest.fn().mockImplementation(async () => { arr.push(4); return true; });
      const validator1 = createValidator(predicate1, 'test1');
      const validator2 = createValidator(predicate2, 'test2');
      const validator3 = createValidator(predicate3, 'test3');
      const validator4 = createValidator(predicate4, 'test4');
      await handler._validate('test', [ validator1, validator2, validator3, validator4 ], [], false);
      expect(predicate1).toHaveBeenCalledTimes(1);
      expect(predicate2).toHaveBeenCalledTimes(1);
      expect(predicate3).toHaveBeenCalledTimes(1);
      expect(predicate4).toHaveBeenCalledTimes(1);
      expect(arr).toEqual([ 1, 2, 3, 4 ]);
    });
    test('fails fast with async', async () => {
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler);
      const predicate1 = jest.fn().mockImplementation(async () => true);
      const predicate2 = jest.fn().mockImplementation(async () => false);
      const predicate3 = jest.fn().mockImplementation(async () => true);
      const predicate4 = jest.fn().mockImplementation(async () => true);
      const validator1 = createValidator(predicate1, 'test1');
      const validator2 = createValidator(predicate2, 'test2');
      const validator3 = createValidator(predicate3, 'test3');
      const validator4 = createValidator(predicate4, 'test4');
      await handler._validate('test', [ validator1, validator2, validator3, validator4 ], [], true);
      expect(predicate1).toHaveBeenCalledTimes(1);
      expect(predicate2).toHaveBeenCalledTimes(1);
      expect(predicate3).not.toHaveBeenCalled();
      expect(predicate4).not.toHaveBeenCalled();
    });
  });
  describe('handling callers return types', () => {
    test('prevalidate', () => {
      const handler = new EventHandler();
      handler.initEvent('tev');
      const res = handler._preValidate('tev');
      expect(res).toBeInstanceOf(Promise);
    });
    test('postvalidate', () => {
      const handler = new EventHandler();
      handler.initEvent('tev');
      const res = handler._postValidate('tev');
      expect(res).toBeInstanceOf(Promise);
    });
    test('middlewares', () => {
      const handler = new EventHandler();
      handler.initEvent('tev');
      const res = handler._applyMiddlewares('tev');
      expect(res).toBeInstanceOf(Promise);
    });
    test('handlers', () => {
      const handler = new EventHandler();
      handler.initEvent('tev');
      const res = handler._applyHandlers('tev');
      expect(res).toBeInstanceOf(Promise);
    });
  });
  describe('Handling Tests', () => {
    test('catches handler errors', async () => {
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler);
      const handler1 = () => new Promise((resolve, reject) => { reject(new Error('testerr')); });
      handler.registerHandler('testev', handler1);
      await handler.handle('testev');
      expect(errorHandler).toHaveBeenCalled();
    });
    test('executes a valid full run', async () => {
      const arr = [];
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler);
      const predicate1 = jest.fn().mockImplementation(() => { arr.push(1); return true; });
      const predicate2 = jest.fn().mockImplementation(async () => { arr.push(2); return true; });
      const predicate3 = jest.fn().mockImplementation(() => { arr.push(5); return true; });
      const predicate4 = jest.fn().mockImplementation(async () => { arr.push(6); return true; });
      const validator1 = createValidator(predicate1, 'test1');
      const validator2 = createValidator(predicate2, 'test2');
      const validator3 = createValidator(predicate3, 'test3');
      const validator4 = createValidator(predicate4, 'test4');
      const middleware1 = jest.fn().mockImplementation(async () => { arr.push(3); });
      const middleware2 = jest.fn().mockImplementation(() => { arr.push(4); });
      const handler1 = jest.fn().mockImplementation(() => { arr.push(7); });
      const handler2 = jest.fn().mockImplementation(() => { arr.push(8); });
      handler.registerPreValidator('test', validator1, validator2);
      handler.registerPostValidator('test', validator3, validator4);
      handler.registerMiddleware('test', middleware1, middleware2);
      handler.registerHandler('test', handler1, handler2);
      await handler.handle('test');
      expect(predicate1).toHaveBeenCalledTimes(1);
      expect(predicate2).toHaveBeenCalledTimes(1);
      expect(predicate3).toHaveBeenCalledTimes(1);
      expect(predicate4).toHaveBeenCalledTimes(1);
      expect(middleware1).toHaveBeenCalledTimes(1);
      expect(middleware2).toHaveBeenCalledTimes(1);
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
      expect(errorHandler).not.toHaveBeenCalled();
      expect(arr).toEqual([ 1, 2, 3, 4, 5, 6, 7, 8 ]);
    });
    test('fails if prevalidators fail', async () => {
      const arr = [];
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler, { preFailFast: true });
      const predicate1 = jest.fn().mockImplementation(() => { arr.push(1); return true; });
      const predicate2 = jest.fn().mockImplementation(async () => { arr.push(2); return false; });
      const predicate3 = jest.fn().mockImplementation(() => { arr.push(5); return true; });
      const predicate4 = jest.fn().mockImplementation(async () => { arr.push(6); return true; });
      const validator1 = createValidator(predicate1, 'test1');
      const validator2 = createValidator(predicate2, 'test2');
      const validator3 = createValidator(predicate3, 'test3');
      const validator4 = createValidator(predicate4, 'test4');
      const middleware1 = jest.fn().mockImplementation(async () => { arr.push(3); });
      const middleware2 = jest.fn().mockImplementation(() => { arr.push(4); });
      const handler1 = jest.fn().mockImplementation(() => { arr.push(7); });
      const handler2 = jest.fn().mockImplementation(() => { arr.push(8); });
      handler.registerPreValidator('test', validator1, validator2);
      handler.registerPostValidator('test', validator3, validator4);
      handler.registerMiddleware('test', middleware1, middleware2);
      handler.registerHandler('test', handler1, handler2);
      await handler.handle('test');
      expect(predicate1).toHaveBeenCalledTimes(1);
      expect(predicate2).toHaveBeenCalledTimes(1);
      expect(predicate3).not.toHaveBeenCalled();
      expect(predicate4).not.toHaveBeenCalled();
      expect(middleware1).not.toHaveBeenCalled();
      expect(middleware2).not.toHaveBeenCalled();
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
      expect(arr).toEqual([ 1, 2 ]);
      expect(errorHandler).toHaveBeenCalledTimes(1);
    });
    test('fails if postvalidators fail', async () => {
      const arr = [];
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler, { preFailFast: true });
      const predicate1 = jest.fn().mockImplementation(() => { arr.push(1); return true; });
      const predicate2 = jest.fn().mockImplementation(async () => { arr.push(2); return true; });
      const predicate3 = jest.fn().mockImplementation(() => { arr.push(5); return true; });
      const predicate4 = jest.fn().mockImplementation(async () => { arr.push(6); return false; });
      const validator1 = createValidator(predicate1, 'test1');
      const validator2 = createValidator(predicate2, 'test2');
      const validator3 = createValidator(predicate3, 'test3');
      const validator4 = createValidator(predicate4, 'test4');
      const middleware1 = jest.fn().mockImplementation(async () => { arr.push(3); });
      const middleware2 = jest.fn().mockImplementation(() => { arr.push(4); });
      const handler1 = jest.fn().mockImplementation(() => { arr.push(7); });
      const handler2 = jest.fn().mockImplementation(() => { arr.push(8); });
      handler.registerPreValidator('test', validator1, validator2);
      handler.registerPostValidator('test', validator3, validator4);
      handler.registerMiddleware('test', middleware1, middleware2);
      handler.registerHandler('test', handler1, handler2);
      await handler.handle('test');
      expect(predicate1).toHaveBeenCalledTimes(1);
      expect(predicate2).toHaveBeenCalledTimes(1);
      expect(predicate3).toHaveBeenCalledTimes(1);
      expect(predicate4).toHaveBeenCalledTimes(1);
      expect(middleware1).toHaveBeenCalledTimes(1);
      expect(middleware2).toHaveBeenCalledTimes(1);
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
      expect(arr).toEqual([ 1, 2, 3, 4, 5, 6 ]);
      expect(errorHandler).toHaveBeenCalledTimes(1);
    });
    test('maintains pipeline args integrity', async () => {
      const arr = [];
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler, { preFailFast: true });
      const predicate1 = jest.fn().mockImplementation(() => { arr.push(1); return true; });
      const predicate2 = jest.fn().mockImplementation(async () => { arr.push(2); return true; });
      const predicate3 = jest.fn().mockImplementation(() => { arr.push(5); return true; });
      const predicate4 = jest.fn().mockImplementation(async () => { arr.push(6); return true; });
      const validator1 = createValidator(predicate1, 'test1');
      const validator2 = createValidator(predicate2, 'test2');
      const validator3 = createValidator(predicate3, 'test3');
      const validator4 = createValidator(predicate4, 'test4');
      const middleware1 = jest.fn().mockImplementation(async () => { arr.push(3); });
      const middleware2 = jest.fn().mockImplementation(() => { arr.push(4); });
      const handler1 = jest.fn().mockImplementation(() => { arr.push(7); });
      const handler2 = jest.fn().mockImplementation(() => { arr.push(8); });
      handler.registerPreValidator('test', validator1, validator2);
      handler.registerPostValidator('test', validator3, validator4);
      handler.registerMiddleware('test', middleware1, middleware2);
      handler.registerHandler('test', handler1, handler2);
      await handler.handle('test', 1, 2, 3);
      expect(predicate1).toHaveBeenCalledWith(1, 2, 3);
      expect(predicate2).toHaveBeenCalledWith(1, 2, 3);
      expect(predicate3).toHaveBeenCalledWith(1, 2, 3);
      expect(predicate4).toHaveBeenCalledWith(1, 2, 3);
      expect(middleware1).toHaveBeenCalledWith(1, 2, 3);
      expect(middleware2).toHaveBeenCalledWith(1, 2, 3);
      expect(handler1).toHaveBeenCalledWith(1, 2, 3);
      expect(handler2).toHaveBeenCalledWith(1, 2, 3);
      expect(errorHandler).not.toHaveBeenCalled();
    });
    test('catches errors', async () => {
      const arr = [];
      const errorHandler = jest.fn();
      const handler = new EventHandler(errorHandler);
      const predicate1 = jest.fn().mockImplementation(() => { arr.push(1); return true; });
      const predicate2 = jest.fn().mockImplementation(async () => { arr.push(2); return true; });
      const predicate3 = jest.fn().mockImplementation(() => { arr.push(5); return true; });
      const predicate4 = jest.fn().mockImplementation(async () => { arr.push(6); return true; });
      const validator1 = createValidator(predicate1, 'test1');
      const validator2 = createValidator(predicate2, 'test2');
      const validator3 = createValidator(predicate3, 'test3');
      const validator4 = createValidator(predicate4, 'test4');
      const middleware1 = jest.fn().mockImplementation(async () => { arr.push(3); });
      const middleware2 = jest.fn().mockImplementation(() => { throw new Error('err'); });
      const handler1 = jest.fn().mockImplementation(() => { arr.push(7); });
      const handler2 = jest.fn().mockImplementation(() => { arr.push(8); });
      handler.registerPreValidator('test', validator1, validator2);
      handler.registerPostValidator('test', validator3, validator4);
      handler.registerMiddleware('test', middleware1, middleware2);
      handler.registerHandler('test', handler1, handler2);
      await handler.handle('test');
      expect(predicate1).toHaveBeenCalledTimes(1);
      expect(predicate2).toHaveBeenCalledTimes(1);
      expect(predicate3).not.toHaveBeenCalled();
      expect(predicate4).not.toHaveBeenCalled();
      expect(middleware1).toHaveBeenCalledTimes(1);
      expect(middleware2).toHaveBeenCalledTimes(1);
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
      expect(errorHandler).toHaveBeenCalledTimes(1);
    });
  });
});
