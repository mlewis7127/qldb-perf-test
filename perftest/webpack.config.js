module.exports = {
    entry: {
      'functions/perf-qldb-create': './functions/perf-qldb-create.js',
      'functions/perf-qldb-get': './functions/perf-qldb-get.js',
      'functions/perf-dynamodb-create': './functions/perf-dynamodb-create.js',
      'functions/perf-dynamodb-get': './functions/perf-dynamodb-get.js',
    },
    mode: 'production',
    target: 'node'
  }