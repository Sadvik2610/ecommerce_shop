module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    name:        { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price:       { type: DataTypes.FLOAT, allowNull: false },
    category:    { type: DataTypes.STRING }
  });
  return Product;
};
