$(document).ready(function(){
    
    $("#disconnect").appear(function () {
        $('.discnt-icn').addClass('pulstate');
    });
 $("#scl-jrnlsm").appear(function () {
        $("#scl-jrnlsm [data-to]").each(function () {
            var e = $(this).attr("data-to");
            $(this).delay(6e3).countTo({
                from: 0,
                to: e,
                speed: 2e3,
                refreshInterval: 50
            });
            $('.graph li').each(function(){
                var $this = $(this);
                var height = $this.data('height');
                $this.css({'height': height});
            });
            $('.mbls ul li').css({'width': '48px'});
            setTimeout(function () {
                $('.crcl-icn').addClass('pulstate');
            }, 800);
        });
    });
    $(".sqnc").appear(function () {
        
        var tm = 0;
        $(".sqnc").find('li').each(function(){
           var $this = $(this);
           setTimeout(function () {
                $this.addClass('pulstate');
            }, tm);
            tm = tm+303;
        });
        setTimeout(function () {
                $('.dted-line.jurn').css({'width': '30%'});
            }, 150);
        
            
    });
    
    
    //slider functionality
    var fullWidth = $( window ).width();
    $('.f-box').css({'width': fullWidth});
    $('.slider-box .item').css({'width': fullWidth-120});
  $('.nav_btn').click(function(e){
      e.preventDefault();
      var $this = $(this);
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
//      var index = $('.slider').find('.item._actv').index();
//      if($this.hasClass('nav-btn-right')){
//      $('.slider').find('.item').eq(index).addClass('left');
//      $('.slider').find('.item').eq(index+1).addClass('next');
//      $('.slider').find('.item').eq(index+1).addClass('left');
//      setTimeout(function () {
//                
//            }, 100);
//      setTimeout(function () {
//                $('.slider').find('.item').eq(index).removeClass('_actv left');
//                $('.slider').find('.item').eq(index+1).addClass('_actv').removeClass('next left');
//            }, 800);
//      }
//      else{
//       $('.slider').find('.item').eq(index).addClass('right');
//      $('.slider').find('.item').eq(index-1).addClass('prev');
//      $('.slider').find('.item').eq(index-1).addClass('right');
//      setTimeout(function () {
//                
//            }, 100);
//      setTimeout(function () {
//                $('.slider').find('.item').eq(index).removeClass('_actv right');
//                $('.slider').find('.item').eq(index-1).addClass('_actv').removeClass('prev right');
//            }, 800);   
//      }
        
  });
  
  
 
     function navigation(width, index){
      if(width)
        var width = $('.f-box').width() + width;
      else
        var width = $('.f-box').width() * index;  
      $('.slider-box').css({'transition-duration': '500ms', 
                            '-webkit-transition-duration': '400ms',
                            '-webkit-transform': 'translateX('+-parseInt(width)+'px)',
                            'transform': 'translateX('+-parseInt(width)+'px)'});
      $('.slider-box').data('next', width);
     }
     $('.slidr-nav li').click(function(){
     var $this = $(this);
     var index = $this.index();
     navigation(null, index);
     $this.addClass('_actv').siblings().removeClass('_actv');
  });
  
   $(window).scroll(function(e) {
     if($(this).scrollTop() > $("#opportunity").offset().top){  
         e.preventDefault();
     }
      });
 
});