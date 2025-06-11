import EventBus from '../eventBus.js';

describe('EventBus', () => {
  it('должен вызывать слушателя при emit', () => {
    const payload = { foo: 'bar' };
    const listener = jest.fn();

    EventBus.on('testEvent', listener);
    EventBus.emit('testEvent', payload);

    expect(listener).toHaveBeenCalledWith(payload);

    EventBus.off('testEvent', listener);
    EventBus.emit('testEvent', { foo: 'baz' });
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
