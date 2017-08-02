/**
 * Created by bird on 2017/8/1.
 */
var config = {
    host:'localhost',                                                //数据库主机名称，此处为客户端 一般为localhost
    port:'3306',                                                     //数据库端口号，一般为3306
    user:'username',                                                 //数据库用户名
    password:'password',                                             //数据库密码
    manage_database:'datebase name',                                 //想要执行导入的数据库名称
    forCreate_database:'datebase name',                              //填写一个本地存在的数据库名称（不会对其进行任何操作）
    baseUrlPath:'http://127.0.0.1:3000/dir/',                        //在启动express的时候的基本服务地址（不加具体接口名称）
    baseZipName:'sql.7z'                                             //压缩文件名称，可以不用修改
};
module.exports = config;
