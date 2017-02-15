/**
 * Created by tms11_000 on 2017/2/2.
 * tapÊÂ¼þ
 */
;(function($){
    $.fn.tmstap = function(fun){
        $(this).on('touchstart',function(e){
            var t = this;
            var deviation = 10;
            var startX = e.touches[0].pageX;
            var startY = e.touches[0].pageY;
            var endX = 0;
            var endY = 0;
            $(document.body).on('touchmove',touchmove);
            $(t).on('touchend',touchend);
            function touchmove(ev){
                endX = ev.touches[0].pageX;
                endY = ev.touches[0].pageY;
                var absX = Math.abs(startX - endX);
                var absY = Math.abs(startY - endY);
                var moveDis = Math.sqrt(Math.pow(absX,2) + Math.pow(absY,2));
                if(moveDis > deviation || absX > deviation || absY > deviation){
                    $(t).off('touchend',touchend);
                }
            }
            function touchend(){
                fun(e,t);
                $(t).off('touchend',touchend);
            }
        });
    }
})(Zepto);