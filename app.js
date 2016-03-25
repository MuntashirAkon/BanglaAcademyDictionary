$(document).ready(function(){
    console.log("loaded");
});

function show_result(keyword){
    console.log(keyword);
    var response = '{"img":true, "keyword":"abacus", "suggestions":["albeit", "alphabet"] }';
    var result = JSON.parse(response);
    if (result.img == true) show_image(result.keyword);
    show_suggestions(result.suggestions);
    /*
    $.ajax({
        type: 'post',
        url: 'render.php',
        data: 'keyword=' + keyword,
        beforeSend: function(){ console.log("Sending data") },
        success: function(response){
            /*
             * Json Format:
             * {
             * "img":true
             * "keyword":"abacus"
             * "suggestions":["albeit", "alphabet"]
             * }
             *
            var result = JSON.parse(response);
            if (result.img == true) show_image(result.keyword);
            show_suggestions(result.suggestions);
        }
    });*/
}

function show_image(name){
    $("#result").attr("src", "image.php?name=" + name);
}

function show_suggestions(suggestions){
    // First delete all of the suggestions
    $("#suggestion").html("");
    for(var i = 0; i < suggestions.length; i++){
        $("#suggestion").append("<div onclick=\"$('#keyword').val($(this).html());show_result($(this).html());\">" + suggestions[i] + "</div>");
    }
}


