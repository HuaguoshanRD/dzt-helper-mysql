# mysql-tools

Create mysql database dump and restore


[![npm](https://img.shields.io/npm/dm/mysql-tools.svg?style=flat-square)](https://www.npmjs.com/package/mysql-tools)
[![Travis](https://img.shields.io/travis/naval/mysql-tools.svg?style=flat-square)](https://travis-ci.org/naval/mysql-tools)
[![node](https://img.shields.io/node/v/mysql-tools.svg?style=flat-square)](https://nodejs.org/)

**Features**
- Create dump sql file of database
- Restore dump sql file to database

### Example

    var  MysqlTools= require('mysql-tools');
    

    // create database dump sql file
    var tool = new MysqlTools();
     tool.dumpDatabase({
        host: 'localhost'
        , user: 'root'
        , password: 'root'
        , dumpPath: 'home/backup'
        , database: 'test'
    }, function (error, output, message, dumpFileName) {
        if (error instanceof Error) {
           console.log(error);
        } else {
           console.log(output);
           console.log(message);
           console.log(dumpFileName);
        }
    });
    // restore dump sql file to database
    var tool = new MysqlTools();
     tool.restoreDatabase({
        host: 'localhost'
        , user: 'root'
        , password: 'root'
        , sqlFilePath: '/home/backup/test1430762417616.sql'
        , database: 'test'
    }, function (error, output, message) {
        if (error instanceof Error) {
           console.log(error);
        } else {
           console.log(output);
           console.log(message);
        }
    });
   
