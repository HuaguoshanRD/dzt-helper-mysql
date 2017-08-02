drop database if  exists dbdump;
create database  dbdump;

CREATE TABLE dbdump.country (
`id` int auto_increment primary key,
`code` varchar(5),
`name` varchar(100)
);

INSERT INTO dbdump.country VALUES (1, 'IND', 'India');
INSERT INTO dbdump.country VALUES (2, 'US', 'USA');
INSERT INTO dbdump.country VALUES (3, 'AUS', 'Australia');
