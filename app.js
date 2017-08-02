/**
 * Created by bird on 2017/7/26.
 */
var http = require('http');
var async = require('async');
var fs = require('fs');
var request = require('request');
var readlineSync = require('readline-sync');
var helper = require('./helper.js');
var mysql = require('mysql');
var config = require('./config.js');
var baseUrlPath = config.baseUrlPath;
var baseZipName = config.baseZipName;
var exportResultFileName = '';
var totalZipCount = -1;
var currentDownloadNum = 0;
var tokenValue = "";

var importOptions = {
    host:config.host,
    user:config.user,
    password:config.password,
    //sqlFilePath:'./test1500877180890.sql',
    database:config.manage_database
};
var connectionBefor = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    port: config.port,
    database: config.manage_database
});
var connectionAfter = mysql.createConnection({       //此处为了删除当前数据库 而导致当前connection无效
    host: config.host,
    user: config.user,
    password: config.password,
    port: config.port,
    database: config.forCreate_database              //此处的数据库可以随意填写一个已经存在的数据库名
});

readyTask(function(data){
    //获取服务器返回的token
    tokenValue = JSON.parse(data).tokenValue;
    var option = readlineSync.question('please select your handle: \n' +
        '[1]backup mysql from server(launch your express service first);\n' +
        '[2]import sql file into local mysql;\n' +
        '[3]download server sql file and import into local mysql;\n');
    switch (option){                 // typeof  string
        case '1':
            backupFromServer();
            break;
        case '2':
            var fileSelectOption = readlineSync.question('please select file type:\n[1]sql file\n[2]zip file\n');
            if(fileSelectOption != '1' && fileSelectOption != '2'){
                console.error('select file type error');
            }else{
                var fileUrl = readlineSync.question('please input file name(or path):');
                importLocalDatabase(fileSelectOption,fileUrl);
            }
            break;
        case '3':
            var serverfileUrl = readlineSync.question('please input remote file url(limit sql file):');
            var fileName = new Date().getTime()+".sql";
            importServerDatabase(serverfileUrl,fileName);
            break;
        default:
            console.log("err choose");
    }
});



function readyTask(callback){
    var url = baseUrlPath+'readyTask';
    helper.sendHttpRequest(url).then(function(data){
        callback(data.toString());
    }).catch(function(e){
        console.log(e);
    })
}

function backupFromServer(){
    async.waterfall([
        function(callback){
            console.log('exporting...');
            exportFromMysql(callback);
        },
        function(exportResult,callback){
            console.log('export success');
            console.log('ziping...');
            zipFileWith7zip(baseZipName,exportResultFileName,'-v20m',callback);
        },
        function(result,callback){
            console.log('downloading...');
            pollingCheck(callback);
        },
        function(zipfilename,callback){
            console.log('download all success');
            console.log('unziping...');
            unzipWith7zip(zipfilename,callback)
        },
        function(result,callback){
            console.log('unzip success');
            console.log('cleaning database...');
            emptyDatabase(importOptions.database,callback);
        },
        function(result,callback){
            console.log('clean database success');
            console.log('importing...');
            importIntoMysql(importOptions,exportResultFileName,callback)
        },
        function(callback){
            console.log('import success');
            console.log('all completed');
        }
    ],function(err,result){
        console.log(err);
    });
}

function importLocalDatabase(fileselectoption,fileurl){
    if(fileselectoption == '2'){
        console.log('unziping...');
        /*获取解压之后的文件名*/
        /*此处获取从解压开始到结束之后的时间段内 新增的文件名称*/
        var fileListBefor = getPathFileName("./");
        unzipWith7zip(fileurl,function(err,result){
            if(err) throw err;
            console.log(result);
            var fileListAfter = getPathFileName("./");
            var unzipResult = compareArr(fileListBefor,fileListAfter);
            if(unzipResult.status == 0){
                console.log(unzipResult.result);
            }else{
                var unzipFileName = unzipResult.result;
                console.log('importing...');
                importIntoMysql(importOptions,unzipFileName,function(err,result){
                    if(err) throw err;
                    console.log(result);
                })
            }
        })
    }else if(fileselectoption == '1'){
        console.log('importing...');
        importIntoMysql(importOptions,fileurl,function(err,result){
            if(err) throw err;
            console.log(result);
        })
    }
}

function importServerDatabase(fileurl,localfilename){
    /*给定远程url 直接下载导入  if necessary*/
    console.log('downloading...');
    downloadFile(fileurl,localfilename,function(){
        console.log('download success.');
        console.log('importing...');
        importIntoMysql(importOptions,localfilename,function(){
            console.log('import success');
        })
    });
}



function exportFromMysql(callback){
    var url = baseUrlPath+'exportFromMysql?token='+ tokenValue;
    helper.sendHttpRequest(url).then(function(data){
        exportResultFileName = JSON.parse(data.toString()).resultFileName.split("\\")[2];          //此处如何分离文件名称？
        return callback(null,data);
    }).catch(function(e){
        return callback(e,null);
    });
}

function zipFileWith7zip(zipfilename,resourcefilename,persize,callback){                              //这个步骤需要异步，只要执行了压缩，就要开始轮询服务器是否生成分卷压缩文件
    var urlData = "?zipfilename="+zipfilename+"&resourcefilename="+resourcefilename+"&perSize="+persize+"&token="+ tokenValue;
    var url = baseUrlPath+'zipFileWith7zip'+urlData;
    helper.sendHttpRequest(url).then(function(){
        console.log("total zip complete");
        var url2 = baseUrlPath+'countFileNum'+"?token="+ tokenValue;
        helper.sendHttpRequest(url2).then(function(data){
            totalZipCount = JSON.parse(data.toString()).count-1;
        }).catch(function(e){
            console.log(e);
        })
    }).catch(function(e){
        console.log(e);
    });
    return callback(null,'');
}

function pollingCheck(callback){
    var i = 1;
    var nextFileName = "";
    var currentFileName = "";
    var st = setInterval(function(){
        currentFileName = baseZipName+"."+leftpad(i.toString(),4,'0');
        nextFileName = baseZipName+"."+leftpad((i+1).toString(),4,'0');
        console.log("totalZipCount:"+totalZipCount+",currentDownloadNum:"+currentDownloadNum);
        if(totalZipCount != currentDownloadNum && totalZipCount != currentDownloadNum+1){                                   //只要zipFileWith7zip没有执行完 就一直轮询
            var urlData = "?currentfilename="+currentFileName+"&nextfilename="+nextFileName+"&token="+ tokenValue;
            var url = baseUrlPath+'isCreatePartOfFiles'+urlData;
            helper.sendHttpRequest(url).then(function(data){
                if(JSON.parse(data.toString()).fileURL && JSON.parse(data.toString()).fileURL != ""){
                    i++;
                    //执行下载
                    console.log('downloading:'+currentFileName);
                    downloadFile(JSON.parse(data.toString()).fileURL,currentFileName,function(){
                        currentDownloadNum++;
                        console.log('download success:'+currentFileName);
                    });
                }
            }).catch(function(e){
                console.log(e);
            });
        }
        else if(totalZipCount == currentDownloadNum+1){                   //最后一个分卷文件要单独处理
            console.log('downloading:sql.7z.'+leftpad(totalZipCount.toString(),4,'0'));
            downloadFile('http://localhost:3000/download/sql.7z.'+ leftpad(totalZipCount.toString(),4,'0'),'sql.7z.'+leftpad(totalZipCount.toString(),4,'0'),function(){
                currentDownloadNum++;
                console.log('download success:sql.7z.'+leftpad(totalZipCount.toString(),4,'0'));
                var url = baseUrlPath+'removeFiles'+"?token="+ tokenValue;
                helper.sendHttpRequest(url).then(function(){                 //删除服务器上存在的文件
                    console.log('remove server files success');
                }).catch(function(e){
                    console.log(e);
                })
            });
        }
        else{                                                   //已完成所有下载
            clearInterval(st);
            return callback(null,'sql.7z.001');              //解压的时候只需要其中某一个分卷压缩文件，此处选取第一个（必定存在）
        }
    },5000);
}

function downloadFile(url,filename,callback){
    var stream = fs.createWriteStream(filename);
    request(url).pipe(stream).on('close', callback);
}

function unzipWith7zip(zipfilename,callback){
    helper.unzipFileWith7zip(zipfilename).then(function(){
        return callback(null,'unzip success');
    }).catch(function(err){
        return callback(err,null);
    })
}

function emptyDatabase(dbname,callback){
    //首先删除数据库，然后新建数据库
    var deleteQuery = 'DROP DATABASE IF EXISTS `' + dbname + '`';
    var createQuery = 'CREATE DATABASE IF NOT EXISTS`' + dbname + '`';
    connectionBefor.connect();
    connectionBefor.query(deleteQuery, function(err, rows, fields) {
        if (err) throw err;
        connectionBefor.end();
        connectionAfter.connect();
        connectionAfter.query(createQuery, function(err, rows, fields) {
            if (err) throw err;
            connectionAfter.end();
            callback(null,'');
        });
    });
}

function importIntoMysql(importoptions,exportresultfilename,callback){
    importoptions.sqlFilePath = './'+exportresultfilename;    //默认解压之后的sql文件存储在根目录
    helper.importIntoMysql(importoptions).then(function(){
        return callback(null,'import success');
    }).catch(function(err){
        return callback(err,null);
    })
}

function leftpad(str, len, ch) {                          //自动补零
    if (!ch && ch !== 0) ch = ' ';
    var len = len - str.length;
    return Array(len).join(ch) + str;
}

function getPathFileName(fileurl){
    return fs.readdirSync(fileurl);
}

function compareArr(arrbefor,arrafter){
    if((arrbefor.length+1) != arrafter.length){
        return {
            status:0,
            result:"error:path files changed."
        }
    }else{
        for(var i = 0;i<arrafter.length;i++){
            for(var k = 0;k<arrbefor.length;k++){
                if(arrafter[i] == arrbefor[k]){
                   break;
                }
                if(k == arrbefor.length-1){
                    return{
                        status:1,
                        result:arrafter[i]
                    }
                }
            }
        }
    }
}

//console.log(leftpad('12',4,'0'));   //012




