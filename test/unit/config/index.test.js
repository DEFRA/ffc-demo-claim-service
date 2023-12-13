const config = require("../../../app/config/index");
const { development, production, test } =
  require("../../../app/config/constants").environments;
const joi = require("joi");

jest.mock("../../../app/config/mq-config", () => {
  return "mock object";
});
jest.mock("../../../app/config/database-config", () => {
  return "mock object";
});

describe("config index", () => {
  beforeEach(() => {
    process.env.NODE_ENV = development;
    process.env.PUBLISH_POLLING_INTERVAL = 5000;
    process.env.NOTIFY_API_KEY = "test-api";
    process.env.NOTIFY_EMAIL_TEMPLATE_KEY = "test-template";

    joi.bool = jest.fn().mockImplementation(() => {
      return {
        default: jest.fn().mockReturnValue(false),
      };
    });

    joi.string = jest.fn().mockImplementation(() => {
      return {
        required: jest.fn().mockReturnThis(),
        optional: jest.fn().mockReturnThis(),
        default: jest.fn().mockReturnThis(),
      };
    });

    jest.mock("joi", () => {
      return {
        validate: () => {
          return { value: "obj", error: null };
        },
      };
    });

  });

  it("should be a valid object", () => {
    expect(config).toBeInstanceOf(Object);
  });

});
