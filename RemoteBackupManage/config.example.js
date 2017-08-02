/**
 * Created by bird on 2017/8/1.
 */

/*配置服务器环境*/
var databaseConfig = {
    host:'localhost',                                           //服务器下mysql的主机名称，一般为localhost
    user:'username',                                            //服务器下mysql用户名
    password:'password',                                        //服务器下mysql密码
    dumpPath:'./public/download',                               //服务器端文件操作目录，必须保证有这个文件夹且为空
    database:'database name',                                   //服务器数据库名称
    tokenText:'abc'                                             //token值 可以任意修改
};


module.exports = databaseConfig;
