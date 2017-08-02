this is a tool for backup mysql from remote server based on express
## Install
```sh
npm install backup-mysql
```

## Use
you should launch express service on your remote server(cd \RemoteBackupManage) , and then you can launch client file(app.js) to backup mysql database from remote server.
and you should install 7-Zip sofware befor use.
## Client
install packages first
```sh
npm install
```
change your config
```sh
var config = {
    host:'localhost',                                                              //数据库主机名称，此处为客户端 一般为localhost
    port:'3306',                                                                    //数据库端口号，一般为3306
    user:'username',                                                            //数据库用户名
    password:'password',                                                    //数据库密码
    manage_database:'datebase name',                             //想要执行导入的数据库名称
    forCreate_database:'datebase name',                           //填写一个本地存在的数据库名称（不会对其进行任何操作）
    baseUrlPath:'http://127.0.0.1:3000/dir/',                       //在启动express的时候的基本服务地址（不加具体接口名称）
    baseZipName:'sql.7z'                                                   //压缩文件名称，可以不用修改
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
cd \RemoteBackupManage
```
change your config
```sh
var databaseConfig = {
    host:'localhost',                                                      //服务器下mysql的主机名称，一般为localhost
    user:'username',                                           	    //服务器下mysql用户名
    password:'password',                                            //服务器下mysql密码
    database:'database name',                                    //服务器数据库名称
    tokenText:'abc'                                                     //token值 可以任意修改
};
```
launch service(Express)
```sh
node ./bin/www
```
