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
    host:'localhost',                                               //���ݿ��������ƣ��˴�Ϊ�ͻ��� һ��Ϊlocalhost
    port:'3306',                                                     //���ݿ�˿ںţ�һ��Ϊ3306
    user:'username',                                             //���ݿ��û���
    password:'password',                                     //���ݿ�����
    manage_database:'datebase name',               //��Ҫִ�е�������ݿ�����
    forCreate_database:'datebase name',             //��дһ�����ش��ڵ����ݿ����ƣ������������κβ�����
    baseUrlPath:'http://127.0.0.1:3000/dir/',          //������express��ʱ��Ļ��������ַ�����Ӿ���ӿ����ƣ�
    baseZipName:'sql.7z'                                      //ѹ���ļ����ƣ����Բ����޸�
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
    host:'localhost',                                           //��������mysql���������ƣ�һ��Ϊlocalhost
    user:'username',                                          //��������mysql�û���
    password:'password',                                  //��������mysql����
    dumpPath:'./public/download',                   //���������ļ�����Ŀ¼�����뱣֤������ļ�����Ϊ��
    database:'database name',                          //���������ݿ�����
    tokenText:'abc'                                           //tokenֵ ���������޸�
};
```
launch service(Express)
```sh
node ./bin/www
```