import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  it('should format message as TSKV (tab-separated key=value)', () => {
    const logger = new TskvLogger();

    const spy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    logger.log('hello', 'ctx');

    expect(spy).toHaveBeenCalledTimes(1);

    const [line] = spy.mock.calls[0] as unknown as [string];

    expect(line).toContain('level=log');
    expect(line).toContain('message=hello');
    expect(line).toContain('params=');
    expect(line).toContain('timestamp=');

    expect(line).toContain('\t');

    spy.mockRestore();
  });

  it('should write error level to console.error', () => {
    const logger = new TskvLogger();

    const spy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    logger.error('boom');

    expect(spy).toHaveBeenCalledTimes(1);

    const [line] = spy.mock.calls[0] as unknown as [string];

    expect(line).toContain('level=error');
    expect(line).toContain('message=boom');

    spy.mockRestore();
  });
});
