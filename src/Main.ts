import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import route from 'koa-route'

import FireAlarm from './database'

const app = new Koa()
app.use(bodyParser())

const routes = {
  fireAlarms: {
    create: async (ctx: Koa.Context) => {
      const request = ctx.request.body
      const alarm = await FireAlarm.create({
        date: (request as any).date
      })
      ctx.body = {
        date: (alarm as any).get('date'),
        id: (alarm as any).get('id')
      }
    },
    get: async (ctx: Koa.Context) => {
      const alarms = await FireAlarm.findAll()
      const response = []
      for (const i of alarms) {
        response.push({
          date: (i as any).get('date'),
          id: (i as any).get('id')
        })
      }
      ctx.body = response
    }
  }
}

app.use(route.get('/firealarms', routes.fireAlarms.get))
app.use(route.post('/firealarms', routes.fireAlarms.create))

app.listen(8080)
