const Sequelize = require('sequelize');
const sequelize = new Sequelize('timeclock', 'dbuser', 'changeme', {
  host: 'localhost',
  port: 3307,
  dialect: 'mysql',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const Shift = sequelize.define('shift', {
  id: {type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4},
  start: Sequelize.DATE,
  end: Sequelize.DATE,
  enteredBy: Sequelize.STRING,
  reviewedBy: {type: Sequelize.STRING, allowNull: true},
  state: {
    type: Sequelize.ENUM,
    values: ['pending', 'approved', 'rejected'],
  }
});

sequelize.sync();

module.exports.save = async (input) => {

  return await Shift.create({
    state: 'pending',
    start: input.start,
    end: input.end,
    enteredBy: input.username
  });

};

module.exports.findAll = async () => {

  return await Shift.findAll({
    order: [['createdAt', 'DESC']]
  });

};

module.exports.update = async (input) => {

  const shift = await Shift.findOne({
    where: {
      id: input.id
    }
  });

  return await shift.update({
    state: input.state,
    reviewedBy: input.reviewer
  });
};