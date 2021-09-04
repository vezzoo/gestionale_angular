export const environment = {
  production: false,
  path: 'http://localhost', // Connection to locale
  port: 3000,
  optionalLayer: '/api',

  // path: 'http://192.168.1.8',    // Connection to LAN server
  // path: 'http://wrk.applehome.it',  // Connection to WAN server
  // port: undefined,

  currency: '€',

  // valorized by app.component from config.json
  title: undefined,
  basePathToTemplates: undefined,
  categoriesToPrint: [],
  barCashDeskCategories: [],
  stockWarningLimit: undefined,
  cashDeskCategoriesOrder: [],
  reportsHourDifference: undefined,
};
