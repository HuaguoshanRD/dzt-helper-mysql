/**
 * Created by bird on 2017/8/1.
 */

/*配置服务器环境*/
var databaseConfig = {
    host:'',
    user:'',
    password:'',
    dumpPath:'./public/download',                    //服务器端文件操作目录，必须保证有这个文件夹且为空
    database:'',
    tokenText:''
};


module.exports = databaseConfig;