const sequelize = {
  define: jest.fn(() => ({
    associate: jest.fn(),
  })),
};
const DataTypes = {
  STRING: "string",
  DATE: "date",
  BOOLEAN: "boolean",
  INTEGER: "integer",
};

describe("Minetype Model", () => {
  let MineType;
  beforeEach(() => {
    jest.clearAllMocks();
    MineType = require("../../../app/models/minetype")(sequelize, DataTypes);
  });

  it("should define the model with correct fields", () => {
    expect(sequelize.define).toHaveBeenCalledWith(
      "mineTypes",
      {
        mineTypeId: { type: "integer", primaryKey: true, autoIncrement: true },
        claimId: "string",
        mineType: "string",
      },
      {
        freezeTableName: true,
        tableName: "mineTypes",
      }
    );
    expect(MineType.associate).toBeDefined();
  });
});
