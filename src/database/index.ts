import { join } from 'path'
import Sequelize from 'sequelize'

import FireAlarm from './models/FireAlarm'

const sequelize = new Sequelize('database', 'username', null, {
  dialect: 'sqlite',
  storage: join(__dirname, '..', '..', 'data', 'database.sqlite')
})

const fireAlarm = sequelize.import('fire_alarm', FireAlarm)
sequelize.sync()

export default fireAlarm
