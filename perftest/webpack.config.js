module.exports = {
    entry: {
      'functions/perf-qldb': './functions/perf-qldb.js',
      'functions/perf-dynamodb': './functions/perf-dynamodb.js',
    },
    mode: 'production',
    target: 'node'
  }