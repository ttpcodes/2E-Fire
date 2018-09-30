import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import render from 'koa-ejs'
import route from 'koa-route'
import moment from 'moment'
import { readFile } from 'mz/fs'
import { join } from 'path'

import FireAlarm from './database'

const app = new Koa()
app.use(bodyParser())
render(app, {
  layout: 'index',
  root: join(__dirname, '..', 'views'),
  viewExt: 'html'
})

// Load authentication token for authenticating incoming requests.
let token = ''
const PATH = process.env.path || join(__dirname, '..', 'data', 'config.json')
readFile(PATH, 'utf8').then((data) => {
  let config = null
  try {
    config = JSON.parse(data)
    token = config.token
  } catch (err) {
    throw err
  }
}).catch((err) => {
  throw err
})

const routes = {
  fireAlarms: {
    create: async (ctx: Koa.Context) => {
      const key = ctx.header.authorization
      const date = (ctx.request.body as any).date
      if (!key) {
        ctx.body = {
          error: 'No authentication token provided.'
        }
      } else if (key !== 'Bearer ' + token) {
        ctx.body = {
          error: 'Incorrect authentication token provided.'
        }
      } else if (!date) {
        ctx.body = {
          error: 'No date provided.'
        }
      } else {
        if (isNaN(new Date(date).getDate())) {
          ctx.body = {
            error: 'Invalid date provided.'
          }
        } else {
          const alarm = await FireAlarm.create({
            date
          })
          ctx.body = {
            date: (alarm as any).get('date'),
            id: (alarm as any).get('id')
          }
        }
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
