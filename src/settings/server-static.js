module.exports = {
  locales: {
    languages: ['en'],
    path: './locales'
  },
  runtime: {
    debug: true,
    port: 8080
  },
  security: {
    routes: {
      admin: {
        token: 'NfCXtjJvi5-DqOYvQwN5r-rUv3RR5Dks-oWXmGiUByX'
      }
    }
  }
};
