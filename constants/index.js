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

const FORMAT_DOMAIN = 'f_domain'
const FORMAT_DATE = 'f_date'
const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'

const ROLES = {
  ADMIN: "ADMIN",
  SALE: "SALE",
  MANAGER: "MANAGER",
  IT: "IT",
  USER: "USER",
}

const SETTINGS = {
  ONLY_IMPORT_WHEN_EXPIRED_DATE_NOT_NULL: "O_I_W_E_D_N_N",
  SEND_DAILY_DISTRBUTED_DOMAINS: "SEND_DAILY_DISTRBUTED_DOMAINS",
  SEND_WEEKLY_REPORT: "SEND_WEEKLY_REPORT",
  SEND_DAILY_DOWNLOAD_HISTORIES: "SEND_DAILY_DOWNLOAD_HISTORIES",
}

const REPORT_OPTIONS = {
  [SETTINGS.SEND_DAILY_DOWNLOAD_HISTORIES]: {
    label: "Send daily download histories",
    options: [ROLES.ADMIN, ROLES.IT],
  },
  [SETTINGS.SEND_DAILY_DISTRBUTED_DOMAINS]: {
    label: "Send daily distributed domains",
    options: [ROLES.ADMIN, ROLES.MANAGER, ROLES.SALE]
  },
  [SETTINGS.SEND_WEEKLY_REPORT]: {
    label: "Send Weekly Report",
    options: [ROLES.ADMIN, ROLES.MANAGER]
  }
}

module.exports = {
  CHARS: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
  PREFIX_DBVN: 'dbvn_',
  DB_RESULT: 'db_result',
  ENV,
  URLS,
  PORT: 3001,
  TEST_PORT: 8081,
  FORMAT_DOMAIN,
  FORMAT_DATE,
  DEFAULT_DATE_FORMAT,
  VN_DATE_FORMAT: 'DD-MM-YYYY',
  VN_TIME_FORMAT: 'HH:mm:ss DD-MM-YYYY',
  DOWNLOAD_SOURCES: [
    "Namejet", "Snapnames", "Dropcatch", "Godaddy"
  ],
  FORMATS: {
    Namejet: {
      ignoreFirstLine: 1,
      format: `${FORMAT_DOMAIN},${FORMAT_DATE}`,
      dateFormat: 'YYYY-MM-DD',
      delimiter: ',',
      types: ['Pre-Release', 'Pending Delete', 'Auctions & Listing'],
      dateFormats: [DEFAULT_DATE_FORMAT, 'M-DD-YYYY', DEFAULT_DATE_FORMAT],
    },
    Snapnames: {
      ignoreFirstLine: 3,
      format: `${FORMAT_DOMAIN} price ${FORMAT_DATE}`,
      dateFormat: 'MM/DD/YYYY',
      delimiter: ' ',
      types: ['Expiring Domains', 'Deleting Domains', '"In Auction" Domains'],
      dateFormats: ['MM/DD/YYYY', 'DD-MMM-YY', 'MM/DD/YYYY'],
    },
    Dropcatch: {
      ignoreFirstLine: 1,
      format: `${FORMAT_DOMAIN}`,
      dateFormat: 'YYYY-MM-DD',
      delimiter: ',',
      types: ['Pending Delete'],
      dateFormats: [DEFAULT_DATE_FORMAT],
    },
    Godaddy: {
      ignoreFirstLine: 1,
      format: `${FORMAT_DOMAIN},x,x,${FORMAT_DATE}`,
      dateFormat: 'MM/DD/YYYY',
      delimiter: ',',
      types: ['tdnam_all_listings', 'bidding_service_auctions', 'expiring_service_auctions'],
      dateFormats: ['MM/DD/YYYY', 'MM/DD/YYYY', 'MM/DD/YYYY'],
    },
  },
  SETTINGS,
  SMTP: {
    SMTP_HOST: 'SMTP_HOST',
    SMTP_PORT: 'SMTP_PORT',
    SMTP_USER: 'SMTP_USER',
    SMTP_PASS: 'SMTP_PASS',
    SMTP_SECURE: 'SMTP_SECURE'
  },
  REPORT_OPTIONS,
  ROLES,
}
