var currPlayIndex = null;
var userInfo = {};
var currPlayInfo = {};
$(document).ready(function(){
    var currMainPage = 1;
    var page = $('.main_con');
    var navBtn = $('.foot_nav_btn');

    $('.player_icon').tmstap(function(e,t){
        showPlayer();
    });

    $('#my_music').tmstap(function(e,t){
        showpage($(t).attr('data-num'));
    });

    $('#find_music').tmstap(function(e,t){
        showpage($(t).attr('data-num'));
        getFindMusic();
    });


    $('#friends').tmstap(function(e,t){
        showpage($(t).attr('data-num'));

    });

    $('#account').tmstap(function(e,t){
        showpage($(t).attr('data-num'));
    });


    function showpage(tapnum){
        if(tapnum < currMainPage){
            page.eq(currMainPage).addClass('shownextpage');
            page.eq(tapnum).addClass('showpage');
        }
        if(tapnum > currMainPage){
            page.eq(currMainPage).addClass('showprevpage');
            page.eq(tapnum).addClass('showpage');
        }
        navBtn.removeClass('nav_active');
        navBtn.eq(tapnum).addClass('nav_active');
        currMainPage = tapnum;
        page.eq(tapnum).on('transitionend', function(){
            for(var i = 0; i < page.length; i++){
                page.eq(i).removeClass('shownextpage showpage showprevpage prevpage page nextpage');
                if(i < currMainPage){
                    page.eq(i).addClass('prevpage');
                }
                if(i == currMainPage){
                    page.eq(i).addClass('page');
                }
                if(i > currMainPage){
                    page.eq(i).addClass('nextpage');
                }
            }
            $(this).off('transitionend');
        });
    }



    function getFindMusic(){
        $.ajax({
            url:'/mobile/getfindmusic',
            type:'post',
            dataType:'json',
            data:{
                test:'test'
            },
            success:function(data){
                var html = '';
                var list = $('#findmusic_list');
                $('#allmusic_num').html(data.length);
                list.empty();
                for(var i = 0; i < data.length; i++){
                    html +=  '<li class="getfindmusic_li" data-id="'+data[i].id+'">' +
                        '<img src ="'+data[i].musicimg+'">'+
                        '<section class="findmusic_info">' +
                        '<div class="findmusic_name">'+data[i].musicname+'</div>'+
                        '<div class="findmusic_singer"><span>'+data[i].author+'</span><span>专辑:<span>'+data[i].album+'</span></span></div>'+
                    '</section>'+
                    '</li>';
                }
                list.html(html);
                $('.getfindmusic_li').tmstap(playThisMusic);
            },
            error:function(err){
                console.log(err);
            }
        })
    }

    function playThisMusic(e,t){
        var musicId = $(t).attr('data-id');
        $.ajax({
            url:'/mobile/checkloginstate',
            type:'post',
            success:function(data){
                if(data.state){
                    currPlayIndex = userInfo.playlist.indexOf(musicId);
                }
            }
        });
        getMusicInfo(musicId);
    }

    $('#play_prev').tmstap(playPrev);
    $('#play_next').tmstap(playNext);

    $('#player_back').tmstap(function(){
        hidePlayer();
    });

    function hidePlayer(){
        var btn = $('.player_con');
        btn.removeClass('showplayer');
        btn.addClass('hideplayer');
    }

    function showPlayer(){
        var btn = $('.player_con');
        btn.removeClass('hideplayer');
        btn.addClass('showplayer');
    }


    $('.startpage_op').on('touchstart',function(){
        $(this).addClass('startpage_op_ts');
        $('.startpage_op').on('touchend',function(){
            $(this).removeClass('startpage_op_ts');
            $('.startpage').removeClass('show');
        })
    });

    $('#go_login').tmstap(function(){
        $('.login_page').addClass('show');
    });

    $('#go_signup').tmstap(function(){
        $('.signup_page').addClass('show');
    });

    $('#loginto_start').tmstap(function(){
        $('.login_page').removeClass('show');
        $('.startpage').addClass('show');
        $('.warn').css('display','none');
    });

    $('#signupto_start').tmstap(function(){
        $('.signup_page').removeClass('show');
        $('.startpage').addClass('show');
        $('.warn').css('display','none');
    });


    $('#signup_btn').tmstap(checkSignup);
    $('#login_btn').tmstap(function(e,t){
        checkLogin($('#username').val(),$('#userpass').val());
    });

    function checkSignup(){
        var username = $('#usersignupname').val();
        var userpass = $('#usersignuppass').val();
        if(username.tmsCheckMobilePhone() && userpass.tmsCheckPassword()){
            backCheck(username,userpass);
        }else{
            $('.warn').text('输入正确的手机号或密码').css('display','block');
        }
    }

    function backCheck(name,pass){
        $.ajax({
            url:'/mobile/signupcheck',
            type:'post',
            data:{
                username: name,
                userpass: pass
            },
            dataType:'json',
            success:function(data){
                if(data.data){
                    //注册成功并登陆
                    //跳转到我的音乐
                    $('.login_page').addClass('show');
                    $('.startpage').removeClass('show');
                    $('.signup_page').removeClass('show');
                    $('.warn').css('display','none');

                    $('#addmylove').removeClass('icon-xin-1 xinlovecolor').addClass('icon-xin');
                }else{
                    //注册失败
                    //用户名不可用
                    $('.warn').text('用户名不可用').css('display','block');
                }
            },
            error:function(err){
                console.log(err);
            }
        })
    }


    function checkLogin(uname,upass){
        var name = uname;
        var pass = upass;
        $.ajax({
            url: '/mobile/logincheck',
            type: 'post',
            data:{
                username: name,
                userpass: pass
            },
            dataType: 'json',
            success: function(data){
                if(data.type){
                    //登录成功
                    $('.startpage_con').css('display','none');
                    $('#account_username').text(name);
                    $('.headinfo_con').removeClass('show');
                    $('#account_login_con').addClass('show');
                    $('.logout_con').addClass('show');
                    userInfo = data;

                    if(userInfo.playlist =='null'){
                        userInfo.playlist = [];
                    }else{
                        userInfo.playlist = userInfo.playlist.split('&');
                    }

                    refreshList();

                }else{
                    console.log(data.type);
                }
            },
            error: function(err){
                console.log(err)
            }
        })
    }


    $('#addmylove').tmstap(addMusicToMyLove);

    function addMusicToMyLove(e,t){
        $.ajax({
            url:'/mobile/checkloginstate',
            type:'post',
            success:function(data){
                if(data.state){
                    //登陆状态
                    var list = '';
                    if($.inArray(currPlayInfo.id.toString(),userInfo.playlist) == -1){
                        userInfo.playlist.push(currPlayInfo.id.toString());
                        list = userInfo.playlist.join('&');
                        $(t).removeClass('icon-xin');
                        $(t).addClass('icon-xin-1 xinlovecolor');
                    }else{
                        removeByValue(userInfo.playlist,currPlayInfo.id.toString());
                        list = userInfo.playlist.join('&');
                        if(list.length < 1){
                            list = 'null';
                        }
                        $(t).removeClass('icon-xin-1 xinlovecolor');
                        $(t).addClass('icon-xin');
                    }

                    $.ajax({
                        url:'/mobile/addlovemusic',
                        type:'post',
                        dataType:'json',
                        data:{
                            userid : userInfo.userid,
                            playlist : list
                        },
                        success:function(data){
                            if(data.type){
                                //刷新我的音乐
                                refreshList();
                            }
                        },
                        error:function(err){
                            console.log(err);
                        }
                    });

                }else{
                    //非登录状态
                    $('.startpage_con').css('display','block');
                    $('.startpage').removeClass('show');
                    $('.signup_page').removeClass('show');
                    $('.login_page').addClass('show');
                }
            },
            error:function(err){
                console.log(err)
            }
        });


    }

    function refreshList(){
        var list = userInfo.playlist.join(',');
        if(list == ''){
            $('.nomusic_list').addClass('shownull');
        }else{
            $.ajax({
                url:'/mobile/getmusiclistinfo',
                type:'post',
                data: {
                    list : list
                },
                success:function(data){
                    $('#allmusicnum').text(data.length);
                    $('.nomusic_list').removeClass('shownull');
                    var mymusiclist = $('#mymusic_list');
                    var html = '';
                    for(var i = 0; i < data.length; i++){
                        var num = i + 1;
                        html += '<li class="getfindmusic_li" data-id="'+data[i].id+'">' +
                                '<div class="list_num">'+ num +'</div>'+
                                '<div class="list_info">'+
                                    '<div class="music_title">'+ data[i].musicname +'</div>'+
                                    '<div class="music_singer">'+data[i].author+'</div>'+
                                '</div>'+
                                '<div class="music_op_con">'+
                                    '<div class="music_op">'+
                                        '<i class="iconfont icon-shenglve"></i>'+
                                    '</div>'+
                                '</div>'+
                                '</li>';
                    }
                    mymusiclist.html(html);
                    $('.getfindmusic_li').tmstap(playThisMusic);
                },
                error:function(err){
                    console.log(err);
                }
            });
        }
    }




    $('#ontrial').tmstap(function(){
        $('.startpage_con').css('display','none');
        $('#account_logout_con').addClass('show');

        $('.nomusic_list').addClass('shownull');
    });


    $('#account_login').tmstap(function(){
        $('.startpage_con').css('display','block');
        $('.startpage').removeClass('show');
        $('.signup_page').removeClass('show');
        $('.login_page').addClass('show');
    });

    $('#logout').tmstap(function(){
        $.ajax({
            url: '/mobile/logout',
            type: 'post',
            dataTpye: 'json',
            data: {
                data: userInfo
            },
            success: function(data){
                if(data.type == true){
                    $('.logout_con').removeClass('show');
                    $('.headinfo_con').removeClass('show');
                    $('#account_logout_con').addClass('show');
                    $('#mymusic_list').empty();
                    $('.nomusic_list').addClass('shownull');
                }
            },
            error:function(err){
                console.log(err);
            }
        })
    });





    function removeByValue(arr, val) {
        for(var i=0; i<arr.length; i++) {
            if(arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    }
});


function playPrev(){
    var prev = currPlayIndex - 1;
    if(prev < 0){
        getMusicInfo(parseInt(userInfo.playlist[userInfo.playlist.length - 1]));
        currPlayIndex = userInfo.playlist.length - 1;
    }else{
        getMusicInfo(parseInt(userInfo.playlist[prev]));
        currPlayIndex -= 1;
    }
}

function playNext(){
    var next = currPlayIndex + 1;
    if(next == userInfo.playlist.length){
        getMusicInfo(parseInt(userInfo.playlist[0]));
        currPlayIndex = 0;
    }else{
        getMusicInfo(parseInt(userInfo.playlist[next]));
        currPlayIndex += 1;
    }
}

function getMusicInfo(musicId){
    $.ajax({
        url:'/mobile/getmusicinfo',
        type:'post',
        data:{
            id:musicId
        },
        dataType:'json',
        success:function(data){
            currPlayInfo = data[0];
            $('#player_musicname').text(data[0].musicname);
            $('#player_musicauthor').text(data[0].author);
            $('#record img').attr('src',data[0].musicimg);
            $('#player').attr({
                src:data[0].musicsrc,
                autoplay:'autoplay'
            });
            $('.player_con').css({
                background:'url("'+data[0].musicimg+'") no-repeat center center;',
                'background-size': '100vh 100vh'
            });

            var loveIcon = $('#addmylove');
            if($.inArray(currPlayInfo.id.toString(),userInfo.playlist) == -1){
                loveIcon.removeClass('icon-xin-1 xinlovecolor');
                loveIcon.addClass('icon-xin');

            }else{
                loveIcon.removeClass('icon-xin');
                loveIcon.addClass('icon-xin-1 xinlovecolor');
            }

        },
        error:function(err){
            console.log(err);
        }
    })
}