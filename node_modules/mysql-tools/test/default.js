var Class = require('ee-class')
        , log = require('ee-log')
        , assert = require('assert')
        , os = require('os')
        , Promise = require('es6-promise').Promise
        , MysqlTools = require('../');

describe('Mysql Tools', function () {
    var dumpSqlFileName = os.tmpdir()+'/dumpmysql'+new Date().getTime()+'.sql';
    it('Should create dump sql file', function (done) {
        var tool = new MysqlTools();
        tool.dumpDatabase({
            host: 'localhost'
            , user: 'root'
            , password: ''
            , dumpPath: dumpSqlFileName
            , database: 'dbdump'
        },done);
    });

    it('Should restore dump sql file', function (done) {
        var tool = new MysqlTools();
        tool.restoreDatabase({
            host: 'localhost'
            , user: 'root'
            , password: ''
            , sqlFilePath: dumpSqlFileName
            , database: 'myapp_test'
        }, done);
    });
});