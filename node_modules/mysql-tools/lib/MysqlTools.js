!function () {
    'use strict';
    var Class = require('ee-class')
            , util = require('util')
            , path = require('path')
            , exec = require('child_process').exec
            , fs = require('fs')
            , path = require('path')
            , asyncMethod = require('async-method');

    module.exports = new Class({
        /*
         * create dump sql file of database
         * @param {Object} options, {host: 'localhost',  user: 'root', password: '', dumpPath: '/home/backup/test.sql',database: 'test'}
         * @param {Function} callback
         * @returns {undefined}
         */
        dumpDatabase: asyncMethod(function (options, callback) {
            process.nextTick(function () {
                var error
                        , command
                        , time
                        , filePath
                        , extName
                        , dirName
                        , ls;
                if (!options.host || !options.user || !options.dumpPath || !options.database) {
                    error = new Error('Invalid options');
                    error.name = 'InvalidOptions';
                    callback(error, null);
                } else {
                    extName = path.extname(options.dumpPath);
                    dirName = path.dirname(options.dumpPath);
                    if (extName && extName.toLowerCase() !== '.sql') {
                        error = new Error('Invalid file type');
                        error.name = 'InvalidFileExtension';
                        callback(error, null);
                        return false;
                    }

                    fs.exists((extName === '') ? options.dumpPath : dirName, function (exists) {
                        if (!exists) {
                            error = new Error('Dump path doesn\'t exists');
                            error.name = 'InvalidPath';
                            callback(error, null);
                        } else {
                            if (extName && extName.toLowerCase() === '.sql') {
                                filePath = options.dumpPath;
                            } else {
                                time = new Date().getTime();
                                filePath = path.join(options.dumpPath, options.database + time + '.sql');
                            }
                            if (options.password) {
                                command = util.format('mysqldump  -h %s -u %s -p%s %s >%s', options.host, options.user, options.password, options.database, filePath);
                            } else {
                                command = util.format('mysqldump  -h %s -u %s %s >%s', options.host, options.user, options.database, filePath);
                            }
                            ls = exec(command, function (error, stdout, stderr) {
                                if (error !== null) {
                                    callback(error, null, null);
                                    return false;
                                }
                                callback(null, (stdout ? stdout : stderr), util.format('mysqldump %s file created successfully', filePath), filePath);

                            });
                        }
                    });
                }
            });
        })

                /*
                 * restore dump sql file to database
                 * @param {Object} options, {host: 'localhost', user: 'root', password: '', sqlFilePath: '/home/backup/test1430762417616.sql', database: 'testdb'}
                 * @param {Function} callback
                 * @returns {undefined}
                 */
        , restoreDatabase: asyncMethod(function (options, callback) {
            process.nextTick(function () {
                var error
                        , command
                        , ls;

                if (!options.user || !options.host || !options.sqlFilePath || !options.database) {
                    error = new Error('Invalid Options');
                    error.name = 'InvalidOptions';
                    callback(error, null);
                } else {
                    fs.exists(options.sqlFilePath, function (exists) {
                        if (!exists) {
                            error = new Error('Dump sql path doesn\'t exists');
                            error.name = 'InvalidFilePath';
                            callback(error, null);
                        } else {
                            if (options.password) {
                                command = util.format('mysql -h %s -u %s -p%s %s <%s', options.host, options.user, options.password, options.database, options.sqlFilePath);
                            } else {
                                command = util.format('mysql -h %s -u %s  %s <%s', options.host, options.user, options.database, options.sqlFilePath);
                            }
                            ls = exec(command, function (error, stdout, stderr) {
                                if (error !== null) {
                                    callback(error, null, null);
                                    return false;
                                }
                                callback(null, (stdout ? stdout : stderr), 'Db dump file restored successfully');

                            });
                        }
                    });
                }
            });
        })

    });
}();
