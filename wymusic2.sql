DROP DATABASE IF EXISTS `wymusic`;
CREATE DATABASE `wymusic` ;
USE `wymusic`;

SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE `user` (
  `id` int(10) NOT NULL auto_increment,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `playlist` varchar(1000) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `music` (
  `id` int(10) NOT NULL auto_increment,
  `musicname` varchar(128) NOT NULL,
  `album` varchar(64) NOT NULL,
  `author` varchar(64) NOT NULL,
  `musicimg` varchar(1000) NOT NULL,
  `musicsrc` varchar(1000) NOT NULL,
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

insert into user(username,password,playlist) values('tmsbaby','123456','./test/test.txt');
insert into music(musicname,album,author,musicimg,musicsrc) values('testmusic','专辑','作者','./imgsrc','./musicsrc');

