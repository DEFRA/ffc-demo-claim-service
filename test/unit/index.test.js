jest.mock("../../app/services/app-insights", () => ({
  setup: jest.fn(),
}));
const appInsights = require("../../app/services/app-insights");

jest.mock("../../app/messaging/inbox", () => ({
  start: jest.fn().mockResolvedValue(),
  stop: jest.fn().mockResolvedValue(),
}));
const inbox = require("../../app/messaging/inbox");

jest.mock("../../app/messaging/outbox", () => ({
  start: jest.fn().mockResolvedValue(),
  stop: jest.fn().mockResolvedValue(),
}));
const outbox = require("../../app/messaging/outbox");

describe("Index", () => {
  let exitSpy;
  beforeEach(() => {
    jest.resetModules();
    jest.resetAllMocks();
    exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {});
  });

  afterEach(() => {
    exitSpy.mockRestore();
  });

  it("should start the service", async () => {
    jest.isolateModules(() => {
      require("../../app/index");
    });
    await new Promise((resolve) => setImmediate(resolve));
  });

  it("should stop the service on SIGTERM", async () => {
    jest.isolateModules(() => {
      require("../../app/index");
    });
    await new Promise((resolve) => setImmediate(resolve));
    process.emit("SIGTERM");
  });

  it("should stop the service on SIGINT", async () => {
    jest.isolateModules(() => {
      require("../../app/index");
    });
    await new Promise((resolve) => setImmediate(resolve));
    process.emit("SIGINT");
  });
});
