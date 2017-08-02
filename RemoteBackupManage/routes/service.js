/**
 * Created by bird on 2017/7/26.
 */
var express = require('express');
var router = express.Router();
var fs =require('fs');
var helper = require('../helpers/helper');
var config = require('../config.js');
config.dumpPath = "./public/download";
var tokenValue = "";

var exportOptions= {
    host:config.host,
    user:config.user,
    password:config.password,
    dumpPath:config.dumpPath,
    database:config.database
};

/* GET users listing. */

router.get('/readyTask', function(req, res, next) {
    tokenValue = config.tokenText+ new Date().getTime();       //可以再加一个md5
    fs.exists('./public/download',function(exists){
        if(exists){
            res.send({
                status:'1',
                tokenValue:tokenValue
            });
        }
        else{
            fs.mkdir('./public/download',function(err){
                if(err)
                    console.error(err);
                res.send({
                    status:'1',
                    tokenValue:tokenValue
                });
            });
        }
    });


});

router.get('/exportFromMysql', function(req, res, next) {
    if(!req.query.token || req.query.token != tokenValue){
        res.send({
            status:'0',
            result:"error:illegal token value"
        });
    }else{
        helper.exportFromMysql(exportOptions).then(function(result){
            /*result为导出数据文件的名称*/
            console.log('export success');
            res.send({
                status:'1',
                resultFileName:result
            });
        }).catch(function(err){
            console.log(err);
            res.send({
                status:'0',
                result:"error:"+err
            });
        })
    }

});

router.get('/zipFileWith7zip', function(req, res, next) {
    if(!req.query.token || req.query.token != tokenValue){
        res.send({
            status:'0',
            result:"error:illegal token value"
        });
    }else{
        var zipfilename = req.query.zipfilename;
        var resourcefilename = req.query.resourcefilename;
        var perSize = req.query.perSize;
        helper.zipFileWith7zip(zipfilename,resourcefilename,perSize).then(function(){
            res.send({
                status:'1'
            });
        }).catch(function(err){
            console.log(err);
            res.send({
                status:'0',
                result:"error:"+err
            });
        })
    }
});

router.get('/countFileNum', function(req, res, next) {                   //计算最后压缩文件有几个（此处单独列一个文件夹，此外，当客户端下载完成之后要清空文件夹）
    if(!req.query.token || req.query.token != tokenValue){
        res.send({
            status:'0',
            result:"illegal token value"
        });
    }else{
        var files = fs.readdirSync('./public/download/');
        res.send({
            status:'1',
            count:files.length
        });
    }
});

router.get('/isCreatePartOfFiles', function(req, res, next) {             //此处为了判断当前文件是否已经压缩完成，如果下一个分卷文件已经形成，那么第一个文件已经压缩成功
    if(!req.query.token || req.query.token != tokenValue){
        res.send({
            status:'0',
            result:"error:illegal token value"
        });
    }else{
        var currentFileName = req.query.currentfilename;
        var nextFileName = req.query.nextfilename;
        fs.exists('./public/download/'+nextFileName, function (exists) {
            if(exists){
                res.send({
                    status:'1',
                    fileURL:"http://localhost:3000/download/"+currentFileName
                });
            }else{
                res.send({
                    status:'2',
                    result:''
                });
            }
        });
    }
});

router.get('/removeFiles', function(req, res, next) {                   //当客户端下载完成之后要清空文件夹
    if(!req.query.token || req.query.token != tokenValue){
        res.send({
            status:'0',
            result:"error:illegal token value"
        });
    }else{
        var fileUrl = './public/download/';
        var files = fs.readdirSync(fileUrl);//读取该文件夹
        files.forEach(function(file){
            var stats = fs.statSync(fileUrl+'/'+file);
            fs.unlinkSync(fileUrl+'/'+file);
            console.log("删除文件"+fileUrl+'/'+file+"成功");
        });
        res.send({
            status:'1'
        });
    }
});

module.exports = router;
