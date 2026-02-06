module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: ['step-definitions/**/*.js', 'setup/hooks.js'],
    format: ['progress', 'html:reports/report.html'],
    parallel: 1,
    timeout: 60 * 1000,
    formatOptions: {
      snippetInterface: 'async-await'
    }
  }
};