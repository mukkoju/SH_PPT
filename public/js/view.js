$(document).ready(function(){
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
        })
    });   
});