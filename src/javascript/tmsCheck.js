String.prototype.tmsCheckEmail = function(){
    var reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    return reg.test(this);
};

String.prototype.tmsCheckMobilePhone = function(){
    var reg = /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/;
    return reg.test(this);
};

String.prototype.tmsCheckTelephone = function(){
    var reg = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/;
    return reg.test(this);
};

String.prototype.tmsCheckPassword = function(){
    var reg = /^(?=.*?[a-zA-Z])(?=.*?[0-6])[!"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~A-Za-z0-9]{6,16}$/;
    return reg.test(this);
};

String.prototype.tmsCheckName = function(){
    var reg = /^[\u4E00-\u9FA5A-Za-z0-9_]+$/;
    return reg.test(this);
};
