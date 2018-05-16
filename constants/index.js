const ENV = {
  DEV: 'development',
  PROD: 'production',
  TEST: 'test',
}

const URLS = {
  ROOT: '/',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  SIGN_OUT: '/signout',
  FORGOT: '/forgot',
  RESET: '/reset',
}

module.exports = {
  ENV,
  URLS,
  PORT: 3001,
  TEST_PORT: 8081,
  SETTING: {
    BLOCK_DEFINE: 'BLOCK_DEFINE'
  },
}
