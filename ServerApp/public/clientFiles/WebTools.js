(function() {
    /* Loading CSS */
    var css = document.createElement("link");css.rel = "stylesheet";css.type = "text/css";css.href = "http://localhost:8080/clientFiles/WebTools.css";document.getElementsByTagName("head")[0].appendChild(css);
        
    /* Loading JS */
    var script = document.createElement("SCRIPT");script.src = 'http://localhost:8080/clientFiles/html2canvas.js';script.type = 'text/javascript';document.getElementsByTagName("head")[0].appendChild(script);
        
    var checkReady = function(callback) {
        if (window.jQuery) {
            callback(jQuery);
        }
        else {
            var script = document.createElement("SCRIPT");script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js';script.type = 'text/javascript';document.getElementsByTagName("head")[0].appendChild(script);
            window.setTimeout(function() { checkReady(callback); }, 100);
        }
    };

    checkReady(function($) {
        var projectID = $('#WebTools-widget-container').data('projectid');
        $.ajax({
            dataType: 'jsonp',                     
            jsonp: 'callback',
            url: 'http://localhost:8080/api/'+ projectID +'',                       
            success: function(data) {
                if(data.proceed == true) {
                    WebTools.projectID = projectID;
                    WebTools.init();
                }
                else {
                    alert("Test Your Product Key, You are unauthorized to use this tool without proper Product Key");
                }
            }
        });

        var WebTools = {
            init: function(){
                this.DetectBrowserAndOS();
                this.loadSideMenuButton();
            },
            DetectBrowserAndOS: function(){
                /* Third party Code for detecting browser version, Name and OS */
                navigator.whichBrowser = (function(){
                    var ua= navigator.userAgent, tem, 
                    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
                    if(/trident/i.test(M[1])){
                        tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
                        return 'IE '+(tem[1] || '');
                    }
                    M= M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
                    if((tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
                    return M.join(' ');
                })();

                var OSName = "Unknown OS";
                if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
                if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
                if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
                if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux based OS";

                WebTools.BrowserOS = {
                    'browserName': navigator.whichBrowser,
                    'OSName': OSName
                }
            },
            loadSideMenuButton: function(){
                var div = '<div class="WebTools-panel"><div class="WebTools-toggle-button"></div></div>';
                div += '<div class="WebTools-menu">';
                div += '<a data-column="feedback" class="WebTools-feedback">Feedback</a>';
                div += '<a data-column="bug" class="WebTools-bug">Bug</a>';
                div += '<a data-column="suggestion" class="WebTools-suggestion">Suggestion</a>';
                div += '</div>';
                div += '<div class="WebTools-overlay"></div>';
                div += '<div class="WebTools-popup">';
                div += '<div class="WebTools-close"><img src="http://localhost:8080/clientFiles/fileclose.png" alt=""></div>';
                div += '<div class="WebTools-popup-content"></div>';
                div += '</div>';
                $('#WebTools-widget-container').append(div);

                //Click for the tools Menu
                this.initClick();
            },
            initClick: function(){
                $('.WebTools-close').click(function(){
                    $('.WebTools-popup-content').empty();
                    $('.WebTools-popup, .WebTools-close').hide();
                });
                $('.WebTools-menu a').click(function(e){
                    $('.WebTools-menu a').removeClass('selected');
                    $(this).addClass('selected');

                    var data = $(this).data('column');
                    $('.WebTools-popup-content select option').each(function(){
                        if($(this).val() == data) {
                            $(this).prop('selected', true);
                        }
                    });
                });
                $('.WebTools-toggle-button').click(function(e){
                    if($('.WebTools-menu').hasClass('animated')){
                        $('.WebTools-menu').removeClass('animated');
                        $('.WebTools-menu a').removeClass('selected');
                        $('.WebTools-overlay').hide();
                    }
                    else {
                        $('.WebTools-menu').addClass('animated');
                        $('.WebTools-menu a')[0].click();
                        $('.WebTools-overlay').show();
                    }
                });

                var $selection = $('<div>').addClass('WebTools-selection-box');
                $('.WebTools-overlay').on('mousedown', function(e){
                    if($('.WebTools-menu').hasClass('animated')){
                        $('.WebTools-close').click();
                        var clickX = e.pageX, clickY = e.pageY;
                        $selection.css({
                            'top':    clickY - $(document).scrollTop(),
                            'left':   clickX,
                            'width':  0,
                            'height': 0
                        });
                        $selection.appendTo($('.WebTools-overlay'));
                        $('.WebTools-overlay').on('mousemove', function(e) {
                            var moveX = e.pageX, moveY = e.pageY;
                            var width  = Math.abs(moveX - clickX),
                                height = Math.abs(moveY - clickY),
                                newX = (moveX < clickX) ? (clickX - width) : clickX;
                                newY = (moveY < clickY) ? (clickY - height) : clickY;
                            $selection.css({
                                'width': width,
                                'height': height,
                                'top': newY - $(document).scrollTop(),
                                'left': newX
                            });     
                            WebTools.wid = width;
                            WebTools.hei = height;
                            WebTools.newX = newX;
                            WebTools.newY = newY;
                        });
                    }
                }).on('mouseup', function(e) {
                    $('.WebTools-overlay').off('mousemove');
                    $selection.remove();
                    html2canvas(document.body, {
                        onrendered: function(canvas) {
                            if(WebTools.wid > 10 || WebTools.hei > 10) {
                                $('.WebTools-popup, .WebTools-close').show();
                                var wid = $('.WebTools-popup').outerWidth();
                                var docWid = $(document).width();
                                var leftPos = (docWid - wid) / 2;
                                $('.WebTools-popup').css({ 'left': leftPos });
                                var context = canvas.getContext("2d");
                                var img = canvas.toDataURL("image/png");
                                var wid = WebTools.wid;
                                var hei = WebTools.hei;
                                var imageObj = new Image();
                                imageObj.onload = function() {
                                    var canvas = document.createElement('canvas');
                                    canvas.width = wid;
                                    canvas.height = hei;
                                    var context = canvas.getContext("2d");
                                    context.drawImage(imageObj,WebTools.newX,WebTools.newY,WebTools.wid,WebTools.hei,0,0,WebTools.wid,WebTools.hei);
                                    var img = canvas.toDataURL("image/png");
                                    var div = '<textarea class="WebTools-textarea" style="height: 65px;" placeholder="Feel Free to give your Feedback"></textarea><img  class="WebTools-image" src="'+ img +'">';
                                    $('.WebTools-popup-content').html(div);
                                    var div = '<p><strong>Note : </strong>If the rendered image is not proper, Dont worry, Send the feedback since we are capturing the Browser and OS data along with this form. We will look into it.</p>';
                                    div += '<hr/><div style="max-width: 500px;margin: 0 auto;">';
                                    div += '<select  class="WebTools-select-value">';
                                    $('.WebTools-menu a').each(function(){
                                        var html = $(this).html();
                                        var data = $(this).data('column');
                                        var selected = $(this).hasClass('selected');
                                        if(selected)
                                            div += '<option value="'+ data +'" selected>'+ html +'</option>';
                                        else 
                                            div += '<option value="'+ data +'">'+ html +'</option>';
                                    });
                                    div += '</select>';
                                    div += '<span class="WebTools-fleft"><strong>Browser</strong> : <span class="WebTools-browser">'+ WebTools.BrowserOS.browserName +'</span></span>';
                                    div += '<span class="WebTools-fright"><strong>Operationg System</strong> : <span class="WebTools-OS">'+ WebTools.BrowserOS.OSName +'</span></span>';
                                    div += '</div><hr/>';
                                    div += '<div class="WebTools-button">Submit</div>';
                                    $('.WebTools-popup-content').append(div);
                                    WebTools.wid = 0;WebTools.hei = 0;WebTools.newX = 0;WebTools.newY = 0;

                                    $('.WebTools-popup-content select').change(function(){
                                        var val = $(this).val();
                                        $('.WebTools-menu a').each(function(){
                                            var data = $(this).data('column');
                                            if(data == val) {
                                                $(this).click();
                                            }
                                        });
                                    });

                                    $('.WebTools-button').click(function(e){
                                        var text = $('.WebTools-textarea').val();
                                        var type = $('.WebTools-select-value').val();
                                        var browser = $('.WebTools-browser').html();
                                        var OS = $('.WebTools-OS').html();
                                        var image = $('.WebTools-image').attr('src');
                                        var projectID = WebTools.projectID;

                                        var data = {
                                            'text': text,
                                            'type': type,
                                            'browser': browser,
                                            'OS': OS,
                                            'image': image,
                                            'projectID': projectID
                                        }
                                        $.ajax({
                                            data: data,                     
                                            type: "POST",
                                            crossDomain: true,
                                            dataType: 'json',
                                            url: 'http://localhost:8080/api/feedback',                       
                                            success: function(data) {
                                                if(data.saved == true) {
                                                    $('.WebTools-close').click();
                                                    alert("Saved Successfully");
                                                }
                                            },
                                            error: function(xhr, status, error) {
                                                alert(status);
                                            }
                                        });
                                    });
                                };
                                imageObj.src = img;
                            }
                        }
                    });
                });
            }
        };
    });
})();