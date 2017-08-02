/**
 * Created by bird on 2017/7/24.
 */
var http = require('http');
var mysql = require('mysql');
var MysqlTools= require('mysql-tools');
var mysqlTool = new MysqlTools();

var tool = {
    exportFromMysql:exportFromMysql,
    importIntoMysql:importIntoMysql,
    zipFileWith7zip:zipFileWith7zip,
    unzipFileWith7zip:unzipFileWith7zip,
    sendHttpRequest:sendHttpRequest
};

function exportFromMysql(options){                                       //数据库导出
    return new Promise(
        function(resolve, reject){
            mysqlTool.dumpDatabase(options,function(err,output, message, outputFilename){
                if(err){
                    return reject(err)
                }else{
                    return resolve(outputFilename);
                }
            });
        })
}

function importIntoMysql(options){                                       //数据库导入
    return new Promise(
        function(resolve,reject){
            mysqlTool.restoreDatabase(options,function(err){
                if(err){
                    return reject(err)
                }else{
                    return resolve("import sql success");
                }
            });
        }
    );
}

function zipFileWith7zip(zipfilename,resourcefilename){                          //压缩文件
    return new Promise(
        function(resolve,reject){
            var exec = require('child_process').exec;
            var cmd = '7z a ' + zipfilename +' '+ resourcefilename+' -v20m';
            exec(cmd, function callback(error, stdout, stderr) {
                if(error){
                    return reject(error)
                }else{
                    return resolve(stdout,stderr);
                }
            });
    });
}

function unzipFileWith7zip(zipfilename){                                          //解压缩文件
    return new Promise(
        function(resolve,reject){
            var exec = require('child_process').exec;
            var cmd = '7z e '+zipfilename;
            exec(cmd, function callback(err, stdout, stderr) {
                if(err || stderr != ""){
                    return reject(err);
                }else{
                    return resolve("unzip sql success");
                }
            });
        }
    );
}

function sendHttpRequest(url){
    return new Promise(
        function(resolve,reject){
            http.get(url, function (response) {
                response.on('data', function (data) {
                    if(JSON.parse(data.toString()).status == '0'){
                        return reject(JSON.parse(data.toString()).result);
                    }else{
                        return resolve(data);
                    }
                });
                response.on('error', function (e) {
                    return reject(e);
                })
            })
        }
    );
}

module.exports = tool;

//var option = {
//    host:'localhost',
//    user:'root',
//    password:'123456',
//    sqlFilePath:'./120.sql',
//    database:'bird'
//};

//importIntoMysql(option).then(function(data){
//    console.log(data);
//});

//zipFileWith7zip('test.7z','120.sql').then(function(data1,data2){
//    console.log(data1);
//    console.log(data2);
//})