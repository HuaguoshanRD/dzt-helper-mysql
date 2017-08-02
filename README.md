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
    host:'',                                     //���ݿ���������
    port:'',                                          //���ݿ�˿ں�
    user:'',                                          //���ݿ��û���
    password:'',                                    //���ݿ�����
    manage_database:'',                        //��Ҫִ�е�������ݿ�����
    forCreate_database:'',                           //�����ݿ�ֻҪ���ڼ���
    baseUrlPath:'',         //��������ַ
    baseZipName:'test.7z'                                  //ѹ���ļ����ƣ����Բ����޸�
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
    host:'',
    user:'',
    password:'',
    dumpPath:'./public/download',                    //���������ļ�����Ŀ¼�����뱣֤������ļ�����Ϊ��
    database:'',
    tokenText:''
};
```
launch service(Express)
```sh
node ./bin/www
```