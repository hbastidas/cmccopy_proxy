var request = require("request");
var cheerio = require("cheerio");

const ProjectName="marketcapve";

var express = require('express');
var app = express();


var options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['css', 'json', 'js', 'ico', 'png'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
}
app.use(express.static(__dirname + '/public', options));


async function removeElements($, level){
  $(".cmc-newsletter-signup").remove()
  //$("script").remove();
  $("[id*='ad']").remove()

  //remove donations
  $("[data-target='#donate_eth']").parent("li").remove()
  $("[data-target='#donate_ltc']").parent("li").remove()
  $("[data-target='#donate_bch']").parent("li").remove()
  //remove liks for all
  $("a[href='/all/views/all/']").remove()
  $("a[href='/watchlist/']").parent('li').remove()
  if(typeof level !== 'undefined'){
    $("a[href='/"+level+"/all/views/all/']").remove()
    $("a[href='/"+level+"/watchlist/']").parent('li').remove()
  }

  $("[data-watchlist-add]").parent("li").remove()
  return $;
}

async function reemplaceElements($){
  var replace_str = $('body').html().replace(/CoinMarketCap/g,ProjectName);
  $('body').html(replace_str);

  $("[data-target='#donate_btc']").text("32pXF4Bn7gjBcBw9rfbqL22fFfWtkBW9wz")
  $("#donate_btc > div > div > div.modal-body.text-center > strong").text("32pXF4Bn7gjBcBw9rfbqL22fFfWtkBW9wz")
  $("#donate_btc > div > div > div.modal-body.text-center > img").attr("src", "https://chart.googleapis.com/chart?chs=325x325&cht=qr&chl=32pXF4Bn7gjBcBw9rfbqL22fFfWtkBW9wz&choe=UTF-8")
  $("meta[property='og:image']").attr("content", "/img/splash.png")
  $("meta[property='og:site_name']").attr("content", ProjectName)
  $("meta[property='og:title']").attr("content", "Cryptocurrency Market Capitalizations")
  //reemplace elements in js

  await $("script[src]").each(function() {
    var src = $(this);
    var text = src.attr("src");

    var re = new RegExp(/(https:\/\/s2\.coinmarketcap\.com\/static\/cloud\/compressed\/)+(base+\.).+(js)/,'g'); // notacion literal
    var re2 = new RegExp(/(https:\/\/s2\.coinmarketcap\.com\/static\/cloud\/compressed\/)+(basehead+\.).+(js)/,'g'); // notacion literal
    var re3 = new RegExp(/(https:\/\/s2\.coinmarketcap\.com\/static\/cloud\/compressed\/)+(currencies_main+\.).+(js)/,'g'); // notacion literal
    var re4 = new RegExp(/(https:\/\/s2\.coinmarketcap\.com\/static\/cloud\/compressed\/)+(prebid+\.).+(js)/,'g'); // notacion literal
    var re5 = new RegExp(/(https:\/\/s2\.coinmarketcap\.com\/static\/cloud\/compressed\/)+(currencies_top+\.).+(js)/,'g'); // notacion literal
    if(text.match(re)!=null){
      src.attr("src", "/base.js");
      src.attr("notremove", "true");
    }

    if (text.match(re2)!=null) {
      src.attr("src", "/basehead.js");
      src.attr("notremove", "true");
    }

    if (text.match(re3)!=null) {
      src.attr("src", "/currencies_main.js");
      src.attr("notremove", "true");
    }

    if (text.match(re4)!=null) {
      src.attr("src", "/prebid.js");
      src.attr("notremove", "true");
    }

    if (text.match(re5)!=null) {
      src.attr("src", "/currencies_top.js");
      src.attr("notremove", "true");
    }
    //src.attr("src", "https://coinmarketcap.com/"+text);
  });

  await $("link[href]").each(function() {
    var src = $(this);
    var url = src.attr("href");

    var re = new RegExp(/(https:\/\/s2\.coinmarketcap\.com\/static\/cloud\/compressed\/)+(base).*?.(css)/,'g'); // notacion literal
    if(url.match(re)!=null){
      src.attr("href", "/main.css");
    }

  });
  return $
}

async function inyectElements($){
  $("body").prepend($("<script>").attr("src", "/inyect.js"))
  return $
}


app.get('/', function (req, res) {
  request({
    uri: "https://coinmarketcap.com/",
  }, async function(error, response, body) {
    var $ = cheerio.load(body);
    $=await removeElements($);
    $=await reemplaceElements($);
    $=await inyectElements($);
    //$("script[notremove!=true]").remove()
    res.send($.html());
  });
});

app.get('/:lv1', function (req, res) {
  var level1 = req.params.lv1;
  request({
    uri: "https://coinmarketcap.com/"+level1
  }, async function(error, response, body) {
    var $ = cheerio.load(body);
    $=await removeElements($, level1);
    $=await reemplaceElements($);
    $=await inyectElements($);
    //$("script[notremove!=true]").remove()
    res.send($.html());
  });
});

app.get('/:lv1/:lv2', function (req, res) {
  var level1 = req.params.lv1;
  var level2 = req.params.lv2;
  request({
    uri: "https://coinmarketcap.com/"+level1+"/"+level2
  }, async function(error, response, body) {
    var $ = cheerio.load(body);
    $=await removeElements($, level1);
    $=await reemplaceElements($);
    $=await inyectElements($);
    //$("script[notremove!=true]").remove()
    res.send($.html());
  });
});

app.get('/:lv1/:lv2/:lv3', function (req, res) {
  var level1 = req.params.lv1;
  var level2 = req.params.lv2;
  var level3 = req.params.lv3;
  request({
    uri: "https://coinmarketcap.com/"+level1+"/"+level2+"/"+level3
  }, async function(error, response, body) {
    var $ = cheerio.load(body);
    $=await removeElements($);
    $=await reemplaceElements($);
    $=await inyectElements($);
    //$("script[notremove!=true]").remove()
    res.send($.html());
  });
});

app.get('/:lv1/:lv2/:lv3/:lv4', function (req, res) {
  var level1 = req.params.lv1;
  var level2 = req.params.lv2;
  var level3 = req.params.lv3;
  var level4 = req.params.lv4;
  request({
    uri: "https://coinmarketcap.com/"+level1+"/"+level2+"/"+level3+"/"+level4
  }, async function(error, response, body) {
    var $ = cheerio.load(body);
    $=await removeElements($);
    $=await reemplaceElements($);
    $=await inyectElements($);
    //$("script[notremove!=true]").remove()
    res.send($.html());
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
