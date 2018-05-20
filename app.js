/**
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Khang.Dong <dvakhang34@gmail.com> on May 01, 2018
 */

const express = require('express')
const compression = require('compression')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const errorHandler = require('errorhandler')
const dotenv = require('dotenv')
const logger = require('morgan')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const path = require('path')
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
const expressStatusMonitor = require('express-status-monitor')
const sass = require('node-sass-middleware')
const chalk = require('chalk')
const http = require('http')
const lusca = require('lusca')
const passport = require('passport')

const seeder = require('./helpers/seeder')
const routes = require('./routes')
const scheduler = require('./services/scheduler')


const {
  showLogs
} = require('./helpers')
const {
  ENV,
  PORT
} = require('./constants')
const env = process.env.NODE_ENV || ENV.DEV
const sassOpts = {
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public/assets/css'),
  outputStyle: 'compressed',
  prefix: '/assets/css'
}

if (env === ENV.DEV) {
  dotenv.load({
    path: '.env'
  })
  // sassOpts.outputStyle = 'extended'
}

if (env == ENV.TEST) {
  dotenv.load({
    path: '.env.test'
  })
}

global.uploadDir = path.join(__dirname, 'uploads')

/**
 * Create Express server.
 */
const app = express()
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI, {
  useMongoClient: true
}, (error) => {
  if (error) {
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'))
    process.exit()
  }

  seeder.seedData()
})

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || PORT)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
// app.use(timeout('600s'))
app.use(expressStatusMonitor())
app.use(compression())
app.use(sass(sassOpts))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(methodOverride())
app.use(expressValidator({
  customValidators: {
    isArray: function(value) {
      return Array.isArray(value)
    },
  },
}))
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== '/signin' &&
    req.path !== '/signup' && !req.path.match(/^\/auth/) && !req.path.match(/\./)) {
    req.session.returnTo = req.path
  } else if (req.user &&
    req.path === '/account') {
    req.session.returnTo = req.path
  }
  next()
})
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/auth')) {
    next()
  } else {
    lusca.csrf()(req, res, next)
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

/**
 * Serve static files
 */
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: 31557600000
}))
app.use('/exported', express.static(path.join(__dirname, 'export'), {
  maxAge: 31557600000
}))

// app.use(haltOnTimedout)
/**
 * App routes
 */
app.use('/', (req, res, next) => {
  if (req.path.indexOf("assets") < 0) {
    const segments = req.path.split("/")
    if (segments.length > 1) {
      res.locals.activePage = segments[1]
    } else {
      res.locals.activePage = ""
    }
  }
  next()
}, routes)

/**
 * 404
 */
app.use((req, res, next) => {
  res.status(404).render('notFound')
})

/**
 * Error Handler.
 */
app.use(errorHandler())

if (!String.prototype.format) {
  String.prototype.format = function() {
    let args = arguments
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match
    })
  }
}

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next()
}

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log(`App is using database: '${process.env.MONGODB_URI}'`)
  console.log('%s App is running at https://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'))
  console.log('  Press CTRL-C to stop\n')

  // Scheduler
  // scheduler.startSchedule('scheduleDownloadData')
  // scheduler.startSchedule('scheduleDistributeDomains')
  // scheduler.startSchedule('scheduleSendDailyReport')
})
app.timeout = 10 * 60 * 1000 // 10 mins

module.exports = app