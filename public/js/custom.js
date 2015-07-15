$(document).ready(function () {
  //API url
  var api = $('body').data('api');

  /*Adjust height of left-bar to screen height */
  var auxHt = ($(window).height() - 100);
  $('.right-container .tab-pane').css('height', ($(window).height() - 64));
  var variables = {
    prevText: '',
    ele_width: 69,
    ele_height: 65,
    prevElem: null,
    prevTagElem: null,
    lmtRchd: false,
    timer: null,
    user: '',
    nxpg: 2,
    loading: false,
    prevNws: 0,
    prevCnt: 0,
    prevtp: 'All',
    prevTab: '',
    prevPst: 10,
    eod: false,
    newTab: false,
    isCmplt: false,
    sly: null,
    slyLoading: false,
    isGsuEnd: false
  };
  $.fn.animateElements = function (callback)
  {
    //var elements = $('.tab-content').find('.active .happening');
    var positioned = false;
    if (!positioned)
    {
      //alert($(this).attr('class') + ":" + $(this).css('left'));
      this.each(function (index)
      {
        $(this).css({
          'left': '-10px',
          'opacity': 0
        });
      });
      positioned = true;
    }
    var delay = 0;
    this.each(function (index) {
      if (positioned)
      {
        $(this).delay(delay).animate({
          left: 0,
          opacity: 1
        }, 'slow', 'easeOutExpo', function () {
          positioned = false;
        });
        delay += 40;
      }
    });
    if (callback)
      callback();
  };
  $.fn.extend({
    animateAuxContent: function (callback)
    {
      var positioned = false;
      if (positioned != true)
      {
        this.each(function (index) {
          $(this).css({
            'left': '20px',
            'opacity': '0'
          });
        });
        positioned = true;
      }
      var delay = 0;
      this.each(function (index) {
        if (positioned == true)
        {
          $(this).delay(delay).animate({
            'left': 0,
            'opacity': '1'
          }, 'slow', 'easeOutExpo', function () {
            positioned = false;
          });
          delay += 20;
        }
      });
      if (callback)
        callback();
    },
    slideLeftBar: function (options, callback)
    {
      var main = $('#main-content-box');
      var aux = $('#aux-content-box');
      if (options.direction == 'right')
      {
        main.find('.jspPane').removeClass('hideElement');
        main.animate({
          'opacity': 1
        }, 'fast', 'easeOutExpo');
        aux.animate({
          'opacity': 0
        }, 'fast', 'easeOutExpo');
        $('.left-container').animate({
          'margin-left': 0
        }, 'slow', 'easeOutExpo', function () {
          aux.addClass('hideElement');
        });
      }
      else if (options.direction == 'left')
      {
        aux.removeClass('hideElement');
        main.animate({
          'opacity': 0
        }, 'fast', 'easeOutExpo');
        aux.animate({
          'opacity': 1
        }, 'fast', 'easeOutExpo');
        $('.left-container').animate({
          'margin-left': '-' + options.margin
        }, 'slow', 'easeOutExpo', function () {
          main.find('.jspPane').addClass('hideElement');
        });
      }
      if (callback)
        callback();
    },
    scaleImages: function (options) {
      var div_height = options.dh;
      var div_width = options.dw;
      var img_width = $(this)[0].naturalWidth;
      var img_height = $(this)[0].naturalHeight;
      var max_side = Math.max(img_width, img_height);
      var scale = (max_side == img_height) ? img_height / div_height : img_width / div_width;
      var new_width = 0;
      var new_height = 0;
      var top = 0;
      var left = 0;
      if (!($(this).parents('div').hasClass('tile1') || $(this).parents('div').hasClass('tile4')))
      {
        if (max_side == img_height)
        {
          new_width = Math.ceil(img_width / scale);
          new_height = Math.ceil(img_height / scale);
          top = 0;
          left = Math.round((div_width - new_width) / 2);
        }
        else
        {
          new_height = Math.ceil(img_height / scale);
          new_width = Math.ceil(img_width / scale);
          top = Math.round((div_height - new_height) / 2);
          left = 0;
        }
      }
      else
      {
        if (img_width > img_height)
        {
          scale = img_height / div_height;
          new_width = Math.ceil(img_width / scale);
          new_height = Math.ceil(img_height / scale);
          top = 0;
          left = Math.round((div_width - new_width) / 2);
        }
        else
        {
          scale = img_width / div_width;
          new_height = Math.ceil(img_height / scale);
          new_width = Math.ceil(img_width / scale);
          top = Math.round((div_height - new_height) / 2);
          left = 0;
        }
      }
      var delayTime = 50;
      if ($(this).parents('div').hasClass('image-holder'))
      {
        new_width -= 4;
        delayTime = 100;
      }
      $(this).css({
        'width': new_width,
        'height': new_height,
        'top': top,
        'left': left
      });
      $(this).delay(delayTime).fadeIn();
    },
    hideScroller: function () {
      $(this).mouseenter(function () {
        $(this).find('.jspVerticalBar').fadeIn('slow');
      });
      $(this).mouseleave(function () {
        $(this).find('.jspVerticalBar').fadeOut('slow');
      });
    },
    hoverEffect: function (options) {
      var pclr = $(this).css('background-color');
      if (options.event.type == 'mouseenter')
      {
        if (!$(this).hasClass('more'))
          $(this).css('background-color', options.color);
      }
      else
      {
        if (!$(this).hasClass('more') && !$(this).hasClass('event'))
          $(this).css('background-color', pclr);
      }
    },
    formatButton: function (options) {
      if (options.event.type == 'mouseenter')
      {
        variables.prevText = this.text();
        if (options.btn.hasClass('yes'))
        {
          this.text("Yes, I'm in");
        }
        else if (options.btn.hasClass('no'))
        {
          this.text("Sorry!");
        }
      }
      else
      {
        this.text(variables.prevText);
      }
    },
    /*
     * positionElement to position elements to center of the page
     * 
     * options is a json which can have 2 parameters
     * 
     *  parent -> the element wrt which the position of target should be centered
     *  top -> boolean; true -> set top value, false -> do not set top value 
     */
    positionElement: function (options) {
      if (this.width() != 0 || this.height() != 0)
      {
        variables.ele_width = this.outerWidth();
        variables.ele_height = this.outerHeight();
      }
      else if (this.outerWidth() == 0)
        variables.ele_width = 32;
      else if (this.outerHeight() == 0)
        variables.ele_height = 32;
      var left = ((options.parent.outerWidth() - variables.ele_width) / 2);
      var bot = ((options.parent.outerHeight() - variables.ele_height) / 2);
      if (options.top == true)
        this.css({
          'left': left,
          'top': bot
        });
      else if (options.top == false)
        this.css({
          'left': left,
          'bottom': bot
        });
      else if (options.top == -1)
        this.css({
          'left': left
        });
      if ($(this).hasClass('loading'))
        $(this).fadeIn(100);
    },
    // printError is used for alerting the user with appropriate error message
    printError: function (msg) {
      var $this = this;
      var errorList = this.find('ul.error-list');
      errorList.find('li').remove();
      if (msg != '')
      {
        errorList.append("<li>" + msg + "</li>");
        $(this).animate({
          opacity: 1
        }, 'fast', 'easeOutExpo', function () {
        });
      }
      if (variables.timer != null)
        clearTimeout(variables.timer);
      variables.timer = setTimeout(function () {
        errorList.find('li').remove();
        $this.animate({
          opacity: 0
        }, 'slow', 'easeOutExpo', function () {
          errorList.find('li:not(:first)').remove();
        });
      }, 8000);
    },
    showStatus: function (msg, status, callback) {
      var $this = $(this);
      $this.find('p').html(msg);
      $this.addClass('view ' + status);
      /* To fadeout automatically after 5sec */
      setTimeout(function () {
        $this.removeClass('view err scs');
      }, 5000);
      if (callback)
      {
        setTimeout(function () {
          callback();
        }, 3500);
      }
    },
    // Form reset
    resetForm: function ()
    {
      this.find('textarea,input:not(:submit),password').each(function () {
        $(this).val('');
      });
      this.find('select').each(function () {
        $(this).val(0);
      });
      this.find('.opt-div:gt(1)').remove();
    },
    /* Showing image description and copyright content on hover */
    showImgDesc: function (e) {
      var elem = $(this).find('.c-b');
      if (e.type == 'mouseenter')
      {
        var timer = elem.data("timer") || 0;
        clearTimeout(timer);
        timer = setTimeout(function () {
          elem.fadeIn();
        }, 300);
        elem.data("timer", timer);
      }
      else
      {
        var timer = elem.data("timer") || 0;
        clearTimeout(timer);
        elem.fadeOut();
      }
    },
    getMnth: function (m, type)
    {
      if (type == '')
      {
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
      }
      else if (type == 'shrt')
      {
        var month = new Array();
        month[0] = "Jan";
        month[1] = "Feb";
        month[2] = "Mar";
        month[3] = "Apr";
        month[4] = "May";
        month[5] = "Jun";
        month[6] = "Jul";
        month[7] = "Aug";
        month[8] = "Sep";
        month[9] = "Oct";
        month[10] = "Nov";
        month[11] = "Dec";
      }
      return month[parseInt(m)];
    },
    setActiveTab: function () {
      $(this).addClass('active').siblings().removeClass('active');
      $('#happening-now a[href="#' + $(this).attr('id') + '"]').removeAttr('class');
    },
    getDateTime: function (tmsp) {
      var d = new Date(tmsp * 1000);
      var month = new Array();
      month[0] = "Jan";
      month[1] = "Feb";
      month[2] = "Mar";
      month[3] = "Apr";
      month[4] = "May";
      month[5] = "Jun";
      month[6] = "Jul";
      month[7] = "Aug";
      month[8] = "Sep";
      month[9] = "Oct";
      month[10] = "Nov";
      month[11] = "Dec";

      var hrs = d.getHours();
      var zn = 'AM';
      if (hrs > 12)
      {
        hrs -= 12;
        zn = 'PM';
      }
      else if (hrs < 10)
        hrs = '0' + hrs;

      var mins = d.getMinutes();
      if (mins < 10)
        mins = '0' + mins;
      var secs = d.getSeconds();
      if (secs < 10)
        secs = '0' + secs;
      var date = {};
      date.m = month[d.getMonth()];
      date.d = d.getDate();
      date.t = hrs + ":" + mins + ":" + secs + " " + zn;
      return date;
    },
    getUsrSgstns: function (isMod, sid) {
      var $this = $(this);
      var isPrv = true;
      var term = '';
      var carPos = 0;
      if (variables.prevElem != $this.attr('id'))
      {
        variables.prevElem = $this.attr('id');
        isPrv = false;
      }
      var unames = [];
      if ($this.offset().top > ($(window).height() - $this.offset().top))
        var sugs_pos = {my: "left bottom", at: "left top", collision: "flip"};
      else
        sugs_pos = {my: "left top", at: "left bottom", collision: "flip"};
      $this// don't navigate away from the field on tab when selecting an item
              .on("keydown", function (event) {
                if (event.keyCode === $.ui.keyCode.TAB &&
                        $(this).data("ui-autocomplete").menu.active) {
                  event.preventDefault();
                }
              }).autocomplete({
        source: function (request, response)
        {
          term = $.trim(request.term);
          if (!($this.hasClass('invitee')) && term.indexOf('@') >= 0)
          {
            if ($this.attr('contenteditable'))
            {
              carPos = $this.getCaretPosition();
              term = $.trim(request.term).substr(0, carPos).split(' ');
              if (term.length > 1)
              {
                term.shift();
                term = term[term.length - 1].substr(1);
              }
              else
                term = term[0].substr(1);
            }
            else
              term = request.term.substr(1);
          }
          else if ($this.parents("#search-frm").length) {
            if (term.indexOf("in:users") != 0)
              return;
            term = term.substr(9, term.length);
          }
          else if ($this.get(0).nodeName != 'INPUT')
            term = term.substr(1);
          if (term.length > 0) {
            $.ajax({
              'url': api + '/us',
              data: {
                'usr': term,
                'tp': (isMod ? 1 : 0),
                sid: sid
              },
              type: 'POST',
              dataType: 'text',
              beforeSend: function () {
                unames = [];
              },
              success: function (d) {
                var t = JSON.parse(d);
                if (t.success == 1) {
                  var prfpic = $("body").data("auth") + '/public/Multimedia/P_Pic_';
                  if ($('#user-nav').data('isLive'))
                    prfpic = 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_';
                  for (var u = 0; u < ((t.msg.length <= 5) ? t.msg.length : 5); u++)
                  {
                    unames.push({
                      'name': t.msg[u].F + (t.msg[u].L != null ? " " + t.msg[u].L : ""),
                      'unme': t.msg[u].U,
                      'img': prfpic + t.msg[u].BU
                    });
                  }
                }
              },
              complete: function () {
                if (!isPrv)
                  response(unames);
                else
                {
                  if ($this.parents('.e-b').data('refd') != undefined)
                  {
                    var be4Ref = $this.parents('.e-b').data('refd').split('::');
                    be4Ref.forEach(function (e, i) {
                      unames = $.grep(unames, function (user) {
                        return user.unme != e;
                      });
                    });
                  }
                  if ($this.parents('.tagr').data('tags') != undefined)
                  {
                    var be4Ref = $this.parents('.tagr').data('tags').toString().split(',');
                    be4Ref.forEach(function (e, i) {
                      unames = $.grep(unames, function (user) {
                        return user.unme != e;
                      });
                    });
                  }
                  response(unames);
                }
              }
            });
          }
        },
        create: function () {
          $('.ui-helper-hidden-accessible').remove();
        },
        focus: function (e, ui) {
          e.preventDefault();
        },
        select: function (e, ui) {
          e.preventDefault();
          var refd = '';
          if ($this.prop('tagName') != 'INPUT')
          {
            var tmp = $.trim($this.html());
            var ti = tmp.indexOf('@' + term);
            var strB4r = tmp.substr(0, ti);
            var strAftr = tmp.substr(ti + 1).replace(term, '');
            $this.html(strB4r + ' <a class="ref" href="' + $('body').data('auth') + '/' + ui.item.unme + '">' + ui.item.name + '</a> ' + strAftr);

            if ($this.hasClass('search-query'))
              window.location = '/' + ui.item.unme;
            else
            {
              refd = $this.parents('.e-b').data('refd') != undefined ? $this.parents('.e-b').data('refd') : '';
              $this.parents('.e-b').data('refd', refd + (refd != '' ? '::' + ui.item.unme : ui.item.unme));
              $this.placeCaretAtEnd(this, 1);
            }
          }
          else
          {
            if ($this.hasClass('search-query'))
              window.location = '/' + ui.item.unme;
            else if ($this.attr('id') == 'inv-sh')
            {
              var inpt = $this.parent();
              var trgt = inpt.parent();
              var invLst = trgt.data('tags') != undefined ? trgt.data('tags') : [];
              invLst.push(ui.item.unme);
              trgt.data('tags', invLst);
              inpt.before('<li>' + ui.item.name +
                      '<a href="#" class="rmv pull-right"><i class="icon-remove"></i></a></li>');
              $this.val('');
              if (((trgt.outerWidth() + trgt.offset().left) - (inpt.prev('li').outerWidth() + inpt.prev('li').offset().left)) < 100)
                inpt.css('width', '100%');
              else
                inpt.css('width', ((trgt.offset().left + trgt.outerWidth()) - (inpt.prev('li').outerWidth() + inpt.prev('li').offset().left) - 16));
              refd = $this.data('refd') != undefined ? $this.data('refd') : '';
              $this.data('refd', refd != '' ? refd + '::' + ui.item.unme : ui.item.unme);
            }
            else if ($this.parents().hasClass('tagr'))
              return false;
            else {
              this.value = ui.item.name;
              $this.data('unme', ui.item.unme).focus();
            }
          }
          return false;
        }
      }).data("ui-autocomplete")._renderItem = function (ul, item) {
        ul.addClass('srch');
        var anchr = "<a class='block box' title='" + item.unme + "'";
        if ($this.hasClass('search-query'))
          anchr += " href='/" + item.unme + "'";
        anchr += "><div class='icn'><img src='" + item.img + "' class='icn' align='absmiddle' /></div><p><span class='user-small'>" + item.name + "</span><span class='dft-msg block'>@" + item.unme + "</span></p></a>";
        $("<li>").addClass('box').append(anchr).appendTo(ul);
        ul.find("li:last-child").find("img").findPrfPic();
        return ul.find("li:last-child");
      };
      if (!$this.hasClass('search-query'))
        $this.autocomplete("option", "position", sugs_pos);
    },
    getHstgSgstns: function (rtnDt, sid) {
      var $this = $(this);
      var isPrv = true;
      if (variables.prevTagElem != $this.attr('id') && ($this.attr('id') != 'hstg' && $this.val() == ''))
      {
        variables.prevTagElem = $this.attr('id');
        isPrv = false;
      }
      var tags = [];
      var carPos = 0;
      var term = '';
      if ($this.offset().top > ($(window).height() - $this.offset().top))
        var sugs_pos = {my: "left bottom", at: "left top", collision: "flip"};
      else
        sugs_pos = {my: "left top", at: "left bottom", collision: "flip"};
      $this
              // don't navigate away from the field on tab when selecting an item
              .on("keydown", function (event) {
                if (event.keyCode === $.ui.keyCode.TAB && $this.data("ui-autocomplete").menu.active) {
                  event.preventDefault();
                }
                if (event.keyCode == $.ui.keyCode.ESCAPE)
                {
                  var html = $this.html();
                  $this.html(html);
                  $this.autocomplete('destroy');
                  $this.placeCaretAtEnd($this.get(0), 1);
                }
              })
              .autocomplete({
                minLength: 2,
                source: function (request, response) {
                  // delegate back to autocomplete, but extract the last term
                  term = $.trim(request.term);
                  if ($this.hasClass('search-query'))
                  {
                    term = request.term.substr(1);
                  }
                  else if ($this.attr('id') == 'hstg')
                  {
                    term = extractLast(request.term);
                  }
                  else if ($this.attr('contenteditable'))
                  {
                    carPos = $this.getCaretPosition();
                    term = term.substr(0, carPos).split(' ');
                    if (term.length > 1)
                    {
                      term.shift();
                      term = term[term.length - 1].substr(1);
                    }
                    else
                    {
                      term = term[0].split('#');
                      term = term[term.length - 1];
                    }
                  }
                  else
                  {
                    term = term.substr(1);
                  }
                  if (term.length > 0)
                  {
                    $.ajax({
                      'url': api + '/gthtgs',
                      data: {
                        'htg': term,
                        'sid': sid
                      },
                      type: 'POST',
                      dataType: 'text',
                      beforeSend: function () {
                        tags = [];
                      },
                      success: function (data) {
                        data = JSON.parse(data);
                        data = data.msg;
                        if (data != -1) {
                          for (var u = 0; u < ((data.length <= 5)? data.length : 5); u++)
                            tags.push(data[u].H);
                        }
                      },
                      complete: function () {
                        if (!isPrv)
                          response(tags);
                        else
                        {
                          if ($this.data('tagd') != undefined)
                          {
                            var be4Tagd = $this.data('tagd').split('::');
                            be4Tagd.forEach(function (e, i) {
                              tags = $.grep(tags, function (tag) {
                                return tag != e;
                              });
                            });
                          }
                          else if ($this.parents('.tagr').data('tags') != undefined)
                          {
                            var be4Tagd = $this.parents('.tagr').data('tags').toString().split(',');
                            be4Tagd.forEach(function (e, i) {
                              tags = $.grep(tags, function (tag) {
                                return tag != e;
                              });
                            });
                          }
                          response(tags);
                        }
                      }
                    });
                  }
                },
                close: function (event, ui) {
                  var html = $this.html();
                  $this.html(html);
                },
                focus: function (event, ui) {
                  event.preventDefault();
                  // prevent value inserted on focus
                  if ($this.attr('contenteditable') || $this.hasClass('e-b') || $this.attr('id') == 'hstg' || $this.hasClass('htg-bx'))
                    return false;
                  else
                    $this.val('#' + ui.item.value);
                },
                select: function (event, ui) {
                  if (!rtnDt)
                  {
                    if (($this.get(0).nodeName == 'INPUT' || $this.get(0).nodeName == 'TEXTAREA')
                            && !$this.hasClass('search-query'))
                    {
                      var terms = split(this.value);
                      // remove the current input
                      terms.pop();
                      // add the selected item
                      terms.push('#' + ui.item.value);
                      // add placeholder to get the comma-and-space at the end
                      terms.push("");
                      if (!$this.parents().hasClass('tagr'))
                        this.value = terms.join(", ");
                      // Saving already added tags
                      var tagd = $this.data('tagd') != undefined ? $this.data('tagd') : '';
                      $this.data('tagd', tagd + (tagd != '' ? '::' + ui.item.value : ui.item.value));
                    }
                    else if ($this.hasClass('search-query'))
                    {
                      $this.val('#' + ui.item.value);
                      window.location = '/hashtag/' + ui.item.value.toLowerCase();
                    }
                    else
                    {
                      var tmp = $.trim($this.html());
                      var ti = tmp.indexOf('#' + term);
                      var strB4r = tmp.substr(0, ti);
                      var strAftr = tmp.substr(ti + 1).replace(term, '');
                      $this.html(strB4r + ' <a class="tag" href="' + $('body').data('auth') + '/hashtag/' + ui.item.value.toLowerCase() + '">' + ui.item.value + '</a> ' + strAftr);
                      $this.placeCaretAtEnd($this.get(0), 1);

                      var tagd = $this.parents('.e-b').data('tagd') != undefined ? $this.parents('.e-b').data('tagd') : '';
                      $this.parents('.e-b').data('tagd', tagd + (tagd != '' ? '::' + ui.item.value : ui.item.value));
                      $this.placeCaretAtEnd(this, 1);
                    }
                  }
                  return false;
                }
              }).data("ui-autocomplete")._renderItem = function (ul, item) {
        var anchr = "<a class='hash transition in box'";
        if ($this.hasClass('search-query'))
          anchr += " href='/hashtag/" + item.value.toLowerCase() + "'";
        anchr += ">#" + item.value + "</a>";
        ul.addClass('srch');
        if ($this.hasClass('search-query'))
          ul.addClass('span8');
        else
          ul.addClass('span3 sml');
        $this.attr('hlink', '/hashtag/' + item.value.toLowerCase()).focus();
        return $("<li>").addClass('box').append(anchr).appendTo(ul);
      };
      $this.on("autocompleteselect", function (event, ui) {
        if ($this.hasClass('search-query'))
          window.location = '/hashtag/' + ui.item.value.toLowerCase();
      });
      if (!$this.hasClass('search-query'))
        $this.autocomplete("option", "position", sugs_pos);
    },
    getSpcSgstns: function ()
    {
      var $this = $(this), spcs = [];
      $this.autocomplete({
        minLength: 3,
        source: function (req, res) {
          var term = req.term;
          if (term.length > 0)
          {
            $.ajax({
              'url': api + '/gcss',
              type: 'POST',
              dataType: 'text',
              data: {
                'data': req.term,
                cnt: 10,
                pc: 0,
                'auth': $this.getShIntr(),
                'usr': $this.getLoggedInUsr()
              },
              beforeSend: function () {
                spcs = [];
              },
              success: function (d) {
                d = JSON.parse(d);
                var prvLst = $this.parents('.tagr').data('tags');
                $.each(d, function (i, e) {
                  if ($.inArray(e.P_Id, prvLst) == -1)
                    spcs.push(e);
                });
              },
              complete: function () {
                res(spcs);
              }
            });
          }
        },
        focus: function (e, ui) {
          e.preventDefault();
        }
      }).data("ui-autocomplete")._renderItem = function (ul, item) {
        ul.addClass('_spcSgstn');
        var type = '';
        switch (item.P_Space_Mode)
        {
          case 0 :
            type = '<i class="icon-block-sign"></i> Restricted';
            break;
          case 1 :
            type = '<i class="icon-unlocked"></i> Open';
            break;
          case 2 :
            type = '<i class="icon-moderator"></i> Moderated';
            break;
          case 4 :
            type = '<i class="icon-locked"></i> Closed';
            break;
        }
        var anchr = "<a href='#' class='spc'><div class='icn-big'><img src='/public/Multimedia/" +
                item.P_Feature_Image + "' /></div><p><span class='ttl'>" + $this.buildTxt(item.P_Title, 0) +
                "</span><span class='dft-msg block'><span>" + type + "</span><span class='dot'></span>"
                + item.P_Follow_Count + " Followers</span></p></a>";
        ul.addClass('spc-srch');
//      $this.focus();
        var x = $("<li>").append(anchr).appendTo(ul);
        x.find('img').each(function () {
          $(this).findPrfPic(0, 1);
        });
        return x;
      };
    },
    stripHtml: function (html)
    {
      var tmp = $('<div>');
      var txt = html.replace(/\\"/g, '"');
      tmp.html(txt);
      return $.trim(tmp.text());
    },
    placeCaretAtEnd: function (el, isEnd) {
      el.focus();
      if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        if (isEnd)
        {
          sel.removeAllRanges();
          sel.addRange(range);
          if (sel.rangeCount)
            sel.collapseToEnd();
        }
        else
          sel.collapseToStart();
      } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
      }
    },
    getCaretPosition: function () {
      var caretOffset = 0, element = $(this).get(0);
      if (typeof window.getSelection != "undefined") {
        var range = window.getSelection().getRangeAt(0);
        var preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      } else if (typeof document.selection != "undefined" && document.selection.type != "Control") {
        var textRange = document.selection.createRange();
        var preCaretTextRange = document.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
      }
      return caretOffset;
    },
    updateRefTag: function ()
    {
      var refd = '', tagd = '', elem = $(this);
      elem.find('.ref').each(function (i, e) {
        if ($.trim($(e).text()) != '')
        {
          var usr = $(e).attr('href').split('/');
          refd += usr[usr.length - 1] + (i < elem.find('.ref').length - 1 ? '::' : '');
        }
      });
      elem.find('.tag').each(function (i, e) {
        if ($.trim($(e).text()) != '')
          tagd += $.trim($(e).text()) + (i < elem.find('.tag').length - 1 ? '::' : '');
      });
      return {
        'refd': refd,
        'tagd': tagd
      };
    },
    buildTxt: function (txt, hasAnchr)
    {
      if (txt != '' && txt != undefined)
      {
        if (hasAnchr)
        {
          return txt.replace(/\[u:(.*?)\](.*?)\[\/u\]/g, '<a class="ref" href="' + $('body').data('auth') + '/$1">$2</a>').replace(/\[h](.*?)\[\/h\]/g, '<a class="tag" href="' + $('body').data('auth') + '/hashtag/$1">$1</a>')
                  .replace(/\[dlqt\]/g, '"').replace(/\[slqt\]/g, "'").replace(/\[bksh\]/g, "\\");
        }
        else
          return txt.replace(/\[u:(.*?)\](.*?)\[\/u\]/g, '<span class="ref">$2</span>').replace(/\[h](.*?)\[\/h\]/g, '<span class="tag">$1</span>').replace(/\[dlqt\]/g, '"').replace(/\[slqt\]/g, "'").replace(/\[bksh\]/g, "\\");
      }
      else
        return '';
    },
    trimText: function (txt)
    {
      return $.trim(txt).replace(/<a class="ref" href="http(.*?):\/\/(.*?)\/(.*?)">(.*?)<\/a>/g, '[u:$3]$4[/u]').replace(/<a class="tag" href="(.*?)\/hashtag\/(.*?)">(.*?)<\/a>/g, '[h]$2[/h]').replace(/\\/g, "[bksh]").replace(/\t/g, " ")
              .replace(/'|&#39;|&#8217;|&#8216;/g, '[slqt]').replace(/"|&#8221;|&#8220;|&#34;|&quot;/g, '[dlqt]').replace(/&nbsp;/g, " ").replace(/\r?\n|\r/g, " ");
    },
    lmtTxt: function (evt, elem)
    {
      var $this = $(this);
      var txt4len = $this.text().length;
      var maxLn = $this.data('mxLn');
      if (maxLn - txt4len < 60)
        $this.addClass('lmt');
      else
        $this.removeClass('lmt red');
      if (maxLn - txt4len <= 0)
        $this.addClass('red');
      else
        $this.removeClass('red');

      $this.attr('data-ln', maxLn - txt4len);
      if (evt.type == 'paste')
      {
        $this.text($this.text());
        $this.placeCaretAtEnd($this.get(0), 1);
      }
    },
    rplcTgs: function (txt) {
      return txt.replace(/<a class="ref" href="http(.*?):\/\/(.*?)\/(.*?)">(.*?)<\/a>/g, '@$4').replace(/<a class="tag" href="(.*?)\/hashtag\/(.*?)">(.*?)<\/a>/g, '#$2').replace(/\\/g, "[bksh]").replace(/\t/g, " ")
              .replace(/<span class="tag">(.*?)<\/span>/g, '#$1').replace(/&nbsp;/g, " ").replace(/\r?\n|\r/g, " ");
    },
    getUrlParam: function (key) {
      key = key.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + key + "=([^&#]*)"),
              results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    frmtNmbr: function (num) {
      if (num)
      {
        if (num >= 1000 && num < 1000000)
          num = (num / 1000).toFixed(1).toString() + 'K';
        else if (num >= 1000000)
          num = (num / 1000000).toFixed(1).toString() + 'M';
      }
      return num;
    },
    checkUrl: function (text) {
      var url1 = /(^|&lt;|\s)(www\..+?\..+?)(\s|&gt;|$)/g,
              url2 = /(^|&lt;|\s)(((https?|ftp):\/\/|mailto:).+?)(\s|&gt;|$)/g;

      var html = $.trim(text);
      if (html) {
        html = html
                .replace(url1, '$1<a class="ref" target="_blank" href="http://$2">$2</a>$3')
                .replace(url2, '$1<a class="ref" target="_blank"  href="$2">$2</a>$5');
      }
      return html;
    },
    getTmSgstns: function (d, trgt, flag) {
      var $this = $(this);
      d = new Date(d);

      if (flag == 1)// flag will be 1 when end date and time selected first and if start time = end time.
      {
        var et = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 00, 00, 00);
        var eTmsp = d.getTime() / 1000;
        var dTmsp = (et.getTime() / 1000);
        var hrs = 0;
      }
      else {
        et = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
        dTmsp = d.getTime() / 1000;
        eTmsp = et.getTime() / 1000;
        hrs = d.getHours();
      }

      var zn = 'AM';
      var mins = d.getMinutes();
      var tArray = [];
      while (dTmsp < eTmsp)
      {
        var tStr = '';
        var m = '';
        var h = '';
        if (hrs == 0 && mins == 0)
          tArray.push('12:00 AM');
        if (mins >= 0 && mins < 15)
          m = '15';
        else if (mins >= 15 && mins < 30)
          m = '30';
        else if (mins >= 30 && mins < 45)
          m = '45';
        else if (mins >= 45)
        {
          m = '00';
          mins -= 60;
          ++hrs;
        }
        h = hrs;
        if (hrs >= 12)
        {
          zn = 'PM';
          h -= 12;
        }
        if (h == 0)
          h = 12;
        mins += 15;
        dTmsp += 900;
        var tStr = h + ":" + m + " " + zn;
        if ($.inArray(tStr, tArray) == -1)
        {
          tArray.push(tStr);
          if (h < 10)
            tArray.push('0' + tStr);
        }
      }
      $this.autocomplete({
        minLength: 1,
        source: function (req, res) {
          var re = $.ui.autocomplete.escapeRegex(req.term);
          var matcher = new RegExp("^" + re, "i");
          res($.grep(tArray, function (item) {
            return matcher.test(item);
          }));
        },
        change: function () {
          if ($.inArray($this.val(), tArray) < 0)
          {
            $this.val('').addClass('error');
            return false;
          }
          else
            $this.removeClass('error');
        },
        select: function (evt, ui) {
          if ($('#' + $this.parents('.dtpkr-bx').data('trgt')).find('.tm').length)
            $('#' + $this.parents('.dtpkr-bx').data('trgt')).find('.tm').text(ui.item.value);
          else {
            // for debate creation callender
            var dt = $('#' + $this.parents('.dtpkr-bx').data('trgt')).val();
            $('#' + $this.parents('.dtpkr-bx').data('trgt')).val('');
            $('#' + $this.parents('.dtpkr-bx').data('trgt')).attr('value', dt + ui.item.value);
          }
//          $this.parents('.dt-tm').find('.dt-mth > .tm').text(ui.item.value);
          trgt.getTmsp(ui.item.value);
          $("#" + $(this).parents('.dtpkr-bx').data('trgt')).siblings(".popout").find(".tmpkr").attr("value", ui.item.value);
        }
      });
      $this.autocomplete("option", "position", {
        my: "right bottom",
        at: "right top"
      });
    },
    getTmsp: function (tm) {
      var $this = $(this), date = null,
              hrs = 0, mins = 0, tmpDt = new Date();
      if (tm)
      {
        var tmp = tm.split(':');
        var hrs = parseInt(tmp[0]);
        var zn = tmp[1].split(' ');
        mins = zn[0];
        if (zn[1] == 'PM' && hrs != 12)
          hrs += 12;
        if (zn[1] == 'AM' && hrs == 12)
          hrs = 0;
      }
      if ($this.val() != '' && $this.val() != undefined)
      {
        var d = ($this.val()).split('/');
        var date = new Date(d[2], d[1] - 1, d[0], hrs, mins);
        if (date == 'Invalid Date' || date == undefined) {
          var d = ($this.data('dt')).split('/');
          var date = new Date(d[2], d[1] - 1, d[0], hrs, mins);
        }
      }
      else if ($this.data('dt') != undefined)
      {
        var d = ($this.data('dt')).split('/');
        var date = new Date(d[2], d[1] - 1, d[0], hrs, mins);
      }
      else
        var date = new Date(tmpDt.getFullYear(), tmpDt.getMonth(), tmpDt.getDate(), hrs, mins);
      $this.data('tmsp', Math.floor(date.getTime() / 1000));
    },
    loadRightPane: function ()
    {
      var frame = null;
      if ($('#happening-now a[href="#context"]').hasClass('disabled') && !$(this).isMobile())
      {
        frame = $('#stream > .frame');
        if (!frame.data('sly'))
          frame.enableSlider();
        if ($('#cvr-img').data('usr') != undefined)
        {
          frame.parent().attr('id', 'context');
          var usr = $('#cvr-img').data('usr');
          $('#right-bar').find('h2:first').html('<a href="/' + usr['unme'].toLowerCase() + '">' + usr['nme'] +
                  '</a>').addClass('in');
          frame.loadData({
            'tab': 'context',
            'usr': usr['unme']
          });
        }
        else
        {
          $('#right-bar').find('h2:first').addClass('in');
          var dt = {};
          if ($('#cvr-img').data('info') != undefined)
          {
            dt = {
              'tp': 'S',
              'id': $('#cvr-img').data('info')['id']
            };
          }
          else if ($('#admin').data('info') != undefined)
          {
            dt = {
              'tp': 'S',
              'id': $('#admin').data('info')['id']
            };
          }
          else
            dt = {'tab': 'stream'};
          frame.loadData(dt);
        }
      }
      else
      {
        var desc = $('.stry._actv').data('desc');
        var url = (document.URL).toLowerCase().split('/'), htg = null;
        if (desc)
        {
          if (desc['Htgs'])
            htg = desc['Htgs'].split(',')[0];
        }
        else
          htg = url[url.length - 1];

        $('#right-bar').find('h2:first').html('Trending on <a href="/hashtag/' + htg.toLowerCase() + '">#' + htg + '</a>').addClass('in');

        frame = $('#context > .frame');
        if (frame.data('sly'))
          frame.sly('reload');
        else
          frame.enableSlider();
        // For loading right pane in user profile pages
        if ($('#cvr-img').data('usr'))
        {
          frame.loadData({
            'tab': 'context',
            'usr': $('#cvr-img').data('usr')['unme']
          });
        }
        else if (desc || $.inArray('hashtag', url) !== -1) //view or hashtag pages
        {
          var data = {
            'tab': 'context',
            'tp': 'H',
            'htg': htg
          };

          if (desc)
          {
            data.tp = desc['tp'];
            data.id = desc['ID'];
          }

          if (url[3] == "storydraft")
            data.tab = "stream";
          frame.loadData(data);
        }
        else
        {
          $('#right-bar').find('h2:first').addClass('in');
          frame.loadData({
            'tab': 'stream'
          });
        }
      }
    },
    loadData: function (options) {
      variables.user = $(this).getLoggedInUsr(0);
      ldElem($(this), options);
    },
    addNews: function (options) {
      var $this = $(this);
      if (!variables.loading && $this.find('.nws-tl, .spc').length && !variables.isCmplt)
      {
        variables.loading = true;
        if (variables.prevtp != options.cgry && options.cgry != 'dad')
        {
          variables.prevtp = options.cgry;
          variables.prevNws = 15;
        }
        else
          variables.prevNws += 6;

        $.ajax(api + '/gts', {
          dataType: 'json',
          async: true,
          type: 'post',
          data: {
            'page': variables.nxpg,
            'ctgy': options.cgry,
            'cnt': 6,
            'htg': options.htg,
            'kwd': options.kwd,
            'pc': variables.prevNws,
            'type': options.tl_tp,
            'auth': $this.getShIntr(),
            'usr': $this.getLoggedInUsr(),
            'usr2': options.usr2,
            'sid': options.spcId,
            'tp': options.tp,
            'sdt': options.sdt,
            'edt': options.edt
          },
          beforeSend: function () {
            if (variables.isCmplt)
            {
              $this.find('img.loading').positionElement({
                'parent': $this,
                'top': false
              });
              return false;
            }
          },
          success: function (posts) {
            if (posts.success)
            {
              posts = posts['msg'];
              for (var d = 0; d < posts.length; d++)
              {
                var nws = posts[d];
                if (options.tl_tp != 'S')
                {
                  $this.append(buildStryTl(nws, (options.isSpc != undefined ? options.isSpc : 0)))
                          .find('.nws-tl:last .tmsp').updateTime();
                  $this.find(".icn").each(function () {
                    $(this).find('img').findPrfPic();
                  });
//                $this.chkPrfPic((nws['D_ID'] != undefined ? $("body").data("bunme") : nws.P_Author), (nws.P_Id ? nws.P_Id : nws.D_ID));
                  if (!$this.isMobile())
                    setPosition($this.find('.nws-tl:last'), $this);
                  else
                    $this.find('.nws-tl:last').addClass('in');
                }
                else
                  buildSpaces(nws, $this);

                if (d == posts.length - 1)
                  variables.loading = false;
              }
              if (posts.length < 6)
                variables.isCmplt = true;
            }
          },
          complete: function () {
            $this.find(' > .loading').remove();
            if (variables.isCmplt)
            {
              var lstTl = $this.find('.nws-tl:last');
              var heigt = $(document).height();
              $this.append('<div class="btm-link" style="position: absolute; top: ' + heigt + 'px; left: 0; right: 0; margin-bottom: 60px; text-align:center;"><a>That\'s all we have got for now!</a></div>');
              setEndPosition($this.find('.end'), $this);
            }
            variables.nxpg++;
          }
        });
      }
    },
    loadNews: function (options) {
      var $this = $(this);
      if (!$this.find('.loading').length)
        $this.append("<div class='loading sml'></div>");
      var cnt = options.cgry == 'dad' ? 6 : 15;
      $.ajax(api + '/gts', {
        data: {
          'sid': options.spcId,
          'tp': options.tp,
          'ctgy': options.cgry,
          'page': 1,
          'htg': options.htg,
          'cnt': cnt,
          'kwd': options.kwd,
          'pc': 0,
          'auth': $this.getShIntr(),
          'usr': $this.getLoggedInUsr(),
          'usr2': options.usr2,
          'type': options.tl_tp,
          'scat': options.scat,
          'sdt': options.sdt,
          'edt': options.edt
        },
        dataType: 'json',
        async: true,
        type: 'post',
        success: function (data) {
          if (data != null)
          {
            data = data.msg;
            var d = 0;
            while (d < data.length)
            {
              var nws = data[d];
              if (options.tl_tp != 'S')
              {
                if (!nws.D_Content)
                {
                  if (nws.P_Id == '')
                    nws.P_Id = "tmp" + Math.floor(new Date().getTime() / 1000);
                }
                $this.append(buildStryTl(nws, options.isSpc)).find('.nws-tl:last')
                        .find('.tmsp').updateTime();
                $this.find(".icn").each(function () {
                  $(this).find('img').findPrfPic();
                });
//              $this.chkPrfPic((nws['D_ID'] != undefined ? $("body").data("bunme") : nws.P_Author), (nws.P_Id ? nws.P_Id : nws.D_ID));
                if (!$this.isMobile())
                  setPosition($this.find('.nws-tl:last'), $this);
                else
                  $this.find('.nws-tl:last').addClass('in');

                if (nws.P_Id == "wb2b8bdbf4920d4569fb3935628a4bdd3") //wishbery static tile
                  bruteForceWb();
              }
              else
                buildSpaces(nws, $this);

              d++;
            }
          }
        },
        complete: function () {
          $this.find('> .loading').remove();
          if (!$this.find('.nws-tl, .spc').length)
          {
            if (options.tl_tp == 'P' || options.htg != null)
              $("#rltd-bx").removeClass("hideElement");
            else {
              var msg = '';
              switch (options.cgry)
              {
                case 'R':
                  msg = "You are an avid reader. You have marked nothing to read later.";
                  break;
                case 'U':
                  msg = "You don't have any story waiting for moderators approval.";
                  break;
                case 'M':
                  msg = "You don't have any stories.";
                  break;
                case 'I':
                  msg = "You don't have any stories.";
                  break;
                case 'F':
                  msg = "You got to have something as your favorite! Pick them up so that we can show them here.";
                  break;
                case 'D':
                  msg = "You don't have any drafts.";
                  break;
                case 'MA':
                  msg = "You don't have any story assigned to Moderate.";
                  break;
                case 'MU':
                  msg = "You don't have any stories to Moderate.";
                  break;
                case 'Articles':
                  msg = "No stories found.";
                  break;
                case 'politics':
                case 'technology':
                case 'sports':
                case 'entertainment':
                default:
                  msg = "We couldn't find any stories.";
                  break;
              }
              if (!$this.find("#page" + variables.nxpg).length)
                $this.append("<div id='page" + variables.nxpg + "'><div class='btm-link'><a>" + msg + "</a></div></div>");
            }
          }
          if ($this.parent().find('.end').length || $this.siblings('.end').length)
          {
            var lstTl = $this.find('.nws-tl:last');
            $this.siblings('.end').removeClass('hideElement').css('top', (parseInt(lstTl.css('top')) + $this.find('.nws-tl:last').outerHeight()) + 'px');
          }
          if ($this.attr("id") == "srch-tls")
            $("#srch-rslt").find(".frame").enableSlider();
        }
      });
    },
    buildLists: function (dt, url) {
      var $this = $(this);
      dt.auth = $this.getShIntr();
      dt.usr = $this.getLoggedInUsr();
      var str, res;
      $.ajax(api + url, {
        data: dt,
        async: false,
        type: 'post',
        success: function (dt) {
          dt = JSON.parse(dt);
          if (dt.success) {
            var imgPath = $('#user-nav').data('isLive') ? "https://saddahaq.blob.core.windows.net/multimedia/" :
                    $("body").data("auth") + "/public/Multimedia/";
            for (var i = 0; i < dt['msg'].length; i++) {
              str = '<div class="_spcItm">' +
                      '<div class="_hdr">' +
                      '<div class="pull-left">' +
                      '<a href="/" class="icn pull-left" target="_blank">' +
                      '<img src="' + imgPath + dt['msg'][i]['ID'] + '">' +
                      '</a>' +
                      '<p>' +
                      '<a href="/' + dt['msg'][i]['Title_ID'] + '" class="user-small" target="_blank">' + dt['msg'][i]['Title'] + '</a>' +
//                      '<span class="block dft-msg">Created by ' + dt['msg'][i]['FN'] + '</span>' +
                      '</p>' +
                      '</div>' +
                      '<div class="pull-right _itmOpt">' +
                      '<a class="popper br transition in" href="#"><i class="icon-cog"></i></a>' +
                      '<div class="popout" data-dir="btm sml">' +
                      '<ul class="nav-pop" id="lst-opt" data-actn = "/sdm" data-id="' + dt['msg'][i]['ID'] + '">' +
                      '<li><a href="#" class="aprv" data-val="1"><i class="icon-ok"></i>Approve</a></li>' +
                      '<li><a href="#" class="rjct" data-val="0"><i class="icon-remove"></i>Reject</a></li>' +
                      '</ul>' +
                      '</div>' +
                      '</div>' +
                      '<div class="clearfix"></div>' +
                      '</div>' +
                      '<hr>' +
                      '</div> ';
              $this.append(str);
            }
            res = dt['msg'].length;
          }
          else
            $('#sts-msg').showStatus(dt.msg, "err");
        },
        complete: function () {
          $this.find("img").each(function () {
            $(this).findPrfPic(0, 1);
          });
        }
      });
      return res;
    },
    ldSpcLst: function (dt) {
      var $this = $(this);
      if (!variables.isGsuEnd)
      {
        dt.auth = $this.getShIntr();
        dt.usr = $this.getLoggedInUsr();
        $.ajax(api + '/gsu', {
          data: dt,
          dataType: 'json',
          async: true,
          type: 'post',
          success: function (data) {
            data = data.msg;
            var d = 0;
            if (data.length == 0) {
              variables.isGsuEnd = true;
              if (dt.tp == "c")
              {
                if ($this.find('.spc').length)
                  $this.append("<div class='btm-link'>That's all you have created till now!</div>");
                else
                  $this.append("<div class='emty-sts'>Oops! You are yet to create your first space.<br>" +
                          "<a href='" + $('body').data('auth') + "/new/space'>Create a new space</a></div>");
              }
              else
              {
                if ($this.find('.spc').length)
                  $this.append("<div class='btm-link'>That's all you have got for now!</div>");
                else
                  $this.append("<div class='btm-link'>unfortunately, you are not following any spaces</div>");
              }
            }
            else
            {
              for (var d = 0; d < data.length; d++)
              {
                buildSpaces(data[d], $this);
              }
            }
            // console.log(d);
          }
        });
      }
    },
    updateTime: function (options) {
      if (options != undefined)
        var ts = options.ts;
      else
        var ts = $(this).attr('tmsp');
      if (ts == 'undefined' || !ts)
        return false;
      var tmsp = new Date(ts * 1000);
      var td = new Date();
      var diff = Math.floor((td.getTime() - tmsp.getTime()) / 1000);
      var month = new Array();
      month[0] = "Jan";
      month[1] = "Feb";
      month[2] = "Mar";
      month[3] = "Apr";
      month[4] = "May";
      month[5] = "Jun";
      month[6] = "Jul";
      month[7] = "Aug";
      month[8] = "Sep";
      month[9] = "Oct";
      month[10] = "Nov";
      month[11] = "Dec";

      if (diff < 60)
        $(this).text('A few sec ago');
      else if (diff >= 60 && diff < 3600)
      {
        var tmp = Math.floor(diff / 60);
        if (tmp == 1)
          $(this).text('A min ago');
        else
          $(this).text(tmp + 'min ago');
      }
      else if (diff >= 3600 && diff < 86400)
      {
        var tmp = Math.floor(diff / (60 * 60))
        if (tmp == 1)
          $(this).text('An hr ago');
        else
          $(this).text(tmp + 'hrs ago');
      }
      else if (diff >= 86400 && diff < 2592000)
      {
        var tmp = Math.floor(diff / (60 * 60 * 24));
        if (tmp == 1)
          $(this).text('A day ago');
        else
          $(this).text(tmp + 'days ago');
      }
      else
      {
        $(this).text(month[tmsp.getMonth()] + " " + tmsp.getDate() + ", " + tmsp.getFullYear());
      }
    },
    chkVrfd: function () {
      if ($('#user-navigation').length)
      {
        if ($('#user-navigation').data('vfd') != 1)
        {
          $('#sts-msg').showStatus('You need to verify your account before posting anything! <span id="rsnd-eml" class="row-fluid"><a href="#" class="block bdr rsnd-eml ref">Resend Verification email</a>' +
                  '<a href="/settings" class="block bdr ref">Go to settings page</a></span>', 'err');
          return 0;
        }
        else
          return 1;
      }
      else if ($(this).hasClass('skp-lgn'))
        return 1;
      else
        $(this).showLgnPopup(1);
    },
    showLgnPopup: function (askLgn, size) {
      if ($('#pop-prw').find('#lgn-frm').length)
      {
        $('#pop-prw > section').showPopup(size);
        if (askLgn)
          $('#pop-prw').find('.err-msg').text('You need to login to perform this action');
      }
      else
      {
        $.ajax({
          url: $('body').data('api') + '/gtf',
          type: 'post',
          data: {
            'id': 'lgn',
            'ref': window.location.href
          },
          success: function (data) {
            data = JSON.parse(data);
            $('#pop-prw > section').html(data['frm']).showPopup(size);
            if (askLgn)
              $('#pop-prw').find('.err-msg').text('You need to login to proceed further');
          }
        });
      }
    },
    chkExtLgn: function (clk) {
      var $this = $(this);
      var win = window.open($("body").data("auth") + "/extlogin", "", "width=600, height=450");
      var pollTimer = window.setInterval(function () {
        try {
          if ($this.getShIntr()) {
            window.clearInterval(pollTimer);
            win.postMessage("ChkSHLgn", $("body").data("auth"));
            if (clk == 1)
              $this.trigger("click");
            else if (clk == 2)
              $this.submit();
          }
        } catch (e) {
        }
      }, 500);
    },
    enableSlider: function () {
      var frame = $(this);
      var opt = null;
      if (frame.find('> ul').length)
      {
        opt = {
          itemNav: 'basic',
          smart: 1,
          activateOn: null,
          mouseDragging: 1,
          touchDragging: 1,
          releaseSwing: 1,
          startAt: 0,
          scrollBar: frame.siblings('.scrollbar'),
          scrollBy: 1,
          speed: 300,
          elasticBounds: 1,
          easeing: 'easeOutExpo',
          dragHandle: 1,
          dynamicHandle: 1,
          clickBar: 1
        };
      }
      else
      {
        opt = {
          speed: 300,
          scrollBar: frame.siblings('.scrollbar'),
          scrollBy: 120,
          easing: 'easeOutExpo',
          dragHandle: 1,
          dynamicHandle: 1,
          clickBar: 1,
          touchDragging: 1,
          releaseSwing: 1
        };
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        {
          opt.forward = frame.siblings('#rltd-nav-btns').find('.rltd-dwn');
          opt.backward = frame.siblings('#rltd-nav-btns').find('.rltd-up');
          opt.moveBy = 4800;
        }
      }
      var sly = new Sly(frame, opt);
      sly.init();
      if (sly.pos['start'] == sly.pos['end'])
        frame.siblings('.scrollbar').addClass('transparent').removeClass('opq');
      else
        frame.siblings('.scrollbar').removeClass('transparent').addClass('opq');
      frame.data('sly', sly);
      if (frame.parent().hasClass('tab-pane') || frame.find("#srch-tls").length)
        frame.loadOnScroll();
      else
        return sly;
    },
    loadOnScroll: function () {
      var frame = $(this);
      var sly = null;
      if (frame.data('sly'))
      {
        sly = frame.data('sly');
        sly.on('move', function () {
          var pos = sly.pos;
          var id = frame.parent().attr('id');
          if (pos['dest'] > pos['end'] * 0.9 && !variables.slyLoading)
          {
            variables.slyLoading = true;
            frame.loadRightPane();
          }
        });
      }
    },
    showPopup: function (size, x) {
      var $this = $(this).parents('.pop-par');
      $this.addClass('view');
      $('#con-del').removeClass('in'); // TO hide confirmation popups
//      $this.addClass('view');
//      if (size)
//        $this.addClass('big');
//      else
//        $this.removeClass('big');
      if ($('#popout').hasClass("in")) {
        var trgt = $('#popout');
        trgt.removeAttr('class').contents().not('.arrow').remove();
        $('.popper._opn').removeClass('_opn');
        setTimeout(function () {
          trgt.removeAttr('style');
        }, 100);
      }

    },
    getShIntr: function () {
      var cookiesArray = document.cookie.split(';'); //Splitting bcoz there might be other cookies like piwik related
      var shIntr = '';
      for (var i = 0; i < cookiesArray.length; i++) {
        var cookieArray = cookiesArray[i].split('=');
        if (cookieArray[0].indexOf('shIntr') == 1 || cookieArray[0].indexOf('shIntr') == 0) {
          shIntr = cookieArray[1];
        }
      }
      return shIntr;
    },
    getLoggedInUsr: function (bunme) {
      if (!bunme) {
        var usrlg = $('#user-navigation').length ? $('#user-navigation').data('unme').split('::') : '';
        return usrlg.length ? usrlg[0] : 0;
      }
      var ssnUsr;
      $.ajax({
        url: '/haq',
        async: false,
        type: 'POST',
        success: function (res) {
          res = JSON.parse(res);
          if (bunme == 1)
            ssnUsr = res.BaseUserName;
          else
            ssnUsr = res.UserName;
        }
      });
      return ssnUsr ? ssnUsr : '0';
    },
    chkPrfPic: function (usr, id) {
//      var src = '/public/Multimedia/P_Pic_' + usr;
      var trgt = $(this).find('#' + id).find('.auth-bx .usr-img');
//      if ($('#user-nav').data('isLive'))
      var src = 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' + usr;
      var img = new Image();
      img.src = src;
      img.onload = function () {
        trgt.prepend('<img src="' + src + '" class="thumbholder" align="absmiddle" />');
      };
      img.onerror = function () {
        trgt.prepend('<img src="/public/images/user.png" class="thumbholder pull-left" align="absmiddle" width="40" height="40" />');
        if (id == "wb2b8bdbf4920d4569fb3935628a4bdd3") //wishberry static tile
          trgt.prepend('<img src="/public/images/wishberry-logo.png" class="thumbholder pull-left" align="absmiddle" width="40" height="40" />');
      };
      trgt.find('img:last').remove();
    },
    findPrfPic: function (icon, spc) {
      var $this = $(this);
      var img = new Image();
      img.src = $this.attr('src');
      img.onerror = function () {
        if (spc)
          $this.replaceWith('<img src="' + $('body').data('auth') + '/public/images/dft-spc.png" />');
        else
        {
          if (icon == 1)
            $this.replaceWith("<i class=icon-profile></i>");
          else
            $this.replaceWith('<img src="' + $('body').data('auth') + '/public/images/user.png" />');
        }
      };
    },
    // $this -> trigger, trgt -> #popout
    setPopPosition: function (trgt) {
      var $this = $(this);
      if (trgt.hasClass('top') || trgt.hasClass('btm'))
      {
        if (trgt.hasClass('top'))
          trgt.css({'top': ($this.offset().top - trgt.outerHeight() - 8) + 'px'});
        else if (trgt.hasClass('btm'))
          trgt.css({'top': (($this.outerHeight() + $this.offset().top) + 7) + 'px'});
        if (!($this.hasClass('bl') || $this.hasClass('br')))
        {
          trgt.css({'left': ($this.offset().left - ((trgt.outerWidth() - $this.outerWidth()) / 2)) + 'px', 'right': 'auto'});
          if (trgt.offset().left < 0)
            trgt.css({'left': '0', 'right': 'auto'}).find('arrow').css('left', ($this.outerWidth() / 2 - 4) + 'px');
          else if ($(window).width() <= Math.ceil(trgt.offset().left + trgt.outerWidth()))
            trgt.css({'left': 'auto', 'right': ($(window).width() - ($this.offset().left + $this.outerWidth()) - 4) + 'px'}).find('.arrow').css({'left': (trgt.outerWidth() - 4 - $this.outerWidth() / 2) + 'px'});
        }
        else
        {
          if ($this.hasClass('bl'))
            trgt.css({'left': $this.offset().left + 'px', 'right': 'auto'}).find('.arrow')
                    .css('left', ($this.outerWidth() / 2) + 'px');
          else
            trgt.css({'left': ($this.offset().left + $this.outerWidth() - trgt.outerWidth()) + 'px', 'right': 'auto'})
                    .find('.arrow').css('left', (trgt.outerWidth() - ($this.outerWidth() / 2) + 4) + 'px');
        }
      }
      else
      {
        trgt.css('top', ($this.offset().top - (trgt.outerHeight() - $this.outerHeight()) / 2) + 'px');
        if (trgt.hasClass('right'))
          trgt.css({'left': ($this.offset().left + $this.outerWidth() + 11) + 'px'});
        else if (trgt.hasClass('left'))
          trgt.css({'left': -(trgt.outerWidth() + 11) + 'px'});

        if (trgt.offset().top < 0)
          trgt.css({'top': parseInt(trgt.css('top')) + trgt.offset().top}).find('.arrow').css('top', ($this.outerHeight() / 2 - 5) + 'px');
        else if ($(window).outerHeight() <= Math.ceil(trgt.scrollHeight - trgt.offset().top + trgt.outerHeight()))
        {
          var trgtBtm = Math.ceil(trgt.outerHeight() + trgt.offset().top), arw = trgt.find('.arrow');
          trgt.css({'top': (parseInt(trgt.css('top')) - (trgtBtm - $(window).height()) - 8) + 'px'});
          arw.css('top', (parseInt(arw.css('top')) + (trgtBtm - $(window).height()) + 22) + 'px');
        }
      }
    },
    shwErr: function (dir, msg) {
      var trgt = $('#tooltip'), $this = $(this);
      $this.addClass('_err-actv');
      trgt.removeAttr('class').addClass(dir + ' _tltp-err in').find('p').html(msg);
      $this.setPopPosition(trgt);
      setTimeout(function () {
        $("#tooltip").removeClass('in');
      }, 4000);
      return false;
    },
    adjustInputPos: function () {
      var inptr = $(this), trgt = inptr.parent(), prv = inptr.prev('li');
      prv = prv.length ? (prv.outerWidth() + prv.offset().left) : 0;
      if (((trgt.outerWidth() + trgt.offset().left) - prv) < 160)
        inptr.css('width', '100%');
      else
        inptr.css('width', ((trgt.offset().left + trgt.outerWidth()) - (inptr.prev('li').length ? (inptr.prev('li').outerWidth() + inptr.prev('li').offset().left) : 0) - 16));
    },
    loadSpcCvrImg: function () {
      var ttl_ar = 0, trgt = $(this), cvr = trgt.data('cvr');
      var img = new Image();
      img.src = ($('#user-nav').data('isLive') ? 'https://saddahaq.blob.core.windows.net/multimedia/' : $('body').data('auth') + '/public/Multimedia/') + (typeof cvr == 'object' ? cvr['cvr'] : trgt.data('cvr'));
      img.onload = function () {
        ttl_ar = parseFloat((this.width / this.height).toFixed(3));
        var adStr = '<figure class="img-fig box fade transition" tabindex="0">' +
                '<div class="ar-hldr">' +
                '<div class="ar"></div>' +
                '<img src="' + img.src + '" ' + (typeof cvr == 'object' ? 'style="top:' + cvr['top'] + 'px"' : '') + ' />' +
                '</div></figure>';
        trgt.append(adStr);
        trgt.find('figure img').on('load', function () {
          var img = $(this), img_ar = parseFloat((this.naturalWidth / this.naturalHeight).toFixed(3));
          img.siblings('.ar').css('padding-bottom', (100 / img_ar) + '%');
          img.parents('figure').css('width', ((img_ar / ttl_ar) * 100) + '%').addClass('in');
        });
      };
    },
    isMobile: function () {
      if (navigator.userAgent.match(/Android/i)
              || navigator.userAgent.match(/webOS/i)
              || navigator.userAgent.match(/iPhone/i)
              || navigator.userAgent.match(/iPod/i)
              || navigator.userAgent.match(/BlackBerry/i)
              || navigator.userAgent.match(/IEMobile/i)
              ) {
        return true;
      }
      else {
        return false;
      }
    },
    buildNtfs: function () {
      var $this = $(this), usr = $this.getLoggedInUsr(), flag;
      var data = {};
      data.auth = $this.getShIntr();
      data.usr = $this.getLoggedInUsr();
      if ($this.attr('id') == 'notifications')
        var pg = 1;

      if (pg) {
        data.pc = $this.find('li').length;
        data.cnt = 10;
      } else {
        data.pc = 0;
        data.cnt = 5;
      }
      $.ajax(api + '/ntfs', {
        data: data,
        async: false,
        type: 'post',
        success: function (ndata) {
          var d = JSON.parse(ndata);
          d = d.msg;
          flag = d.length;
          if (!d.length)
            $this.append('<li class="nontf">No notifications</li>');

          else
          {
            var imgsrcbase = $('#user-nav').data('isLive') ? 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' : '/public/Multimedia/P_Pic_';
            for (var i = 0; i < d.length; i++)

            {
              var tag = '', ttl = '', href = '';
              switch (d[i].N_Type)
              {
                case 'Q':
                  if (d[i].N_Tag == '@')
                    tag = 'posted';
                  href = '#';
                  ttl = d[i].N_Content;
                  break;
                case 'A':
                  ttl = d[i].N_Article_Event_Title;
                  var cntnt = $this.stripHtml(d[i].N_Content);
                  if (d[i].N_Tag == 'V')
                    tag = "votedup " + (d[i].N_Author == usr ? "your" : d[i].N_Author_Full_Name + "'s");
                  else if (d[i].N_Tag == 'CM')
                    tag = "commented on " + (d[i].N_Author == usr ? "your" : d[i].N_Author_Full_Name + "'s");
                  else if (d[i].N_Tag == '@')
                    tag = 'mentioned you in the story';
                  else if (d[i].N_Tag == 'CC')
                    tag = 'replied to your comment in';
                  else if (d[i].N_Tag == 'U')
                    tag = 'votedup your comment in';
                  else if (d[i].N_Tag == 'D')
                    tag = 'voteddown your comment in';
                  else if (d[i].N_Tag == 'P')
                    tag = 'answered a poll in';
                  else if (d[i].N_Tag == 'M')
                    tag = 'assigned this story to moderate';
                  else if (d[i].N_Tag == '@C')
                    tag = 'mentioned you in a comment in';
                  else if (d[i].N_Tag == 'TS' && d[i].Space_Mode == 2)//moderator tagged
                    tag = 'tagged <span class="ttl">' + d[i].N_Author_Full_Name + '\'s</span> story to ';
                  else if (d[i].N_Tag == 'TS')
                    tag = 'tagged <span class="ttl">"' + (cntnt ? (cntnt.length > 40 ? $(this).buildTxt(cntnt).substr(0, 37) + '...' : cntnt) : '') + '"</span> to ';
                  else if (d[i].N_Tag == 'IR')
                    tag = "wrote a story in response to"; //started a petition; is organizing an event;
                  else if (d[i].N_Tag == 'I')
                    tag = 'invited you to see';

                  href = $('body').data('auth') + d[i].N_Link;
                  break;
                case 'E':
                  ttl = d[i].N_Article_Event_Title;
                  var cntnt = $this.stripHtml(d[i].N_Content);
                  if (d[i].N_Tag == 'A')
                    tag = (d[i].N_Refer_To.split(",").length > 1 ? 'are' : 'is') + " attending " + (d[i].N_Author == usr ? "your" : d[i].N_Author_Full_Name + "'s");
                  else if (d[i].N_Tag == 'CM')
                    tag = "commented on " + (d[i].N_Author == usr ? "your" : d[i].N_Author_Full_Name + "'s");
                  else if (d[i].N_Tag == 'N')
                    tag = 'sent a notification in event';
                  else if (d[i].N_Tag == 'U')
                    tag = 'votedup your comment in';
                  else if (d[i].N_Tag == 'D')
                    tag = 'voteddown your comment in';
                  else if (d[i].N_Tag == 'I')
                    tag = 'invited you to event';
                  else if (d[i].N_Tag == '@C')
                    tag = 'mentioned you in a comment in';
                  else if (d[i].N_Tag == '@')
                    tag = 'mentioned you in event';
                  else if (d[i].N_Tag == 'CC')
                    tag = 'replied to your comment in';
                  else if (d[i].N_Tag == 'TS' && d[i].Space_Mode == 2)//moderator tagged
                    tag = 'tagged <span class="ttl">' + d[i].N_Author_Full_Name + '\'s</span> event to ';
                  else if (d[i].N_Tag == 'TS')
                    tag = 'tagged <span class="ttl">"' + (cntnt ? (cntnt.length > 40 ? $(this).buildTxt(cntnt).substr(0, 37) + '...' : cntnt) : '') + '"</span> to ';
                  else if (d[i].N_Tag == 'IR')
                    tag = 'is organizing an event in response to';
                  else if (d[i].N_Tag == 'I')
                    tag = 'invited you to see';
                  href = $('body').data('auth') + d[i].N_Link;
                  break;
                case 'P':
                  ttl = d[i].N_Article_Event_Title;
                  var cntnt = $this.stripHtml(d[i].N_Content);
                  if (d[i].N_Tag == 'S')
                    tag = "signed " + (d[i].N_Author == usr ? "your" : d[i].N_Author_Full_Name + "'s");
                  else if (d[i].N_Tag == 'CM')
                    tag = "commented on " + (d[i].N_Author == usr ? "your" : d[i].N_Author_Full_Name + "'s");
                  else if (d[i].N_Tag == 'SC')
                    tag = 'reached target signatures';
                  else if (d[i].N_Tag == '@')
                    tag = 'mentioned you in the petition';
                  else if (d[i].N_Tag == 'CC')
                    tag = 'replied to your comment in';
                  else if (d[i].N_Tag == 'U')
                    tag = 'votedup your comment in';
                  else if (d[i].N_Tag == 'D')
                    tag = 'voteddown your comment in';
                  else if (d[i].N_Tag == '@C')
                    tag = 'mentioned you in a comment in';
                  else if (d[i].N_Tag == 'TS' && d[i].Space_Mode == 2) //moderator tagged
                    tag = 'tagged <span class="ttl">' + d[i].N_Author_Full_Name + '\'s</span> petition to ';
                  else if (d[i].N_Tag == 'TS')
                    tag = 'tagged <span class="ttl">"' + (cntnt ? (cntnt.length > 40 ? $(this).buildTxt(cntnt).substr(0, 37) + '...' : cntnt) : '') + '"</span> to ';
                  else if (d[i].N_Tag == 'IR')
                    tag = 'started a petition in response to';
                  else if (d[i].N_Tag == 'I')
                    tag = 'invited you to see';
                  href = $('body').data('auth') + d[i].N_Link;
                  break;
                case 'U':
                  ttl = $("body").data("user");
                  if (d[i].N_Tag == 'F')
                    tag = 'started following';
                  href = $('body').data('auth') + d[i].N_Link;
                  break;
                case 'S':
                  ttl = d[i].N_Article_Event_Title;
                  if (d[i].N_Tag == 'F')
                    tag = 'started following this space';
                  else if (d[i].N_Tag == 'C')
                    tag = 'created this space';
                  else if (d[i].N_Tag == 'A')
                    tag = 'added as admin to space';
                  else if (d[i].N_Tag == 'I')
                    tag = 'invited you to see';
                  href = $('body').data('auth') + d[i].N_Link;
                  break;
                case 'D' :
                  ttl = d[i].N_Article_Event_Title;
                  var cntnt = $this.stripHtml(d[i].N_Content);
                  if (d[i].N_Tag == 'TS' && d[i].Space_Mode == 2)//moderator tagged
                    tag = 'tagged <span class="ttl">' + d[i].N_Author_Full_Name + '\'s</span> debate to ';
                  else if (d[i].N_Tag == 'TS')
                    tag = 'tagged <span class="ttl">"' + (cntnt ? (cntnt.length > 40 ? $(this).buildTxt(cntnt).substr(0, 37) + '...' : cntnt) : '') + '"</span> to ';
                  else if (d[i].N_Tag == 'I')
                    tag = 'invited you to see';
                  if ($('#user-nav').data('isLive'))
                    href = "https://debate.saddahaq.com/" + d[i].N_Link;
                  else
                    href = "https://dt.saddahaq.com/" + d[i].N_Link;
                  break;
                case 'T' :
                  ttl = d[i].N_Article_Event_Title;
                  var cntnt = $this.stripHtml(d[i].N_Content);
                  if (d[i].N_Tag == 'TS' && d[i].Space_Mode == 2)//moderator tagged
                    tag = 'tagged <span class="ttl">' + d[i].N_Author_Full_Name + '\'s</span> townhall to ';
                  if (d[i].N_Tag == 'TS')
                    tag = 'tagged <span class="ttl">"' + (cntnt ? (cntnt.length > 40 ? $(this).buildTxt(cntnt).substr(0, 37) + '...' : cntnt) : '') + '"</span> to ';
                  else if (d[i].N_Tag == 'I')
                    tag = 'invited you to see';
                  if ($('#user-nav').data('isLive'))
                    href = "https://townhall.saddahaq.com/" + d[i].N_Link;
                  else
                    href = "https://tt.saddahaq.com/" + d[i].N_Link;
                  break;
              }
              var skpCases = ['TS', 'N', 'F', 'S', 'C', 'A', 'IR'], usrslst;
              var usrs = d[i].N_Refer_To.split(',');
              if (d[i].N_Tag == 'TS' && d[i].Space_Mode == 2) {
                usrslst = 'moderator';

              }
              else
              {
                if (d[i].N_Refer_To == '' || d[i].N_Refer_To == undefined)
                  usrslst = d[i].N_Author_Full_Name;
                else
                  usrslst = usrs[0].split(':')[1];
              }

              ttl = $(this).buildTxt(ttl, 0);

              var str = "<li class='" + (pg ? '' : 'list') + "'>" +
                      "<div class='" + (pg ? '' : 'notify transition in') + " " + (d[i].N_New ? "unrd" : "") + "'>" +
                      "<a href='" + href + "' class='box'>" +
                      "<div class='icn-big mid'>" +
                      "<img src='" + imgsrcbase +
                      (d[i].N_Refer_To == '' ? d[i].N_Author : usrs[0].split(':')[0]) + "' />" +
                      "</div>" +
                      "<p class='content'>" +
                      "<span class='" + (pg ? 'block' : '') + " user-small'>" + usrslst + "</span>";
              var mre = d[i].N_Refer_To ? d[i].N_Refer_To.split(",").length : 0;
              if (mre > 1)
                str += " and " + "<span class='shw-mre'>" + (mre - 1) + (mre == 2 ? ' other' : ' others') + "</span>";
              str += "<span class='tagd'> " + tag + " </span>";
              if (d[i].N_Type == 'S' || d[i].N_Type == 'U' || d[i].N_Tag == 'TS')
                str += "<span class='" + (d[i].N_Type == 'U' ? 'ttl' : 'spc-nm') + "'>" + (ttl.length > 80 ? ttl.substr(0, 77) + '...' : ttl) + "</span>";
              else
                str += "<span class='ttl'>\"" + (ttl.length > 80 ? ttl.substr(0, 77) + '...' : ttl) + "\"</span>" +
                        "<span class='tmsp block' tmsp='" + d[i].N_Timestamp + "'></span>" +
                        "</p>" +
                        "<div class='clearfix'></div>" +
                        "</a>" +
                        "</div>" +
                        "</li>";
              $this.append(str);
            }
          }
        },
        complete: function () {
          if (!pg)
            $this.find('.loading').remove();
          if ($this.find('li').length)
          {
            var usrPicElms = $this.find("img");
            usrPicElms.each(function () {
              $(this).findPrfPic();
            });
            //$(this).updateTime({'ts': $(this).attr('tmsp')})
            $this.find('.tmsp').each(function () {
              $(this).updateTime({
                'ts': $(this).attr('tmsp')
              });
            });
            if (!pg)
              $('#usr-ntfy li:last')
                      .after("<li class='vw-mr'><a href='/" + usr + "/Dashboard?Notifications'>view more</a><div class='clearfix'></div></li>");
          }
        }
      });
      return flag;
    }
  });
//Value of shIntr cookie and logged-in username to be used in api calls
  function split(val) {
    return val.split(/,\s*/);
  }
  function extractLast(term) {
    return split(term).pop().split('#').pop();
  }
  /* 
   * Functions moved in from rightpane.js
   * These are used to display article/event/quickpost related data
   */
  //For event related data in right pane
  function ldevt(data, to)
  {
    var ev = {
      auth: '',
      dt: '',
      mth: '',
      tm: '',
      lc: '',
      id: '',
      url: '',
      tag: '',
      tl: '',
      ctgy: '',
      tmsp: ''
    };
    if (isJSON(data.QP_Content))
    {
      var content = $.parseJSON(data.QP_Content);
      var link = (data.QP_Url).split("/");
      var date = $(to).getDateTime(content.date);
      ev.auth = data.QP_User;
      ev.authFullName = data.QP_User_FullName;
      ev.url = data.QP_Url;
      ev.dt = date['d'];
      ev.mth = date['m'];
      ev.tm = date.t;
      ev.lc = content.loc;
      ev.id = data.Article_Event_ID;
      ev.tmsp = data.QP_Timestamp;
      var btns = '';
      switch (data.QP_Tag)
      {
        case 'I':
          ev.tag = 'invited you to event';
          btns = "<button type='button' class='btn btn-success yes accept span7 offset1'>Accept</button><button type='button' class='btn no decline span7'>Decline</button>";
          break;
        case 'A':
          ev.tag = "attending <span class='ttl'>" + data.QP_Article_Event_Owner_FullName + "'s </span>";
          btns = "<button type='button' class='btn btn-success yes join span8 offset4'>Join</button>";
          break;
        case 'C':
          ev.tag = 'is organizing an event';
          ev.tag2 = '</span> <span class="tagd"> in</span><span class="ttl spc-nm">' + data.QP_Space;
          btns = "<button type='button' class='btn btn-success yes join span8 offset4'>Join</button>";
          break;
        case 'CM':
          ev.tag = 'commented on <span class="ttl">' + data.QP_Article_Event_Owner_FullName + "'s </span>";
          btns = "<button type='button' class='btn btn-success yes join span8 offset4'>Join</button>";
          break;
        case 'CC':
          ev.tag = 'replied to comment in';
          btns = "<button type='button' class='btn btn-success yes join span8 offset4'>Join</button>";
          break;
        case '@':
          ev.tag = 'mentioned you in event';
          break;
        case '@C':
          ev.tag = 'mentioned you in comment';
          break;
        case 'N':
          ev.tag = 'sent a notification in event';
          break;
      }
      if (((to == 'stream') && (data.QP_Refer_To == '') && (data.QP_Tag == 'CC') && (variables.user == data.QP_Article_Event_Owner)) || (to == 'context' && data.QP_Tag == '@C')) {
        return 0;
      }

      if ((to == 'reactions' && data.QP_Tag == 'CM') || ((variables.user == data.QP_Article_Event_Owner)
              && (data.QP_Tag != 'CC') && (data.QP_Tag != 'N') && (data.QP_Tag != 'C') && (data.QP_Tag != '@') && (data.QP_Tag != '@C'))) {
        ev.tag = 'commented on your event';
      }
      else if (variables.user == data.QP_User && data.QP_Tag == 'CC') {
        ev.tag = 'replied to your comment in';
      }

      if ((variables.user == data.QP_Article_Event_Owner) && (data.QP_Tag == 'A')) {
        ev.tag = 'attending your event';
      }

      ev.ctgy = link[2];

      if (data.E_Attending == null) {
        ev.evtgng = 0;
      }
      else if (data.E_Attending.indexOf(',')) {
        var evtgngtmp = data.E_Attending.split(',');
        ev.evtgng = evtgngtmp.length;
      }
      else {
        ev.evtgng = 1;
      }

      var txt = content.ttl;
      if (to == 'reactions') {
        if (data.QP_Tag == '@') {
          txt = content.ttl;
        }
        else {
          txt = content.cmnt;
        }
      }
      if (data.QP_Tag == 'N') {
        var usrslst = "<p class='user-small' data-href='" + data.QP_User + "' >" + data.QP_User_FullName + "</p>";
      }
      else {
        var usrslst = consolidateList(data.QP_Tag, data.QP_Refer_To, 'E', data.Article_Event_ID);
        usrslst = (usrslst != '') ? usrslst : "<p class='user-small'  data-href='" + data.QP_User + "' >" + ev.authFullName + "</p>";
      }
      var ttl = $(this).buildTxt(txt, 0);
      ttl = ttl.length > 60 ? ttl.substr(0, 57) + '...' : ttl;
      var ld = "<li class='list'><div class='happening event' data=" + ev.url + ">" +
              "<a href='" + $('body').data('auth') + ev.url + "'>" +
              "<span class='thumb-holder img-cnt'><img src='" +
              ($('#user-nav').data('isLive') ? "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_" : "/public/Multimedia/P_Pic_") +
              ev.auth + "' /></span>" +
              "<span class='content'>" + usrslst +
              "<span class='tagd'>" + ev.tag + "</span>" +
              "<span class='ttl'>\"" + ttl + "\" " + (ev.tag2 ? $(this).buildTxt(ev.tag2) : '') + "</span>" +
              "<span class='tmsp block' tmsp='" + ev.tmsp + "'></span>" +
              "</span>" +
              "<div class='clearfix'></div>" +
              "</a>" +
              "</div><hr>" +
              "</li>";
      return ld;
    }
  }

  // For published, vote up, and article related
  function ldpblsh(data, to)
  {
    var pb = {
      auth: '',
      img: '',
      id: '',
      url: '',
      tag: '',
      tl: '',
      rxn: '',
      rtg: '',
      tmsp: ''
    };
    pb.img = (data.QP_Refer_To).split(',').shift().split(':')[0];
    pb.auth = data.QP_User;
    pb.authFullName = data.QP_User_FullName;
    switch (data.QP_Tag)
    {
      case 'W':
        pb.tag = 'published';
        pb.tag2 = '</span> <span class="tagd"> in</span><span class="ttl spc-nm">' + data.QP_Space;
        pb.img = pb.auth;
        break;
      case 'P':
        pb.tag = 'voted poll in story';
        break;
      case 'CM':
        pb.tag = 'commented on <span class="ttl">' + data.QP_Article_Event_Owner_FullName + "'s </span>";
        break;
      case 'V' :
        pb.tag = "votedup <span class='ttl'>" + data.QP_Article_Event_Owner_FullName + "'s </span>";
        break;
      case 'CC':
        pb.tag = 'replied to comment in this story';
        break;
      case '@':
        pb.tag = 'mentioned you in the story';
        break;
      case '@C':
        pb.tag = 'mentioned you in this comment';
        break;
      case 'M':
        pb.tag = 'assigned this story to moderate';
        break;
    }
    if (isJSON(data.QP_Content))
    {
      var content = $.parseJSON(data.QP_Content);
      pb.ttl = content.ttl;
      if (data.P_Reactions)
        pb.rxn = data.P_Reactions;
      else
        pb.rxn = 0;
      if (data.P_Rating)
        pb.rtg = data.P_Rating;
      else
        pb.rtg = 0;
      pb.url = data.QP_Url;
      pb.id = data.Article_Event_ID;
      pb.tmsp = data.QP_Timestamp;

      if ((to == 'stream' && data.QP_Refer_To == '' && data.QP_Tag == 'CC' && (variables.user == data.QP_Article_Event_Owner)) || (to == 'context' && data.QP_Tag == '@C')) {
        return 0;
      }

      if ((to == 'stream') && (data.QP_Tag == 'V') && (variables.user == data.QP_Article_Event_Owner)) {
        pb.tag = 'voted up your story';
      }
      else if ((to == 'stream') && (data.QP_Tag == 'P') && (variables.user == data.QP_Article_Event_Owner)) {
        pb.tag = 'voted your poll in story';
      }
      else if ((data.QP_Tag == 'CC') && (variables.user == data.QP_User)) {
        pb.tag = 'replied to your comment in';
      }

      var txt = content.ttl; //other than comment entries
      if (to == 'reactions') {
        if (data.QP_Tag == '@C') {
          pb.tag = 'mentioned you in this comment';
        }
        else {
          pb.tag = 'commented on your story';
        }
        txt = content.cmnt; //For comment entries

        if (data.QP_Tag == '@') {
          txt = content.ttl;
        }
      }

      if (((variables.user == data.QP_Article_Event_Owner) && (data.QP_Tag != 'CC') && (data.QP_Tag != '@')
              && (data.QP_Tag != 'P') && (data.QP_Tag != 'W') && (data.QP_Tag != 'V') && (data.QP_Tag != '@C'))) {
        pb.tag = 'commented on your story';
      }
      else if (to == 'stream' && data.QP_Refer_To == '' && data.QP_Tag == 'CC') {
        pb.tag = 'replied to comment in this story';
      }
      var ttl = $(this).buildTxt(txt, 0);
      ttl = ttl.length > 60 ? ttl.substr(0, 57) + '...' : ttl;
      var usrslst = consolidateList(data.QP_Tag, data.QP_Refer_To, 'A', data.Article_Event_ID);
      usrslst = (usrslst != '') ? usrslst : "<p class='user-small' data-href='" + data.QP_User + "' >" + pb.authFullName + "</p>";
      var ld = "<li class='list'><div class='happening published'>" +
              "<a href='" + $('body').data('auth') + pb.url + "'>" +
              "<span class='thumb-holder img-cnt'><img src='" +
              ($('#user-nav').data('isLive') ? "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_" : "/public/Multimedia/P_Pic_") + pb.img + "' /></span>" +
              "<span class='content'>" + usrslst +
              "<span class='tagd'>" + pb.tag + " </span>" +
              "<span class='ttl'>\"" + ttl + "\" " + (pb.tag2 ? $(this).buildTxt(pb.tag2) : '') + "</span>" +
              "<span class='tmsp block' tmsp='" + pb.tmsp + "'></span>" +
              "</span>" +
              "<div class='clearfix'></div>" +
              "</a>" +
              "</div><hr>" +
              "</li>";
      return ld;
    }
  }

  //For petition related data
  function ldptn(data)
  {
    if (isJSON(data.QP_Content))
    {
      var tag = null, tag2 = null, usrimg = (data.QP_Refer_To).split(',').shift().split(':')[0];
      switch (data.QP_Tag)
      {
        case 'C':
          tag = 'started a petition';
          tag2 = '</span> <span class="tagd"> in</span><span class="ttl spc-nm">' + data.QP_Space;
          usrimg = data.QP_Article_Event_Owner;
          break;
        case 'P' :
          tag = 'voted poll in petition';
          break;
        case 'CM':
          tag = 'commented on <span class="ttl">' + data.QP_Article_Event_Owner_FullName + "'s </span>";
          if (variables.user == data.QP_Article_Event_Owner)
            tag = 'commented on your petition';
          break;
        case 'CC':
          tag = 'replied to a comment in this petition';
          break;
        case '@C':
          tag = 'mentioned you in a comment';
          break;
        case 'S':
          tag = "signed <span class='ttl'>" + data.QP_Article_Event_Owner_FullName + "'s </span>";
          break;
      }
      var usrslst = consolidateList(data.QP_Tag, data.QP_Refer_To, 'P', data.Article_Event_ID);
      var ttl = $(this).buildTxt(JSON.parse(data['QP_Content'])['ttl'], 0);
      if (ttl.length > 58)
        ttl = ttl.substr(0, 58) + '...';
      usrslst = (usrslst != '') ? usrslst : "<p class='user-small' data-href='" + data.QP_User + "' >" + data.QP_User_FullName + "</p>";
      var ld = "<li class='list'><div class='happening ptn' id='" + data.Article_Event_ID + "'>" +
              "<a href='" + $('body').data('auth') + data.QP_Url + "'>" +
              "<span class='thumb-holder img-cnt'>" +
              "<img src='" + ($('#user-nav').data('isLive') ? "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_" : "/public/Multimedia/P_Pic_") + usrimg + "' />" +
              "</span>" +
              "<span class='content'>" + usrslst +
              "<span class='tagd'>" + tag + "</span>" +
              "<span class='ttl'>\"" + ttl + "\" " + (tag2 ? $(this).buildTxt(tag2) : '') + "</span>" +
              "<span class='tmsp block' tmsp='" + data.QP_Timestamp + "'></span>" +
              "</span>" +
              "<div class='clearfix'></div></a></div><hr>" +
              "</li>";
      return ld;
    }
  }
  // Townhall related entries
  function ldtwnhl(data) {
    var usrimg = (data.QP_Refer_To).split(',').shift().split(':')[0];
    if (isJSON(data.QP_Content))
    {
      var tag = null, tag2 = null;
      switch (data.QP_Tag)
      {
        case 'W':
          tag = 'is hosting a townhall';
          tag2 = '</span> <span class="tagd"> in</span><span class="ttl spc-nm">' + data.QP_Space;
          usrimg = data.QP_Article_Event_Owner;
          break;
        case 'P':
          tag = 'participated in townhall';
          break;
        case 'Q':
          tag = 'asked a question in townhall';
          if (variables.user == data.QP_Article_Event_Owner)
            tag = 'asked you a question in townhall';
          break;
        case 'CM':
          tag = 'commented on an answer in townhall';
          if (variables.user == data.QP_Article_Event_Owner)
            tag = 'commented on your answer in townhall';
          break;
      }
      var usrslst = consolidateList(data.QP_Tag, data.QP_Refer_To, 'T', data.Article_Event_ID);
      usrslst = (usrslst != '') ? usrslst : "<span href='/" + data.QP_User + "' class='user-small'>" + data.QP_User_FullName + "</span>";
      var content = JSON.parse(data.QP_Content);
//      var link = (data.QP_Url).split("/");
      var date = $(this).getDateTime(content.date);
      var ld = "<li class='list'><div class='happening published' id='" + data.Article_Event_ID + "'>" +
              "<a href='" + $('body').data('twn') + data.QP_Url + "'>" +
              "<span class='thumb-holder img-cnt'>" +
              "<img src='" + ($('#user-nav').data('isLive') ? "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_" : "/public/Multimedia/P_Pic_") + usrimg + "' />" +
              "</span>" +
              "<span class='content'>" + usrslst +
              "<span class='tagd'>" + tag + "</span>" +
              "<span class='ttl'>\"" + $(this).buildTxt(content['ttl'], 0) + "\" " + (tag2 ? $(this).buildTxt(tag2) : '') + "</span>" +
              "<span class='tmsp block' tmsp='" + data.QP_Timestamp + "'></span>" +
              "</span>" +
              "<div class='clearfix'></div></a></div><hr>" +
              "</li>";
      return ld;
    }
  }
  //Debate related entries
  function lddbt(data) {
    if (isJSON(data.QP_Content))
    {
      var usrimg = (data.QP_Refer_To).split(',').shift().split(':')[0], tag = null, tag2 = null;
      switch (data.QP_Tag)
      {
        case 'W':
          tag = 'started a debate';
          tag2 = '</span> <span class="tagd"> in</span><span class="ttl spc-nm">' + data.QP_Space;
          usrimg = data.QP_Article_Event_Owner;
          break;
        case 'P':
          tag = 'participated in debate';
          break;
        case 'Q':
          tag = 'asked a question in debate';
          if (variables.user == data.QP_Article_Event_Owner)
            tag = 'asked you a question in debate';
          break;
        case 'CM':
          tag = 'commented on an answer in debate';
          if (variables.user == data.QP_Article_Event_Owner)
            tag = 'commented on your answer in debate';
          break;
      }
      var usrslst = consolidateList(data.QP_Tag, data.QP_Refer_To, 'D', data.Article_Event_ID);
      usrslst = (usrslst != '') ? usrslst : "<span href='/" + data.QP_User + "' class='user-small'>" + data.QP_User_FullName + "</span>";
      var content = JSON.parse(data.QP_Content);
      var date = $(this).getDateTime(content.date);
      var ld = "<li class='list'><div class='happening published' id='" + data.Article_Event_ID + "'>" +
              "<a href='" + $('body').data('dbt') + data.QP_Url + "'>" +
              "<span class='thumb-holder img-cnt'>" +
              "<img src='" + ($('#user-nav').data('isLive') ? "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_" : "/public/Multimedia/P_Pic_") + usrimg + "' />" +
              "</span>" +
              "<span class='content'>" + usrslst +
              "<span class='tagd'>" + tag + "</span>" +
              "<span class='ttl'>\"" + $(this).buildTxt(content['ttl'], 0) + "\" " + (tag2 ? $(this).buildTxt(tag2) : '') + "</span>" +
              "<span class='tmsp block' tmsp='" + data.QP_Timestamp + "'></span>" +
              "</span>" +
              "<div class='clearfix'></div></a></div><hr>" +
              "</li>";
      return ld;
    }
  }
  // For all quickposts and reactions
  function ldqp(str, to)
  {
    var rating = 0;
    if (str.QP_Rating != null)
      rating = str.QP_Rating;
    var rxns = 0;
    if (str.P_Reactions != null)
      rxns = str.P_Reactions;

    var ld = "<li class='list ";
    if (variables.user == str.QP_User)
      ld += "own";
    ld += "' id='" + str.QP_ID + "'><div class='happening posted'><span class='tmsp abs italicText' tmsp='" + str.QP_Timestamp + "'>few sec ago</span>";
    if (variables.user == str.QP_User)
    {
      ld += "<ul class='dropdown pst-stng'><a class='dropdown-toggle' data-toggle='dropdown' href='#'><i class='icon-pencil'></i></a>" +
              "<ul class='dropdown-menu pull-right'>" +
              "<li><A href='#' class='edit_qp' >Edit</li>" +
              "<li><a href='#con-del' role='btn' data-toggle='modal' class='delete_quickpost' qpid='" + str.QP_ID + "' qpuser='" + str.QP_User + "'>Delete</a></li></ul>" +
              "</ul>";
    }
    ld += "<p class='span16'>" +
            "<span class='thumb-holder'>" +
            "<span class='block'><a href='#' class='qp_rating' qpostid='" + str.QP_ID + "' qpnum='" + rating + "'><i class='icon-chevron-sign-up'></i></a></span>" +
            "<span class='block number'>" + rating + "</span><span class='block txt'>votes</span>" +
            "</span>" +
            "<span class='content'>" +
            "<a href='/" + str.QP_User + "' class='user-small'>" + str.QP_User_FullName + "</a>" +
            "<span class='italicText'>posted</span>" +
            "<span class='ttl'>" + $(this).buildTxt(str.QP_Content, 1) + "</span>" +
            "</span>" +
            "</p>" +
            "<ul class='unfold span16'>";
    //  "<li class='unfold-ul span4'><i class='icon-long-arrow-down'></i> unfold</li>"+
    "<li class='rct-display span4'>" + rxns + " Reactions</li>" +
            "<li class='rct-btn span4'><a href='#' class='react'>Reply</a></li>" +
            "</ul>" +
            "<div class='clearfix'></div></div>" +
            "<div class='response'><div class='response-holder'>" +
            "<ul class='res-list'>" +
            "<li>" +
            "<form name='quickpost-form' class='rxn quickpost-form'>" +
            "<textarea name='quickpost' class='quickpost' rows='1' placeholder='React to " + str.QP_User_FullName + "&#39;s post'></textarea>" +
            "</form>" +
            "</li>" +
            "</ul>" +
            "</div></div></li>";
    return ld;
  }

  //load space social stream 
  function ldspc(data) {
    if (isJSON(data.QP_Content))
    {
      var tag = null;
      switch (data.QP_Tag)
      {
        case 'C':
          tag = 'created this space';
          break;
        case 'CA':
          tag = 'tagged ' + "<story>" + " in";
          break;
        case 'CP':
          tag = 'tagged ' + "<story>" + " in";
          break;
        case 'CE':
          tag = 'tagged ' + "<story>" + " in";
          break;
        case 'F':
          tag = 'started following this space';
          break;
      }
      var usrslst = consolidateList(data.QP_Tag, data.QP_Refer_To, 'U');
      usrslst = (usrslst != '') ? usrslst : "<span href='/" + data.QP_User + "' class='user-small'>" + data.QP_User_FullName + "</span>";
      var content = JSON.parse(data.QP_Content);
      var ld = "<li class='list'><div class='happening published' id='" + data.Article_Event_ID + "'>" +
              "<a href='" + $('body').data('auth') + data.QP_Url + "'>" +
              "<span class='thumb-holder img-cnt'><img src='" +
              ($('#user-nav').data('isLive') ? "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_" :
                      "/public/Multimedia/P_Pic_") + data.QP_User + "' /></span>" +
              "<span class='content'>" + usrslst +
              "<span class='tagd'>" + tag + "</span>" +
              "<span class='ttl spc-nm'>" + $(this).buildTxt(content['ttl'], 0) + "</span>" +
              "<span class='tmsp block' tmsp='" + data.QP_Timestamp + "'></span>" +
              "</span>" +
              "<div class='clearfix'></div></a></div><hr>" +
              "</li>";
      return ld;
    }
  }

  //load user related social stream 
  function ldusr(data) {
    if (isJSON(data.QP_Content))
    {
      var tag = null;
      switch (data.QP_Tag)
      {
        case 'F':
          tag = 'started following ';
          data.QP_Featured_Image = data.QP_User;
          break;
      }
      var usrslst = consolidateList(data.QP_Tag, data.QP_Refer_To, 'T', data.Article_Event_ID);
      usrslst = (usrslst != '') ? usrslst : "<span href='/" + data.QP_User + "' class='user-small'>" + data.QP_User_FullName + "</span>";
      var content = JSON.parse(data.QP_Content);
      var ld = "<li class='list'><div class='happening published' id='" + data.Article_Event_ID + "'>" +
              "<a href='" + $('body').data('auth') + data.QP_Url + "'>" +
              "<span class='thumb-holder img-cnt'><img src='" +
              ($('#user-nav').data('isLive') ? "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_" :
                      "/public/Multimedia/P_Pic_") + data.QP_Featured_Image + "' /></span>" +
              "<span class='content'>" + usrslst +
              "<span class='tagd'>" + tag + "</span>" +
              "<span class='ttl'>" + $(this).buildTxt(content['ttl'], 0) + "</span>" +
              "<span class='tmsp block' tmsp='" + data.QP_Timestamp + "'></span>" +
              "</span>" +
              "<div class='clearfix'></div></a></div><hr>" +
              "</li>";
      return ld;
    }
  }

  function ldCmpn(data) {
    if (isJSON(data.QP_Content))
    {
      var content = JSON.parse(data.QP_Content);
      var ld = "<li class='list'>" +
              "<div class='happening cmpn box' id='" + data.Article_Event_ID + "'>" +
              "<a href='" + data.QP_Url + "' target='_blank'>" +
              "<span class='thumb-holder img-cnt'><img src='" +
              ($('#user-nav').data('isLive') ? "https://saddahaq.blob.core.windows.net/multimedia/P_Pic_" :
                      "/public/Multimedia/P_Pic_") + data.QP_User + "' /></span>" +
              "<span class='content'>" + "<span href='/" + data.QP_User + "' class='user-small'>" +
              (content.campaigner != '' ? content.campaigner : data.QP_User_FullName) + "</span>" +
              "<span class='tagd'>started a campaign</span>" +
              (content.campaigner != '' ? "<span class='ttl'>on " + data.QP_User_FullName + " for </span>" : '') +
              "<span class='ttl'>" + $(this).buildTxt(content['title'], 1) + "</span>" +
              "<span class='tmsp block' tmsp='" + data.QP_Timestamp + "'></span>" +
              "</span>" +
              "<span class='clearfix'></span>" +
              "</a>" +
              "<div class='cmpn-sts'>" +
              "<div class='stats'><p class='pull-left'>"+Math.round(content.receieved_amt / content.target_amt * 100)+"%    </p><p class='pull-right'>Goal INR "+content.target_amt+"</p></div>" +
              "<progress class='clearfix' value='"+content.receieved_amt+"' max='"+content.target_amt+"'></progress></div>" +
              "<div class='btm-link'><a href='" + data.QP_Url + "'>" + "<i class='icon-donate'></i> " + (content["displayText"] ? content["displayText"] : "DONATE") + "</div></p>" +
              "<div class='clearfix'></div></div>" +
              "</li>";
      return ld;
    }
  }

  function ldSpcFlw(data) {
    $('.right-container .navbar h2').text('Spaces trending on saddahaq');
    var ld = "<li class='list'>" +
            "<div class='happening spcf' id='" + data.space_id + "'>" +
            "<span class='thumb-holder icn-big usr-img'><img src='" + ($('body').data('isLive') ? 'https://saddahaq.blob.core.windows.net/multimedia/' : '/public/Multimedia/') +
            data.space_image + "' /></span>" +
            "<span class='content'>" +
            "<a href='" + $("body").data("auth") + "/" + data.space_title_id +
            "' target='_blank' class='s-h'>" + $(this).buildTxt(data.space_title, 0) + "</a>" +
            "<span class='dft-msg block'><span><i class='" + (data.space_mode == 1 ? "icon-unlocked'></i> Open" : (data.space_mode == 2 ? "icon-moderator'></i> Moderated" : "'></i> Closed")) + "</span>" +
            "<span class='dot'></span>" + data.follow_count + " Followers<span class='dot'></span>" +
            "<a href='#' data-id='" + data.space_id + "' class='flw-spc flw-btn'>Follow</a>" +
            "</span></span>" +
            "<div class='clearfix'></div></div><hr>" +
            "</li>";

    return ld;
  }

  function consolidateList(tag, usrs, tp, id) {
    var usrslst = '';
    var tags = null;
    switch (tp)
    {
      case 'A':
        tags = ['V', 'CM', 'CC', 'P'];
        break;
      case 'P':
        tags = ['P', 'CM', 'CC', 'S'];
        break;
      case 'E':
        tags = ['V', 'CM', 'CC', 'A'];
        break;
      case 'T':
        tags = ['P', 'Q', 'CM'];
        break;
      case 'S':
        tags = ['C', 'CA', 'CP', 'CE'];
    }
    if ($.inArray(tag, tags) != -1) {
      usrs = usrs.split(',');
      var numusrs = usrs.length;
      var usr = usrs.shift().split(':');
      usrslst = "<p><span href='/" + usr[0] + "' class='user-small'>" + usr[1] + "</span>";
      if (numusrs > 1)
      {
        var five_usrs = usrs.slice(0, 5);
        var mrlst = '';
        for (var u = 0; u < five_usrs.length; u++)
          mrlst += five_usrs[u].split(':')[1] + (u < five_usrs.length - 1 ? '<br/>' : '');
        if (numusrs > 6)
          mrlst += " and " + (numusrs - 6) + "others";
        usrslst += ' and <span class="tltp shw-mre" data-info=\'{"tp": "' + tp + '", "actn": "' + tag + '", "id": "' + id + '", "cnt" : ' + numusrs + '}\' data-lst="' + mrlst + '" data-usr-lst=\'' + JSON.stringify(usrs) + '\'>' + (numusrs - 1) + ' other' + ((numusrs - 1) > 1 ? 's' : '') + '</span></p>';
      }
    }
    return usrslst;
  }

  function isJSON(str)
  {
    try
    {
      JSON.parse(str);
    }
    catch (e)
    {
      return false;
    }
    return true;
  }

  function ldElem(parent, options)
  {
    var str = '', sly;
    if (!parent.data('sly'))
      parent.enableSlider();

    sly = parent.data('sly');
    var reqPst = 5;
    var newtab = false;
    if (variables.prevTab != options.id)
    {
      variables.prevTab = options.id;
      variables.prevPst = 0;
      if (options.tab == 'posts')
        reqPst = 5;
      else
        reqPst = 10;
      newtab = true;
      parent.find('li').remove();
      variables.eod = false;
    }
    else
    {
      reqPst = 5;
      variables.prevPst += reqPst;
    }
    if (!variables.eod)
    {
      var sndDt = {
        'tab': options.tab,
        'cnt': reqPst,
        'prevCnt': variables.prevPst,
        'auth': parent.getShIntr(),
        'usr': parent.getLoggedInUsr()
      };
      if (options.usr)
        sndDt.usr2 = options.usr;
      if (options.tab == 'context')
      {
        sndDt.htg = options.htg;
        if (options.tp)
        {
          sndDt.tp = options.tp;
          sndDt.id = options.id;
        }
      }
      else if (options.tp == 'S')
      {
        sndDt.tp = options.tp;
        sndDt.id = options.id;
      }
      $.ajax({
        url: api + '/rp',
        async: true,
        data: sndDt,
        dataType: 'json',
        type: 'post',
        beforeSend: function () {
        },
        success: function (data) {
          if (data != null)
          {
            if (data.length)
            {
              for (var i = 0; i < data.length; i++)
              {
                switch (data[i].QP_Type)
                {
                  case 'E' :
                    var tmp = ldevt(data[i], options.tab);
                    if (tmp != 0)
                      str = tmp;
                    break;
                  case 'A' :
                    tmp = ldpblsh(data[i], options.tab);
                    if (tmp != 0)
                      str = tmp;
                    break;
                  case 'Q' :
                    str = ldqp(data[i]);
                    break;
                  case 'P' :
                    str = ldptn(data[i]);
                    break;
                  case 'T':
                    str = ldtwnhl(data[i]);
                    break;
                  case 'D':
                    str = lddbt(data[i]);
                    break;
                  case 'S':
                    str = ldspc(data[i]);
                    break;
                  case 'U':
                    str = ldusr(data[i]);
                    break;
                  case 'CP':
                    str = ldCmpn(data[i]);
                    break;
                  case 'SF':
                    str = ldSpcFlw(data[i]);
                    break;
                }
                if (!data[i].QP_Type) // remove this once the Qptype is update for space follow
                  str = ldSpcFlw(data[i]);

                if (str != '')
                  sly.add(str);

              }
              if (data.length < reqPst)
              {
                str += "<li class='list'><div class='happening'><div class='btm-link'>That's all for now</div></div></li>";
                variables.eod = true;
              }
            }
          }
        },
        complete: function () {
          if (newtab && variables.prevTab != 'posts')
            variables.prevPst += 5;
          if (parent.find('.list').length) {
            parent.find(".thumb-holder img").each(function () {
              $(this).findPrfPic(0, $(this).parents(".spcf").length ? 1 : 0);
            });
          }
          else
          {
            parent.parents('.right-container .navbar h2').text("Follow our top users");
            if (!parent.find('.list').length) {
              $.ajax({
                url: api + "/gfws",
                async: true,
                data: {
                  usr: $(this).getLoggedInUsr(),
                  cnt: 6,
                  pc: 0
                },
                dataType: 'json',
                type: 'post',
                success: function (d) {
                  if (d)
                  {
                    var temp, prfpic;
                    prfpic = '/public/Multimedia/P_Pic_';
                    if ($('#user-nav').data('isLive'))
                      prfpic = 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_';
                    for (var i = 0; i < d.length; i++) {
                      temp = '<li class="list"><div class="auth-bx ad-mrgn"><div class="icn"><a href="' +
                              ($("body").data("auth") + "/" + d[i]["uname"]) +
                              '" class="user-small" ><img src = "' + (prfpic + d[i]["uname"]) +
                              '" class="thumbholder" width="40" height="40">' +
                              '</a></div><p><a class="user-small" href="' + ($("body").data("auth") + "/" +
                                      d[i]["uname"]) + '">' + d[i]["fullname"] + '</a><a href="#" data-uname="' +
                              d[i]['uname'] + '" class="follow flw-btn">Follow</a></p></div><hr></li>';
                      sly.add(temp);
                      parent.find(".list:last img").findPrfPic();
                    }
                  }
                }
              });
            }
          }
          var pos = sly.pos;

          if (pos.start == pos.end)
            parent.siblings('.scrollbar').addClass('transparent');
          else
            parent.siblings('.scrollbar').removeClass('transparent');

          parent.find('.tmsp').each(function () {
            $(this).updateTime();
          });
          variables.slyLoading = false;
          if (variables.prevPst < 10)
            $('.tab-content').find('.active .happening').animateElements(function () {
              parent.sly('reload');
            });
          str = null;
        }
      });
    }
  }

  /* 
   * isSpc => 1 - a normal user viewing space homepage
   *       => 2 - an admin viewing space homepage
   *       => 3 - admin page
   */
  function buildStryTl(nws, isSpc)
  {
    var drftId = null, isDrft = (isJSON(nws.D_Content) ? 1 : 0),
            cimg_url = ($('#user-nav').data('isLive') || $('#right-bar').hasClass('prw-pg')) ? 'https://saddahaq.blob.core.windows.net/multimedia/Tile_' : '/public/Multimedia/Tile_';

    var cimg = null, href = null, tp = null, tag = null, actBtn = '', dt = null;
    if (isDrft)
    {
      drftId = nws.D_ID;
      tp = nws.D_Type;
      var l = '';
      if (tp == 'A') {
        l = 'story';
      }
      else if (tp == 'E') {
        l = 'event';
      }
      else {
        l = 'petition';
      }
      href = '/' + l + 'draft/' + drftId;
      dt = JSON.parse(nws.D_Content);
      if (dt['cvimg']) {
        cimg = dt['cvimg'];
      }
      else
        cimg = '';
      var dTm = $(this).getDateTime(nws.D_TimeModified);
      tag = 'On ' + dTm['d'] + ' ' + dTm['m'] + ', ' + dTm['t'];
    }
    else
    {
      var inactv = null;
      cimg = cimg_url + nws.P_Feature_Image;
      switch (nws.ev)
      {
        case 1:
          tp = 'E';
          inactv = 'event';
          tag = 'created an event';
          actBtn = '<a href="#" class="atnd ' + (nws.P_IsMarkedReadLater ? '_mrkd' : '') + '"><i class="icon-calendar"></i></a>';
          break;
        case 2:
          inactv = 'petition';
          tp = 'P';
          tag = 'published a petition';
          actBtn = '<a href="#" class="sgn ' + (nws.P_IsMarkedReadLater ? '_mrkd' : '') + '"><i class="icon-petition"></i></a>';
          break;
        case 3:
          tp = 'T';
          tag = 'hosting a townhall';
          href = $('body').data('twn') + '/' + nws.P_Title_ID;
          cimg = 'https://saddahaq.blob.core.windows.net/multimedia/' + 'P_Pic_' + nws.P_CELEBRITY_UNAME;
          if (nws.P_MODERATOR_UNAME) {
            nws.P_Author = nws.P_MODERATOR_UNAME;
            nws.P_Author_FullName = nws.P_MODERATOR_FULLNAME;
          }
          break;
        case 4 :
          tp = 'D';
          tag = 'Started a debate';
          href = $('body').data('dbt') + '/' + nws.P_Title_ID;
          cimg = '/public/images/tile_debate.jpg';
          break;
        case 5:
          tp = 'SP';
          tag = 'created a space';
          break;
        default:
          tp = 'A';
          inactv = 'article';
          tag = 'published a story';
          actBtn = '<a href="#" class="rdltr ' + (nws.P_IsMarkedReadLater ? '_mrkd' : '') + '"><i class="icon-bookmark-label"></i></a>';
          break;
      }
      if (nws.ev != 3 && nws.ev != 4) {
        if (nws.P_Status == -2) {
          href = '/inactive/' + inactv + '/' + nws.P_Title_ID;
        }
        else {
          href = "/" + nws.P_Title_ID + ((nws.P_Status == 2 || nws.P_Status == 9 || nws.P_Status == 13) ? '?mod=1' : '');
        }
      }
    }

    var ttl = $(this).buildTxt((isDrft ? (dt.ttl ? dt.ttl : 'Draft') : nws.P_Title), 0);
    ttl = ttl.length > 120 ? ttl.substr(0, 117) + '...' : ttl;

    var smry = $(this).buildTxt((isDrft ? dt['smry'] : nws.P_Smry));
    if (smry.split(':::').length > 1)
      smry = smry.split(':::')[1];
    else if (smry.split('::').length > 1)
      smry = smry.split('::')[1];

    var str = '<div class="nws-tl transition ph-vw ' + tp + '" id="' +
            (isDrft ? drftId : (nws.P_Id != null ? nws.P_Id : 'tmp' + new Date().getTime())) + '" data-tp="' + tp + '">' +
            '<section>' +
            '<div class="auth-bx">' +
            '<a href="' + $('body').data('auth') + "/" + nws.P_Author + '" class="small">' +
            '<div class="icn">' +
            '<img src="' + ($('#user-nav').data('isLive') ? 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' : '/public/Multimedia/P_Pic_') + nws.P_Author + '" /></div><p>' +
            '<span class="user-small " data-href="' + nws.P_Author + '">' + nws.P_Author_FullName + '</span>' +
            '<span class="dft-msg block">' + tag + '<span class="dot"></span>' +
            '<span class="tmsp" tmsp="' + nws['P_TimeCreated'] + '"></span></span>' +
            '</p>' +
            '</a>' +
            '</div><div class="actn-btns">';
    if (!isDrft)
    {
      //Commenting code as pin to profile option for user has to be enabled on his piece tile -- Venugopal
//      if (nws.ev == 0 && $('#user-nav').attr('plg') < 50)
//      {
//        str += '<a href="#" class="rdltr actn-btn transition in ' + (nws.P_IsMarkedReadLater ? 'mrkd' : '') +
//                '" data-toggle="tooltip" data-container="body" data-placement="top" data-original-title="Mark to read later"' +
//                '><i class="icon-bookmark-label"></i></a>';
//      }
//      else
//      {
      var vtCnt = nws.votes + (nws.v_users) ? nws.v_users.length : 0;
      var stsFlgs = {
        "isSpc": (isSpc ? true : false),
        "rdl": nws.P_IsMarkedReadLater,
        "pnd": nws.P_Pin,
        "evt": nws.P_EventAttendStatus,
        "ptn": nws.P_PetitionSignStatus,
        "tp": nws.ev,
        "psts": nws.P_Status,
        "dcm": nws.DCM,
        "vts": vtCnt,
        "vtd": nws.isVoted
      };
      str += actBtn + '<a href="#" class="transition in actn-btn" data-flgs=\'' + JSON.stringify(stsFlgs) + '\'><i class="icon-tile-options"></i></a>';
//      }
    }
    else
    {
      str += '<a href="#con-del" class="del-drft" data-toggle="modal" data-container="body" data-placement="top" data-original-title="Discard draft" role="button"><i class="icon-trash-closed"></i></a>';
    }
    str += '</div><div class="tl-dtls ' + (nws.P_Feature_Image == '' ? '_noCvr' : '') + '">' +
            '<div class="actn-bx no-hgt box transition">' +
            '<div class="loading sml"></div>' +
            '</div>' +
            (nws.P_Feature_Image != '' ? '<div class="cvr-bx" ' + (nws.P_Feature_Image != '' ?
                    'style="background-image:url(' + cimg + ');"' : '') + '>' +
                    '<div class="he-bg"></div><a href="' + href + '"></a></div>' : ''); // End cvr-bx
    if (nws.ev != 5) {
      str += '<a class="spc-nm" href="' + $('body').data('auth') + '/' + nws.Space_TitleId + '">' +
              $(this).buildTxt(nws.Space_Title, 0) + '</a>';
    }
    str += '<div class="dsc-bx">' +
            '<a href="' + href + '">' +
            '<div class="stry-dtls">' +
            '<div class="ttl">' + ttl + '</div>';
    if (nws.ev == 0 || nws.ev == 2 || nws.ev == 5 || isDrft)
      str += '<div class="smry">' + ((smry.length > 100) ? smry.substr(0, 97) + '...' : smry) + '</div>';
    else if (nws.ev == 1 || nws.ev == 3 || nws.ev == 4)
    {
      if (nws.P_EventStartTime) {
        st = $(this).getDateTime(nws.P_EventStartTime);
        st = st['d'] + ' ' + st['m'] + ', ' + st['t'];
      }
      if (nws.P_EventEndTime)
      {
        var et = $(this).getDateTime(nws.P_EventEndTime);
        et = et['d'] + ' ' + et['m'] + ', ' + et['t'];
      }

      str += '<div class="_evtDtls" data-stm="' + nws.P_EventStartTime + '" data-etm="' +
              (nws.ev != 1 ? (parseInt(nws.P_EventStartTime) + parseInt(nws.P_EventEndTime)) : nws.P_EventEndTime) + '">' + '<p><i class="icon-time"></i>' + (nws.P_EventStartTime != 0 ? st + ((nws.P_EventStartTime == nws.P_EventEndTime) ? '' : (nws.P_EventEndTime && nws.ev == 1 ? ' - ' + et : '')) : 'To be announced') + '</p>' + (nws.ev == 1 ? '<p><i class="icon-map-location"></i>' + (nws.P_EventLocation != '' ? nws.P_EventLocation : 'Venue to be announced') + '</p>' : '<p><i class="icon-timer"></i> Duration : ' + (nws.P_EventEndTime / 60) + 'mins</p>') + '</div>';
    }
    str += '</a>';
    if (!isDrft)
    {
      var actnTab;
      if (nws.ev == 0)
        actnTab = ['votedup this story', 'V', 'A'];
      else if (nws.ev == 1)
        actnTab = [(nws.v_users.length > 1 ? 'are' : 'is') + ' attending this event', 'A', 'E'];
      else if (nws.ev == 5)
        actnTab = ['following this space', 'F', 'S'];
      else
        actnTab = ['signed this petition', 'S', 'P'];
      if (nws.v_users != undefined && nws.v_users.length > 0) {
        str += '<hr><p class="v-lst"><a href="/' + nws.v_users[0].UName + '">' + $.trim(nws.v_users[0].Name) + '</a>' +
                (nws.v_users[1] ? ', <a href="/' + nws.v_users[1].UName + '">' + $.trim(nws.v_users[1].Name) + '</a>' : '') +
                ((nws.votes) > 0 ? ' and <a href="#" class="shw-mre" data-info = \'{"tp": "' + actnTab[2] + '", "actn": "' + actnTab[1] + '", "id": "' + nws.P_Id + '", "cnt" : "' + (nws.votes + nws.v_users.length) + '", "author": "' + nws.P_Author_FullName + '",  "Ttl": "' + $(this).trimText(ttl) + '"}\'>' + (nws.votes) + ' other(s)</a> ' : '') + ' ' + actnTab[0];
      }
      if (nws.P_Num_Comments != undefined && nws.P_Num_Comments > 0) {
        str += '<hr><p class="c-lst"><a href="/' + nws.Commented_Users[0].UN + '">' + nws.Commented_Users[0].FN + '</a>' +
                (nws.Commented_Users[1] ? ', <a href="/' + nws.Commented_Users[1].UN + '">'
                        + nws.Commented_Users[1].FN + '</a>' : '') +
                (nws.Comment_Count_Unique - 2 > 0 ? ' and <a href="#" class="shw-mre" data-info = \'{"tp": "' + tp + '", "actn": "CM", "id": "' + nws.P_Id + '", "cnt" : "' + nws.Comment_Count_Unique + '", "author": "' + nws.P_Author_FullName + '",  "Ttl": "' + ttl + '"}\' >' + (nws.Comment_Count_Unique - 2) + ' other(s)</a>' : '');
        str += ' commented on this ' + (nws.ev == 0 ? 'story' : (nws.ev == 1 ? 'event' : 'petition')) + '</p>';
      }
      str += '</div></div>';
    }
    str += '</div>' +
            '</section>' +
            '</div>';
    return str;
  }

  function buildSpaces(spc, trgt)
  {
    trgt.append(buildSpcList(spc));
    var spcItm = trgt.find('#' + spc.P_Id);
    if (spc.P_Cover_Image)
      spcItm.find('.spc-cvr').loadSpcCvrImg();
    spcItm.find('.tmsp').updateTime();
    spcItm.find('.usr img').findPrfPic();
  }

  function buildSpcList(spc)
  {
    var htm = '<div class="src-itm spc" id="' + spc.P_Id + '">' +
            '<div class="_usr-info">' +
            '<div class="usr">' +
            '<div class="icn-sml"><img src="' + ($('#user-nav').data('isLive') ? 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' : '/public/Multimedia/P_Pic_') + spc.P_Author + '" /></div>' +
            '<p><a href="/' + spc.P_Author + '" class="user-small">' + spc.P_Author_FullName + '</a>' +
            '<span class="tmsp dft-msg block" tmsp="' + spc.P_TimeCreated + '"></span>' +
            '</p>' +
            '</div>' +
            '</div>' +
            '<div class="spc-itm">' +
            '<a href="' + $('body').data('auth') + '/' + spc.P_Title_ID + '"></a>' +
            (spc.P_Cover_Image != '' ? '<div class="spc-cvr" data-cvr="' + spc.P_Cover_Image + '"></div>' : '') +
            '<h3 class="ttl">' + $(this).buildTxt(spc.P_Title, 0) + '</h3>' +
            '<p class="smry">' + $(this).buildTxt(spc.P_Smry, 0) + '</p></div>' +
            '<hr>' +
            '</div>';
    return htm;
  }

  function setPosition($this, cntnr)
  {
    var nwstls = cntnr.find('.nws-tl');
    var i = nwstls.index($this);
    if ((i > 0 && i <= 1) && nwstls.length <= 2)
    {
      var prev = $this.prev();
      prev = prev.get(0);
      $this.css({'top': 0, 'left': $(prev).outerWidth() + parseInt(prev.style.left != '' ? prev.style.left : 0)});
    }
    else if (i > 1 || nwstls.length > 3)
    {
      var frstElm = null, scndElm = null;
      scndElm = cntnr.find('.r:last').get(0);
      frstElm = cntnr.find('.l:last').get(0);
      var frstElmTop = parseInt(frstElm.style.top != '' ? frstElm.style.top : 0);
      var frstElmBtm = (frstElmTop < 100 ? 0 : frstElmTop) + $(frstElm).outerHeight();
      var scndElmBtm = parseInt(scndElm.style.top != '' ? scndElm.style.top : 0) + $(scndElm).outerHeight();

      var pos = {};
      if (frstElmBtm < scndElmBtm)
        pos = {'top': frstElmBtm, 'left': parseInt(frstElm.style.left != '' ? frstElm.style.left : 0)};
      else
        pos = {'top': scndElmBtm, 'left': parseInt(scndElm.style.left != '' ? scndElm.style.left : 0)};

      $this.css(pos);
    }
    if (parseInt($this.get(0).style.left) == 0 || i == 0)
      $this.addClass('l');
    else
      $this.addClass('r');
    $this.addClass('in');
  }
//  function setPosition3($this, cntnr)
//  {
//    var nwstls = cntnr.find('.nws-tl');
//    var i = nwstls.index($this);
//    if ((i > 0 && i <= 2) && nwstls.length <= 3)
//    {
//      var prev = $this.prev();
//      prev = prev.get(0);
//      $this.css({'top': 0, 'left': $(prev).outerWidth() + parseInt(prev.style.left != '' ? prev.style.left : 0)});
//    }
//    else if (i > 2 || nwstls.length > 3)
//    {
//      var frstElm = null, scndElm = null, thrdElm = null;
//      thrdElm = cntnr.find('.r:last').get(0);
//      scndElm = cntnr.find('.m:last').get(0);
//      frstElm = cntnr.find('.l:last').get(0);
//      var frstElmTop = parseInt(frstElm.style.top != '' ? frstElm.style.top : 0);
//      var frstElmBtm = (frstElmTop < 100 ? 0 : frstElmTop) + $(frstElm).outerHeight();
//      var scndElmBtm = parseInt(scndElm.style.top != '' ? scndElm.style.top : 0) + $(scndElm).outerHeight();
//      var thrdElmBtm = parseInt(thrdElm.style.top != '' ? thrdElm.style.top : 0) + $(thrdElm).outerHeight();
//      var pos = {};
//      if (frstElmBtm < scndElmBtm && frstElmBtm < thrdElmBtm)
//        pos = {'top': frstElmBtm, 'left': parseInt(frstElm.style.left != '' ? frstElm.style.left : 0)};
//      else if (scndElmBtm < frstElmBtm && scndElmBtm < thrdElmBtm)
//        pos = {'top': scndElmBtm, 'left': parseInt(scndElm.style.left != '' ? scndElm.style.left : 0)};
//      else if (thrdElmBtm < frstElmBtm && thrdElmBtm < scndElmBtm)
//        pos = {'top': thrdElmBtm, 'left': parseInt(thrdElm.style.left != '' ? thrdElm.style.left : 0)};
//      else if (frstElmBtm == scndElmBtm)
//      {
//        if (frstElmBtm == thrdElmBtm || thrdElmBtm > frstElmBtm)
//          pos = {'top': frstElmBtm, 'left': 0};
//        else if (thrdElmBtm < frstElmBtm)
//          pos = {'top': thrdElmBtm, 'left': thrdElm.offsetLeft};
//      }
//      else if (frstElmBtm == thrdElmBtm)
//      {
//        if (scndElmBtm == frstElmBtm || scndElmBtm > frstElmBtm)
//          pos = {'top': frstElmBtm, 'left': 0};
//        else if (scndElmBtm < frstElmBtm)
//          pos = {'top': scndElmBtm, 'left': scndElm.offsetLeft};
//      }
//      else if (scndElmBtm == thrdElmBtm)
//      {
//        if (frstElmBtm == scndElmBtm || frstElmBtm < scndElmBtm)
//          pos = {'top': frstElmBtm, 'left': 0};
//        else if (frstElmBtm > scndElmBtm)
//          pos = {'top': scndElmBtm, 'left': scndElm.offsetLeft};
//      }
//      $this.css(pos);
//    }
//    if (parseInt($this.get(0).style.left) == 0 || i == 0)
//      $this.addClass('l');
//    else if (parseInt($this.get(0).style.left) == $this.outerWidth())
//      $this.addClass('m');
//    else
//      $this.addClass('r');
//    $this.addClass('in');
//  }

  function setEndPosition($this, cntnr) {
    var thrdElm = cntnr.find('.r:last').get(0);
    var scndElm = cntnr.find('.m:last').get(0);
    var frstElm = cntnr.find('.l:last').get(0);
    $this.css('top',
            Math.max(frstElm != undefined ? (frstElm.offsetTop < 100 ? 0 : frstElm.offsetTop) + $(frstElm).outerHeight() : 0,
                    scndElm != undefined ? scndElm.offsetTop + $(scndElm).outerHeight() : 0,
                    thrdElm != undefined ? thrdElm.offsetTop + $(thrdElm).outerHeight() : 0)
            );
  }

  /* brute force changes for wishberry static tile in repeal-section-377 */
  function bruteForceWb() {
    var trgt = $("#wb2b8bdbf4920d4569fb3935628a4bdd3");
    if (trgt.length) {
      trgt.find(".cvr-bx").css("background-image", "url(https://saddahaq.blob.core.windows.net/multimedia/53ea4502575d2TGZ3_Header.jpg)");
      // trgt.find(".auth-bx a").attr("href", "https://www.wishberry.in/");
      trgt.find(".auth-bx p").text("Crowd funding campaign");
      trgt.find(".tl-dtls > a").attr("href", "https://www.wishberry.in/campaign/gaysi-zine/");
      trgt.find(".dt-ln").html("<br>");
      var actnCnt = '<div class="rltd-dntn transition in prphl-bx"> ' +
              '<div class="row-fluid wish-berry">' +
              ' <div class="span8 ">' +
              ' <a target="_blank" href= "https://www.wishberry.in/campaign/gaysi-zine/" class ="rltd-img-bx hidden-phone">' +
              '  <img class= "wb-dnt-img" src="https://saddahaq.blob.core.windows.net/multimedia/ThankYou.jpg"> ' +
              ' <p class="user-small">Thank You Note! <span class="block">Rs.200 / $4</span></p>' +
              '</a>' +
              '<div><span> 3 Claimed</span>' +
              '  <span class="pull-right wb-clm-btn">' +
              '   <a target="_blank" href="https://www.wishberry.in/campaign/gaysi-zine/" class="">CLAIM</a>' +
              '</span>' +
              '</div>    ' +
              '</div>' +
              ' <div class="span8 ">' +
              '  <a target="_blank" href= "https://www.wishberry.in/campaign/gaysi-zine/" class ="rltd-img-bx hidden-phone">' +
              '   <img class= "wb-dnt-img" src="https://saddahaq.blob.core.windows.net/multimedia/Cover.jpg">' +
              '  <p class="user-small">Thank You - Size Up!<span class="block">Rs.500 / 9$</span></p>' +
              '</a>' +
              ' <div><span> 10 Claimed</span>' +
              ' <span class="pull-right wb-clm-btn">' +
              '  <a target="_blank" href="https://www.wishberry.in/campaign/gaysi-zine/" class="">CLAIM</a>' +
              ' </span>' +
              ' </div>    ' +
              ' </div>' +
              '<div class="span8 ">' +
              ' <a target="_blank" href= "https://www.wishberry.in/campaign/gaysi-zine/" class ="rltd-img-bx hidden-phone">' +
              '  <img class= "wb-dnt-img" src="https://saddahaq.blob.core.windows.net/multimedia/Reward.jpg">  ' +
              ' <p class="user-small">WOW! <span class="block">Rs.3000 / 49$</span></p>' +
              '</a>' +
              '<div><span> 9 Claimed</span>' +
              ' <span class="pull-right wb-clm-btn">' +
              '  <a target="_blank" href="https://www.wishberry.in/campaign/gaysi-zine/" class="">CLAIM</a>' +
              '</span>' +
              '</div>    ' +
              '</div>' +
              '<div class="span8 ">' +
              ' <a target="_blank" href= "https://www.wishberry.in/campaign/gaysi-zine/" class ="rltd-img-bx hidden-phone">' +
              '  <img class= "wb-dnt-img" src="https://saddahaq.blob.core.windows.net/multimedia/t-shirt.jpg">      ' +
              ' <p class="user-small">We *Heart* You! <span class="block">Rs.12000 /196$</span></p>' +
              '</a>' +
              '<div><span> 3 Claimed</span>' +
              ' <span class="pull-right wb-clm-btn">' +
              '  <a target="_blank" href="https://www.wishberry.in/campaign/gaysi-zine/" class="">CLAIM</a>' +
              '</span>' +
              '</div>    ' +
              '</div>' +
              '</div>' +
              ' </div>';

      trgt.find(".actn-bx").html(actnCnt);
    }
  }

  /* search related functionality */
  var hlpTxt = ['Try "in:stories Sachin.."', 'Try "in:events exhibit.."', 'Try "in:petitions Net neu.."', 'Try "@johanathan"', 'Try "#saddahaq"'], focusTmr = null;
  $('.search-query').attr('placeholder', hlpTxt[Math.floor(Math.random() * (hlpTxt.length))]).on('focus',
          function () {
            $this = $(this);
            focusTmr = setInterval(function () {
              $this.attr('placeholder', hlpTxt[Math.floor(Math.random() * (hlpTxt.length))]);
            }, 1500);
          });
  $('.search-query').on('blur', function () {
    clearInterval(focusTmr);
  });

  var api = $('body').data('api');
  if ($("#search-frm").length)
    $("#search-frm").find('.datepicker').datepicker();
  var sug = "", srch, isSelf = 0, prvSrchKey, isSrchLdng, txt, srchOpts = {};

  $("#search-frm, #search-bx").on("keyup", ".search-query", function (e, save) {
    var $this = $(this);
    txt = $(this).val().toLowerCase();
    isSrchLdng = false;
    // 1 is added at the end to mark that user is searching for his data
    var i, sugTags = ["in:stories::AR", "in:petitions::PE", "in:events::EV", "in:townhalls::TO",
      "in:debates::DE", "in:hashtags::H", "in:users::U", "in:spaces::SP"], usrSugTags = ["my:favorites::MF::1",
      "my:readinglist::RL::1", "my:stories::AR::1", "my:events::EV::1", "my:petitions::PE::1",
      "my:townhalls::TO::1", "my:debates::DE::1", "my:spaces::SP::1", "my:history::HI::1"];
    if ($this.getLoggedInUsr())
      sugTags = sugTags.concat(usrSugTags);
    if (e.keyCode == 32 && txt.length == 0)
      e.preventDefault();
    if (txt == "" && $this.data('ui-autocomplete')) {
      $this.autocomplete("destroy");
      sug = "";
    }
    else if ((txt.indexOf('in') == 0 || txt.indexOf('my') == 0)) {
      $this.autocomplete({
        source: function (req, res) {
          res($.map($.ui.autocomplete.filter(sugTags, req.term), function (item) {
            item = item.split('::');
            return {
              "label": item[0],
              "value": item[1],
              "isSelf": item.length == 3 ? 1 : 0
            };
          }));
        },
        focus: function (e, ul) {
          e.preventDefault();
          sug = ul.item.value;
          isSelf = ul.item.isSelf;
          $this.val(ul.item.label + ' ');
          $this.data('kwd', ul.item.label);
        },
        select: function (e, ul) {
          e.preventDefault();
          sug = ul.item.value;
          isSelf = ul.item.isSelf;
          $this.val(ul.item.label + ' ');
          $this.data('kwd', ul.item.label);
        }
      });
      $this.autocomplete("enable");
    }
    else if (txt.indexOf('in:') == -1 && txt.indexOf('my:') == -1)
    {
      if ($this.data('ui-autocomplete'))
        $this.autocomplete("disable");
      sug = "";
    }

    //in case of empty search kwd , remove the popout and empty the results section
    if ((e.keyCode == 8 || e.keyCode == 46) && (txt == $this.data('kwd') || txt == '@' || txt == '#' || txt.length < 3)) {
      $("#popout").removeAttr("class");
      $this.siblings(".popper").removeClass("_opn");
      $("#srch-rslt").empty();
      $this.removeData('kwd').val('');
      return false;
    }

    if (txt.length > 3) {
      srchOpts = {page: 1, cnt: 15, pc: 0};
      if (txt.toLowerCase().indexOf("in:") == 0 || txt.toLowerCase().indexOf("my:") == 0) {
        if (sug.length)
        {
          if (txt.indexOf(' ') != -1)
            srch = txt.substr(txt.indexOf(' '), txt.length).trim();
        }
        else //Case when filter is typed instead of selection
        {
          var tmp = txt.substr(0, txt.indexOf(' '));
          for (var i = 0; i < sugTags.length; i++)
          {
            var tag = (sugTags[i]).split('::');
            if (tmp == tag[0])
            {
              sug = tag[1];
              srch = txt.substr(txt.indexOf(' '), txt.length).trim();
              if (tag.length == 3)
                isSelf = 1;
              else
                isSelf = 0;
              break;
            }
          }
        }
      }
      else if (txt.indexOf("#") == 0) {
        $this.getHstgSgstns();
      }
      else if (txt.indexOf("@") == 0) {
        sug = 'U';
        srch = txt.substr(1);
      }
      else
        srch = txt;

      if (srch && prvSrchKey != srch)
      {
        showSearchResults($this, (e.keyCode == 13) ? txt : save);
        prvSrchKey = srch;
      }
    }
    if (srch && e.keyCode == 13)
      window.location = "/search?q=" + encodeURIComponent(txt);
  });

  $("#search-frm").on("click", "a", function (e) {
    e.preventDefault();
    srchOpts = {page: 1, cnt: 15, pc: 0};
    showSearchResults($(this).parent().siblings("input[type='text']"), true);
  });
  //to show results when redirected from search bar to search page
  if ($("#search-frm").length && $("#search-frm").find(".search-query").val().trim().length) {
    $("#search-frm").find(".search-query").trigger("keyup", $("#search-frm").find(".search-query").val().trim());
  }

  function showSearchResults($this, save) {
    //if users show suggestions irrespective to search page / search in nav bar
    if (!isSrchLdng)
    {
      if (sug == "U") {
        $.ajax({'url': api + '/us',
          data: {'usr': srch},
          type: 'POST',
          beforeSend: function () {
            isSrchLdng = true;
          },
          success: function (res) {
            res = JSON.parse(res);
            if (res.success == 0) {
              $("#popout").removeClass("in");
              $this.siblings(".popper").removeClass("opn");
              return;
            }
            var imgPth = $('#user-nav').data('isLive') ? 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' : '/public/Multimedia/P_Pic_';
            if ($this.parents("#search-bx").length) {
              var htm = '';
              $.each(res.msg, function (i, v) {
                if (i == 2)
                  return false;
                htm += '<a href="' + $('body').data('auth') + "/" + v.U + '" class="usr"><div class="icn pull-left"><img src="' +
                        imgPth + v.U + '" /></div><p>' + v.F + " " + v.L + '<span class="dft-msg block">' + '@' + v.U + '</span></p></a>';
              });
              showSuggestions(htm, $this, sug);
            }
            else {
              $("#srch-rslt").empty();
              $.each(res.msg, function (i, v) {
                $("#srch-rslt").append('<a href="' + $('body').data('auth') + "/" + v.U + '" class="usr clearfix"><div class="icn-big pull-left"><img src="' + imgPth + v.U + '" ></div>' + '<p><span class="user-small">' + v.F + " " + v.L +
                        '</span><span class="dft-msg block">' + '@' + v.U + '</span></p></a><hr>');
                $("#srch-rslt").find("a:last").find(".icn-big img").findPrfPic();
              });
              $("#srch-rslt").addClass("srch-sgstn");
            }
            if (res['msg'].length < 10)
              isSrchLdng = true;
            else
              isSrchLdng = false;
          }
        });
      }
      else if (srch != '') {
        srchOpts.ctgy = "search",
                srchOpts.scat = sug.length ? sug : "all",
                srchOpts.kwd = srch,
                srchOpts.dt = $("#strt-dt").val() ? Math.floor(new Date($("#strt-dt").val()).getTime() / 1000) : 0,
                srchOpts.edt = $("#end-dt").val() ? Math.floor(new Date($("#end-dt").val()).getTime() / 1000) : Math.floor(new Date().getTime() / 1000),
                srchOpts.auth = $this.getShIntr(),
                srchOpts.usr = $this.getLoggedInUsr();
        srchOpts.save = save;
        srchOpts.isSelf = isSelf;
        var htm = '';
        $.ajax(api + '/gts', {
          data: srchOpts,
          dataType: 'json',
          async: true,
          type: 'post',
          beforeSend: function () {
            isSrchLdng = true;
            if (srchOpts.page <= 1)
              $('#srch-rslt').children().remove();

          },
          success: function (data) {
            if (data != null)
            {
              data = data.msg;
              var d = 0;
              if(data == '' && $this.parents("#search-bx").length)
                 clsPopout();
              while (d < data.length)
              {
                if ($this.parents("#search-bx").length) // To limit number of entries on search popup
                {
                  htm += buildSrchRslts(data[d], $this);
                    showSuggestions(htm, $this);
                    if (d == 1)
                    break;
                }
                else
                {
                  htm = buildSrchRslts(data[d], $this);
                  $("#srch-rslt").append(htm);
                  var trgt = $('#srch-rslt > #' + data[d]['P_Id']);
                  //load cover image in space
                  if (trgt.find('.spc-cvr').length)
                    trgt.find('.spc-cvr').loadSpcCvrImg();

                  //Check for profile picture
                  trgt.find('._usr-info img').each(function () {
                    $(this).findPrfPic();
                  });

                  //Updating timestamp
                  trgt.find('.tmsp').each(function () {
                    $(this).updateTime();
                  });
                }
                d++;
              }
              // isSrchLdng is used as the variable will always remain true until user changes the key
              if (data.length < srchOpts.cnt)
                isSrchLdng = true;
              else
              {
                isSrchLdng = false;
                srchOpts.page++;
                if (srchOpts.page == 1)
                  srchOpts.cnt = 15;
                else
                  srchOpts.cnt = 6;
                srchOpts.pc = srchOpts.pc + data.length;
              }
            }
          }
        });
      }
    }
  }

  function buildSrchRslts(nws, $this) {
    var dt = [], htm = "";
    dt = {};
    dt['ttl'] = nws.P_Title;

    var smry = $(this).buildTxt(nws.P_Smry);
    if (smry.split(':::').length > 1)
      dt['dsc'] = smry.split(':::')[1];
    else if (smry.split('::').length > 1)
      dt['dsc'] = smry.split('::')[1];
    else
      dt['dsc'] = smry;

    dt['url'] = (nws.ev != 3 && nws.ev != 4 ? $('body').data('auth') :
            (nws.ev == 3 ? $('body').data('twn') : (nws.ev == 4 ? $('body').data('dbt') : ''))) + "/" + nws.P_Title_ID;
    if (nws.ev == 5 && nws.P_Cover_Image != '')
      dt['cvr'] = nws.P_Cover_Image;

    if (!$this.parents('#search-bx').length)
    {
      var smry = '';
      switch (nws['ev'])
      {
        case 1:
          var ev_dt = $this.getDateTime(nws.P_EventStartTime);
          smry = '<p class="smry">' +
                  '<span class="block"><i class="icon-time"></i> ' + ev_dt['m'] + ' ' +
                  ev_dt['d'] + ', ' + ev_dt['t'] + '</span>' +
                  '<span class="block"><i class="icon-map-location"></i> ' + nws.P_EventLocation + '</span>' +
                  '</p>';
          break;
        default :
          smry = '<p class="smry">' + $this.buildTxt(dt['dsc'], 0) + '</p>';
          break;
      }
      htm += '<div class="src-itm ' + (nws.ev == 5 ? 'spc' : '') + '" id="' + nws.P_Id + '">' +
              '<div class="_usr-info">' +
              '<div class="usr">' +
              '<div class="icn-sml"><img src="' + ($('#user-nav').data('isLive') ? 'https://saddahaq.blob.core.windows.net/multimedia/P_Pic_' : '/public/Multimedia/P_Pic_') + nws.P_Author + '" /></div>' +
              '<p><a href="' + $('body').data('auth') + "/" + nws.P_Author + '" class="user-small">' + nws.P_Author_FullName + '</a>' +
              '<span class="dot"></span><span class="tmsp" tmsp="' + nws.P_TimeCreated + '"></span>';
      if (nws.ev != 5) {
        htm += '<span class="block">in <a href="' + $('body').data('auth') + "/" + nws.Space_TitleId + '" class="spc-nm">' +
                nws.Space_Title + '</a></span>';
      }
      htm += '</p>' +
              '</div>' +
              '</div>' +
              '<div class="spc-itm">' +
              '<a href="' + dt['url'] + '"></a>' +
              (dt['cvr'] != undefined ? '<div class="spc-cvr" data-cvr="Space_Tile_' + nws.P_Id + '"></div>' : '') +
              '<h3 class="ttl">' + $this.buildTxt(dt['ttl'], 0) + '</h3>' +
              smry + '</div>' +
              '<hr>' +
              '</div>';
    }
    else
    {
      htm += '<a href="' + dt["url"] + '"><span class="dft-msg block"><i class="icon-profile"></i> ' +
              nws.P_Author_FullName + '</span><span class="ttl">' + $this.buildTxt(dt['ttl'], 0) + '</span></a>';
    }
    return htm;
  }

  var rcntSrchShwd = false; // flag for recent search suggestions ajax call
  function showSuggestions(htm, $this, tp) {
    var pop = $this.siblings(".popout");
    if ($('#popout').hasClass('in'))
    {
      $('#popout').find('#src-rslt').html(htm+'<a class="btm-link" href="/search?q=' + encodeURIComponent($this.val().trim()) + '">View more</a>');
    }
    else
    {
      pop.find('> section').html(htm+'<a class="btm-link" href="/search?q=' + encodeURIComponent($this.val().trim()) + '">View more</a>');
      if (pop.find("a").length > 1 && !$this.siblings(".popper").hasClass("opn"))
        $this.siblings(".popper").trigger("click");
    }
    $("#popout").find('a').each(function () {
      $(this).find('.icn img').findPrfPic();
    });

    // ajax call to get recent search suggestions    
    if ($this.parents("#search-bx").length && !rcntSrchShwd) {
      rcntSrchShwd = true;
      $.ajax({'url': $("body").data("api") + '/gpus',
        data: {
          "usr": $this.getLoggedInUsr(),
          "auth": $this.getShIntr(),
          pc: 0,
          cnt: 4
        },
        type: 'POST',
        success: function (res) {
          res = JSON.parse(res);
          if (res.success) {
            var htm = '<a class="mrkr"><span>Recent Search</span></a>';
            $.each(res.msg, function (i, v) {
              if (i == 4)
                return;
              htm += '<a href="' + $('body').data('auth') + "/search?q=" + v.kwd + '">' + v.kwd + '</a>';
            });
            $("#popout > section").find("a:last").before(htm);
          }
        }});
    }

  }
 
  function clsPopout()
  {
    var trgt = $('#popout');
    trgt.removeAttr('class').contents().not('.arrow').remove();
    $('.popper._opn').removeClass('_opn');
    setTimeout(function () {
      trgt.removeAttr('style');
    }, 100);
  }

  /* Load additional tiles when the user hits the bottom of the page */
  $(window).scroll(function () {
    var scroll = $(window).scrollTop();
    if ($(document).height() <= ($(window).height() + scroll * 1.5) && $('#srch-rslt').length && !isSrchLdng)
      showSearchResults($("#search-frm").find(".search-query"));
  });

  /* end of search functionality */

});