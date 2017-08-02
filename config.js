/**
 * Created by bird on 2017/8/1.
 */
var config = {
    host:'localhost',                                    //数据库主机名称
    port:'3306',                                          //数据库端口号
    user:'root',                                          //数据库用户名
    password:'123456',                                   //数据库密码
    manage_database:'posapi-prod',                     //想要执行导入的数据库名称
    forCreate_database:'mysql',                         //该数据库只要存在即可
    baseUrlPath:'http://localhost:3000/service/',    //服务器地址
    baseZipName:'sql.7z'                                 //压缩文件名称，可以不用修改
};
module.exports = config;