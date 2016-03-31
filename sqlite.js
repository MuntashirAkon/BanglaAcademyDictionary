/**
 * Created by Muntashir Akon on 3/29/2016.
 */
var dict = new Dictionary();

$(document).ready(function(){
    var w_height = $(window).height();
    $("#suggestion").height(w_height-105);
    $(".result_set").height(w_height-75);
    $("#suggestion").width($("#keyword").width());
    dict.db_connect();
    dict.gen_otd();
});

var Dictionary = function(){
    var db_src = "/BanglaAcademyDictionary/dictionary.db";
    var img_src = "https://raw.githubusercontent.com/mujtahid-akon/English-to-Bangla-Dictionary/master/images/";
    var db;
    this.keyword;
    this.db_connect = function(){}{
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/BanglaAcademyDictionary/dictionary.db', true);
        xhr.responseType = 'arraybuffer';
    
        xhr.onload = function(e) {
            var uInt8Array = new Uint8Array(this.response);
            db = new SQL.Database(uInt8Array);
        };
        xhr.send();
    };
    this.show_result = function(word){
        this.keyword = word;
        var name = db.exec("SELECT entry FROM dic_entries WHERE entry LIKE '" + this.keyword + "%' LIMIT 1");
        // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
        this.keyword = name[0].values[0][0];
        this.show_image();
        this.show_suggestions();
    };
    this.show_image = function(){
        if (this.keyword != "") $("#result").attr("src", this.img_src + this.keyword);
        else $("#result").attr("alt", "Word Doesn't Exist");
    };
    this.show_suggestions = function(){
        var suggestions = db.exec("SELECT entry FROM dic_entries WHERE entry LIKE '" + this.keyword.charAt(0) + "%'");
        suggestions = suggestions[0].values;
        // First delete all of the suggestions
        $("#suggestion").html("");
        var selectedClass = "";
        for(var i = 0; i < suggestions.length; i++){
            selectedClass = (suggestions[i][0] == word) ? " selected" : "";
            $("#suggestion").append("<div class='word" + selectedClass + "' onclick=\"$('#keyword').val($(this).html());show_result($(this).html());$('#otd').hide()\">" + suggestions[i][0] + "</div>");
        }
        // Scroll to the selected query
        $("#suggestion").scrollTop($("#suggestion .selected").index()*20);
    };
    this.gen_otd = function(){
    var cookie = new Cookie();
    var today = (new Date()).getDay();
    var otd;
    if(cookie.get("d") == today) {
        otd = cookie.get("0td");
    }else{
        var expire = 24*60*60;
        otd = db.exec("SELECT entry FROM `dic_entries` WHERE length(entry) > 3 ORDER BY RANDOM() LIMIT 1");
        otd = otd[0].values[0][0];
        cookie.set("0td", otd, expire);
        cookie.set("d", today, expire);
    }
    this.show_result(otd);
}
};

var Cookie = function(){
    this.set = function(name, value, expire) {
        var d = new Date();
        d.setTime(d.getTime() + (expire*1000));
        expire = "expires="+d.toUTCString();
        document.cookie = name + "=" + value + "; " + expire;
    };
    this.get = function(name) {
        name = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    };
};
