/**
 * Created by Mujtahid Akon on 3/29/2016.
 */
var db;

$(document).ready(function(){
    var w_height = $(window).height();
    $("#suggestion").height(w_height-105);
    $(".result_set").height(w_height-75);
    $("#suggestion").width($("#keyword").width());
    generate_otd();
});

function show_result(keyword){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/BanglaAcademyDictionary/dictionary.db', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
        var uInt8Array = new Uint8Array(this.response);
        db = new SQL.Database(uInt8Array);

        var name = db.exec("SELECT entry FROM dic_entries WHERE entry LIKE '" + keyword + "%' LIMIT 1");
        // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
        name = name[0].values[0][0];
        show_image(name);
        var suggestions = db.exec("SELECT entry FROM dic_entries WHERE entry LIKE '" + keyword.charAt(0) + "%'");
        show_suggestions(name, suggestions[0].values);
    };
    xhr.send();
}

function show_image(name){
    src = "https://raw.githubusercontent.com/mujtahid-akon/English-to-Bangla-Dictionary/master/images/" + name;
    if (name != "") $("#result").attr("src", src);
    else $("#result").attr("alt", "Word Doesn't Exist");
}

function show_suggestions(word, suggestions){
    // First delete all of the suggestions
    $("#suggestion").html("");
    var selectedClass = "";
    for(var i = 0; i < suggestions.length; i++){
        selectedClass = (suggestions[i][0] == word) ? " selected" : "";
        $("#suggestion").append("<div class='word" + selectedClass + "' onclick=\"$('#keyword').val($(this).html());show_result($(this).html());$('#otd').hide()\">" + suggestions[i][0] + "</div>");
    }
    // Scroll to the selected query
    $("#suggestion").scrollTop($("#suggestion.selected").index()*20)
}

function generate_otd(){
    var today = (new Date()).getDay();
    if(getCookie("d") == today) {
        otd = getCookie("0td");
        show_result(otd);
    }else{
        var xhr = new XMLHttpRequest();
    xhr.open('GET', '/BanglaAcademyDictionary/dictionary.db', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
        var uInt8Array = new Uint8Array(this.response);
        db = new SQL.Database(uInt8Array);
        otd = db.exec("SELECT entry FROM `dic_entries` WHERE length(entry) > 3 ORDER BY RANDOM() LIMIT 1");
        otd = otd[0].values[0][0];
        show_result(otd);
        setCookie("0td", otd, 1);
        setCookie("d", today, 1);
};
xhr.send();
    }
}

function setCookie(name, value, expire_day) {
    var d = new Date();
    d.setTime(d.getTime() + (expire_day*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
}

function getCookie(name) {
    name = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
