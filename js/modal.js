/* Modal 
 * 
 * Events:
 * - modalPopulated: triggered at modal_populate function end
 * 
*/

function modal_open(title, url, autofill){
    modal_close_btn = '<span id="modal_close" title="Close dialog" class="btn fab raised mini mdi" data-hover-class="red_bg white"></span>';
    modal_create($('body'));
    
    if(typeof title === 'string'){
        $('#modal_title').html(title);
    }else if(typeof title === 'object'){
        $('#modal_title').remove();
        $('#modal_head').prepend(title);
    }else{
        $('#modal_head').remove();
    }
    
    if(url !== "/"){
        if(typeof title === 'string' || typeof title === 'object'){
            $("#modal_head").append(modal_close_btn);
        }
    }
    modal_populate(url);
}

function modal_create_back(parent){
    parent.append('<div id="modal_back"></div>');
}

function modal_create(parent){
    if(parent.is('body')){
        modal_create_back(parent);
        parent = $('#modal_back');
    }
    
    parent.append('<div id="modal">\n\
        <div id="modal_head" class="clearfix">\n\
            <span id="modal_title"></span>\n\
        </div>\n\
        <div id="modal_body" class="clearfix"></div>\n\
    </div>');
}

function modal_populate(url){
    $('#modal > #modal_actions').remove();
    if(typeof url !== 'object'){
        url_aux = url.split(' #');
        $.when($.get(url_aux[0], {}, function(data) {
            if(url_aux[1] === undefined){$("#modal_body").html(data);}
            else{$("#modal_body").html($(data).find('#'+url_aux[1]));}
            })
        ).then(function(){
            $('#modal').trigger('modalPopulated');
            modal_center(); 
        });
    }else{
        $("#modal_body").html(url);
        if($('#modal_close').length !== 1){$('#modal_body').prepend(modal_close_btn);}
        $('#modal').trigger('modalPopulated');
        modal_center();
    }
    $('#modal').data('u',url);
}

function modal_center(){
    if($('#modal').parent().is('#modal_back')){
        $("#modal_back").fadeIn(400,function(){
            $("#modal").show('fold',{},400,function(){
                $('#modal_body input').eq(0).focus();
            });
        });
        
        var $images = $('#modal_body img'),
            preloaded = 0,
            total = $images.length;
        $images.load(function() {
            if (++preloaded === total) {
                $("#modal").center().css('transform','none');
            }
        });

        if($.isFunction($.fn.draggable)){
            $("#modal").draggable({handle: '#modal_head'});
        }
        if($.isFunction($.fn.resizable)){
            $("#modal").resizable();
        }
    }else{
        $("#modal").show('fold',{},400,function(){
            $('#modal_body input').eq(0).focus();
        });
        var $images = $('#modal_body img'),
            preloaded = 0,
            total = $images.length;
        $images.load(function() {
            if (++preloaded === total) {
                $("#modal").inside_center().css('transform','none');
            }
        });
    }
}

function modal_reload(){
    url = $('#modal').attr('data-url');
    modal_populate(url);
}

function modal_closer(){
    $("div#modal").remove();
    $("div#modal_back").remove();
}

$(document).on('click','#modal_close',modal_closer);
$(document).on('click','#modal_back',function(e){
    if ($(e.target).is('#modal_back')) {
        modal_closer();
    }
});

$(document).on('modalPopulated','#modal',function(){
    if($(this).find('#modal_body #modal_actions').length >= 1){
        $('#modal').append($('#modal_body #modal_actions').clone());
        $('#modal_body #modal_actions').remove();
        console.log('#modal_actions extracted from content.');
    }
    
    var a_height = $('#modal_actions').outerHeight() + parseInt($('#modal_body').css('paddingBottom'));
    var b_height = $('#modal_body').height();
    $('#modal_body').height(b_height-a_height);
});