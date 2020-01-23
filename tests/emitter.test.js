const Emitter = require("../src/emitter");

const EventEmitter = require("events");

describe("emitter Tests", () => {
  it("constructs valid emitter", () => {
    expect(new Emitter(new EventEmitter())).toBeInstanceOf(Emitter);
  });

  it("does not construct invalid emitter", () => {
    expect(() => new Emitter({})).toThrow();
  });

  it("gets emitter", () => {
    const emitt = new EventEmitter();
    const emitter = new Emitter(emitt);
    expect(emitter.getEmitter()).toBe(emitt);
  });

  it("calls emit correctly", () => {
    const emitt = new EventEmitter();
    const emitter = new Emitter(emitt);
    const mock = jest.fn();
    emitt.emit = mock;
    emitter.emit("test", "data");
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith("test", "data");
  });

  it("adds listener correctly", () => {
    const emitt = new EventEmitter();
    const emitter = new Emitter(emitt);
    const mock = jest.fn();
    emitt.addListener = mock;
    const listener = () => {};
    emitter.addListener("tev", listener);
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith("tev", listener);
  });

  it("removes listener correctly", () => {
    const emitt = new EventEmitter();
    const emitter = new Emitter(emitt);
    const mock = jest.fn();
    emitt.removeListener = mock;
    const listener = () => {};
    emitter.removeListener("tev", listener);
    expect(mock).toHaveBeenCalledTimes(1);
    expect(mock).toHaveBeenCalledWith("tev", listener);
  });

  it("auto fills listener", () => {
    const emitter = new Emitter();
    expect(emitter._emitter).toBeInstanceOf(EventEmitter);
  });
});
