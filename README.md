this is a tool for backup mysql from remote server based on express
## Install
```sh
npm install backup-mysql
```

## Use
you should launch express service on your remote server(cd /RemoteBackupManage) , and then you can launch client file(app.js) to backup mysql database from remote server

## Client
install packages first
```sh
npm install
```
change your config
```sh
var config = {
    host:'localhost',                                     //数据库主机名称
    port:'3306',                                          //数据库端口号
    user:'root',                                          //数据库用户名
    password:'123456',                                    //数据库密码
    manage_database:'posapi-prod',                        //想要执行导入的数据库名称
    forCreate_database:'mysql',                           //该数据库只要存在即可
    baseUrlPath:'http://localhost:3000/service/',         //服务器地址
    baseZipName:'sql.7z'                                  //压缩文件名称，可以不用修改
};
```

```sh
node app.js
```
## Server
install packages first
```sh
npm install
```
```sh
cd /RemoteBackupManage
```
change your config
```sh
var databaseConfig = {
    host:'localhost',
    user:'root',
    password:'123456',
    dumpPath:'./public/download',                    //服务器端文件操作目录，必须保证有这个文件夹且为空
    database:'posapi-prod',
    tokenText:'RWEQAER'
};
```
launch service(Express)
```sh
node ./bin/www
```
