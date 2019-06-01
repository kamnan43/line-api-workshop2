module.exports = {
  name: "Member",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar"
    },
    bloodType: {
      type: "varchar"
    },
    lat: {
      type: "decimal"
    },
    lng: {
      type: "decimal"
    },
    lineUserId: {
      type: "varchar"
    }
  }
};
