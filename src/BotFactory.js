var mongodb = require("mongodb").MongoClient;
var TelegramBot = require('node-telegram-bot-api');
var PluginManager = require('./PluginManager');
var plugins = new PluginManager();

var BotFactory = function (botName, token, plugins) {
  this.botName = botName;
  this.plugins = plugins;
  this.token   = token;
}

BotFactory.prototype.run = function() {
  var loadedPlugins = this.plugins;
  var telegramApi = new TelegramBot(this.token, {
    polling: true
  });
  var mongoUrl = 'mongodb://localhost:27017/'+this.botName;
  var self = this;
  telegramApi.getMe().then(function (me) {
    self.botInfo = me;
    mongodb.connect(mongoUrl, function(err, db) {
      plugins.runPlugins(loadedPlugins, db, function(){
        console.log("Todos os plugins estão rodando!");
        var events = ["text","audio","document","photo","sticker","video","voice","contact","location","new_chat_participant","left_chat_participant","new_chat_title","new_chat_photo","delete_chat_photo","group_chat_created"];
        events.forEach(function(eventName){
          telegramApi.on(eventName, function(message){
            emitHandleReply(eventName, message);
          });
        });
        telegramApi.on("inline_query", function(query){
          plugins.emit("inline_query", query, function(results, options) {
            handleAnswerInlineQuery(query.id, results, options);
          });
        });

      });
    });
    process.on('SIGINT', shutDown);

    function emitHandleReply(eventName, message){
      var chatId = message.chat.id;
      try{
        plugins.emit(eventName, message, function(reply) {
          handleReply(chatId,reply);
        });
      } catch (ex){
        console.log(ex);
      }
    };

    function handleReply(chatId, reply){
      switch (reply.type) {
      case "text":
        telegramApi.sendMessage(chatId, reply.text, reply.options);
        break;
      case "audio":
        telegramApi.sendAudio(chatId, reply.audio, reply.options);
        break;
      case "photo":
        telegramApi.sendPhoto(chatId, reply.photo, reply.options);
        break;
      case "status": case "chatAction":
        telegramApi.sendChatAction(chatId, reply.status, reply.options);
        break;
      case "sticker":
        telegramApi.sendSticker(chatId, reply.sticker, reply.options);
        break;
      default:
        console.log("Erro: tipo de resposta não reconhecido");
      }
    }


    function handleAnswerInlineQuery(chatId, results, options){
      telegramApi.answerInlineQuery(chatId, results, options);
    }

    // If `CTRL+C` is pressed we stop the bot safely.

    // Stop safely in case of `uncaughtException`.
    //process.on('uncaughtException', shutDown);

    function shutDown() {
      console.log("O bot tá indo dormir. Desconectando módulos...");
      plugins.shutDown().then(function(){
        console.log("Todos os módulos estão desconectados. Boa noite!")
        process.exit();
      });
    }
  }, function(){
    console.log("Não rolou o getMe. Você forneceu o Token?");
  });
}

module.exports = BotFactory;
