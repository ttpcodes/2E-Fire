import Sequelize from 'sequelize'

export default (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes) => {
  return sequelize.define('fire_alarm', {
    date: {
      allowNull: false,
      type: DataTypes.DATE
    }
  })
}
