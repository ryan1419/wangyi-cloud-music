/**
 * Created by tms11_000 on 2017/1/22.
 * mobile б╥си
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var DATABASE = 'wymusic';
var TABLE_MUSIC = 'music';
var TABLE_USER = 'user'
var path = require('path');
var fs = require('fs');

var client = mysql.createConnection({
    user: 'root',
    password: ''
});

router.post('/getfindmusic',function(req, res, next){
    client.query("use " + DATABASE);
    client.query('SELECT * FROM '+TABLE_MUSIC,function(err, results, fields){
        if(err){
            throw err;
        }else{
            res.send(results);
        }
    });
});

router.post('/signupcheck',function(req,res,next){
    var username = req.body.username;
    var userpass = req.body.userpass;

    client.query("use " + DATABASE);
    client.query('SELECT * FROM '+ TABLE_USER +' where username = '+ username,function(err, results, fields){
        if(err){
            throw err;
        }else{
            if(results.length){
                res.send({data:false});
            }else{
                client.query('insert into '+TABLE_USER+'(username,password,playlist)' +
                    ' values("'+username+'","'+userpass+'","null");');
                res.send({data:true});
            }
        }
    });

});

router.post('/logincheck',function(req,res,next){
    var username = req.body.username;
    var userpass = req.body.userpass;
    client.query("use " + DATABASE);
    client.query('SELECT * FROM '+TABLE_USER+' where username = "'+username+'" and password = "'+userpass+'";',
        function(err, results, fields){
        if(err){
            throw err;
        }else{
            if(results.length){
                req.session.state = true;
                res.send({
                    type:true,
                    userid:results[0].id,
                    username:results[0].username,
                    playlist:results[0].playlist
                });
            }else{
                res.send({type:false});
            }

        }
    });
});

router.post('/getmusicinfo',function(req,res,next){
    var musicId = req.body.id;
    client.query("use " + DATABASE);
    client.query('SELECT * FROM '+ TABLE_MUSIC +' where id = '+ musicId,function(err, results, fields){
        if(err){
            throw err;
        }else{
            res.send(results);
        }
    });
});

router.post('/addlovemusic',function(req,res,next){
    var userid = req.body.userid;
    var list = req.body.playlist;

    client.query("use " + DATABASE);
    client.query('update '+TABLE_USER+' set playlist =  "'+list+'"   where id = '+userid,function(err, results, fields){
        if(err){
            res.send({type:false});
        }else{
            res.send({type:true});
        }
    });

});

router.post('/getmusiclistinfo',function(req,res,next){
    var list = req.body.list;
    var idList = '('+list.replace(/\&/g,',')+')';

    client.query("use " + DATABASE);
    client.query('SELECT * FROM '+ TABLE_MUSIC +' where id in '+ idList,function(err, results, fields){
        if(err){
            throw err;
        }else{
            res.send(results);
        }
    });
});

router.post('/logout',function(req,res,next){
    req.session.state = false;
    res.send({type:true});
});

router.post('/checkloginstate',function(req,res,next){
     res.send({state:req.session.state});
});


module.exports = router;