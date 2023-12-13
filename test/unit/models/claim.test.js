const sequelize = {
  define: jest.fn(),
};
const DataTypes = {
  STRING: "string",
  DATE: "date",
  BOOLEAN: "boolean",
};

describe("Claim Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should define the model with correct fields", () => {
    require("../../../app/models/claim")(sequelize, DataTypes);
    expect(sequelize.define).toHaveBeenCalledWith(
      "claims",
      {
        claimId: { type: "string", primaryKey: true },
        name: "string",
        propertyType: "string",
        dateOfSubsidence: "date",
        accessible: "boolean",
        email: "string",
      },
      {
        freezeTableName: true,
        tableName: "claims",
      }
    );
  });
});
