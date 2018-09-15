const request = require('request');
const Discord = require('discord.js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const client = new Discord.Client();

function getChildText(elems) {
  ret = "";
  for (var i = 0; i < elems.length; i++) {
    if (elems[i].children.length != 0) {
      ret += getChildText(elems[i].children);
    }
    if (elems[i].textContent != "") {
      ret += elems[i].textContent;
    }
  }
  return ret;
}

function ping(ip, msg) {
  request('https://kigen.co/scpsl/browser.php?table=y&ip=' + ip, { json: false }, (err, res, body) => {
    if (err) { return console.log(err); }
    html = new JSDOM(body);
    try {
      name = html.window.document.body.getElementsByTagName('tbody')[0].children[0].children[1].children[0].children;
      desc = html.window.document.body.getElementsByTagName('tbody')[0].children[0].children[2].children;
      online = html.window.document.body.getElementsByTagName('tbody')[0].children[0].children[3].textContent;
      nameret = getChildText(name);
      descret = getChildText(desc);
      //plrret = getChildText(online);
      console.log(descret);
      request('https://pastebin.com/raw/' + descret, { json: false }, (err2, res2, body2) => {
        if (err2) { return console.log(err2); }
        html2 = new JSDOM(body2);
        close = "Name: " + nameret + "\nOnline/Max Players: " + online + "\Info:\n" + html2.window.document.body.textContent;
        msg.edit("```" + close.substr(0, 1000) + "```");
      });
    } catch (e) {
      console.log(e);
      msg.edit("An error occured.");
    }
    //console.log(body);
  });
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.startsWith('!scping')) {
    msg.reply('pong').then(reply => {
      try {
        ping(msg.content.split(" ")[1], reply);
      } catch (e) {
        console.log(e);
        reply.edit("An error occured.");
      }
    }).catch(console.error);
  }
});
client.login('token');
