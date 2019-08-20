var request = require("request");
var cheerio = require("cheerio");



var express = require('express');
var app = express();


var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['css', 'json', 'js', 'ico'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}
app.use(express.static(__dirname + '/public', options));


app.get('/:page', function (req, res) {
  var page = req.params.page;
  console.log("aqui "+page)

  request({
    uri: "https://coinmarketcap.com/"+page,
  }, async function(error, response, body) {
    var $ = cheerio.load(body);
    //$("script").remove();
    $("[id*='ad']").remove()
  });

});

app.get('/:page/:currency', function (req, res) {
  var page = req.params.page;
  var currency = req.params.currency;


  request({
    uri: "https://coinmarketcap.com/"+page+"/"+currency,
  }, async function(error, response, body) {
    var $ = cheerio.load(body);
    //$("script").remove();
    $("[id*='ad']").remove()


/*
    await $("*[src]").each(function() {
      var src = $(this);
      var text = src.attr("src");
      src.attr("src", "https://coinmarketcap.com/"+text);
    });

    await $("link[href]").each(function() {
      var src = $(this);
      var url = src.attr("href");
      if(url[0]!="/" && url[0]!="h"){
        src.attr("href", "https://coinmarketcap.com/"+url);
      }

    });
*/

  });

});


app.get('/', function (req, res) {

  request({
    uri: "https://coinmarketcap.com/",
  }, async function(error, response, body) {
    var $ = cheerio.load(body);


    //$("script").remove();
    $("[id*='ad']").remove()


    await $("*[src]").each(function() {
      var src = $(this);
      var text = src.attr("src");


      var re = new RegExp(/(https:\/\/s2\.coinmarketcap\.com\/static\/cloud\/compressed\/)+(base+\.).+(js)/,'g'); // notacion literal
      var re2 = new RegExp(/(https:\/\/s2\.coinmarketcap\.com\/static\/cloud\/compressed\/)+(basehead+\.).+(js)/,'g'); // notacion literal
      if(text.match(re)!=null){
        console.log(text.match(re))
        src.attr("src", "base.js");
      }else if (text.match(re2)!=null) {
        console.log(text.match(re2))
        src.attr("src", "basehead.js");
      }else{
        //al parecer son imagenes
        //console.log(text)
        //$(this).remove()
      }
      //src.attr("src", "https://coinmarketcap.com/"+text);
    });

    await $("link[href]").each(function() {
      var src = $(this);
      var url = src.attr("href");

      var re = new RegExp(/(https:\/\/s2\.coinmarketcap\.com\/static\/cloud\/compressed\/)+(base).*?.(css)/,'g'); // notacion literal
      if(url.match(re)!=null){
        src.attr("href", "main.css");
      }

    });


    res.send($.html());
  });

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
