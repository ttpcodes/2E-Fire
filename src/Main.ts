import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import render from 'koa-ejs'
import route from 'koa-route'
import moment from 'moment'
import { join } from 'path'

import FireAlarm from './database'

const app = new Koa()
app.use(bodyParser())
render(app, {
  layout: 'index',
  root: join(__dirname, '..', 'views'),
  viewExt: 'html'
})

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
  },
  index: async (ctx: Koa.Context) => {
    const date = await FireAlarm.max('date')
    if (!date) {
      ctx.body = {
        error: 'No fire alarms documented yet.'
      }
    } else {
      // Web development is actually horrible in its current state.
      await (ctx as any).render('index', {
        date: Math.abs(moment(date).diff(moment(), 'days')) + ' days'
      })
    }
  }
}

app.use(route.get('/', routes.index))
app.use(route.get('/firealarms', routes.fireAlarms.get))
app.use(route.post('/firealarms', routes.fireAlarms.create))

app.listen(8080)
