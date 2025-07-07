const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User      = require('./user')(sequelize, Sequelize.DataTypes);
db.Product   = require('./product')(sequelize, Sequelize.DataTypes);
db.CartItem  = require('./cartItem')(sequelize, Sequelize.DataTypes);
db.Order     = require('./order')(sequelize, Sequelize.DataTypes);
db.OrderItem = require('./orderItem')(sequelize, Sequelize.DataTypes);

// Relations
db.User.hasMany(db.CartItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.CartItem.belongsTo(db.User, { foreignKey: 'userId' });

db.Product.hasMany(db.CartItem, { foreignKey: 'productId' });
db.CartItem.belongsTo(db.Product, { foreignKey: 'productId' });

db.User.hasMany(db.Order, { foreignKey: 'userId' });
db.Order.belongsTo(db.User, { foreignKey: 'userId' });

db.Order.belongsToMany(db.Product, { through: db.OrderItem });
db.Product.belongsToMany(db.Order, { through: db.OrderItem });

module.exports = db;
