import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  it('should format log message as JSON string with required fields', () => {
    const logger = new JsonLogger();

    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    logger.log('hello', 'ctx');

    expect(spy).toHaveBeenCalledTimes(1);

    const [payload] = spy.mock.calls[0] as unknown as [string];

    const parsed = JSON.parse(payload);

    expect(parsed).toMatchObject({
      level: 'log',
      message: 'hello',
    });

    expect(Array.isArray(parsed.optionalParams)).toBe(true);
    expect(parsed.optionalParams[0]).toBe('ctx');

    expect(typeof parsed.timestamp).toBe('string');

    spy.mockRestore();
  });

  it('should write error level to console.error', () => {
    const logger = new JsonLogger();

    const spy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    logger.error('boom');

    expect(spy).toHaveBeenCalledTimes(1);

    const [payload] = spy.mock.calls[0] as unknown as [string];
    const parsed = JSON.parse(payload);

    expect(parsed.level).toBe('error');
    expect(parsed.message).toBe('boom');

    spy.mockRestore();
  });
});
