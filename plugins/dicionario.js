var Util = require('./../src/Util');
var scrape = require('html-metadata');
var ObjectID = require('mongodb').ObjectID;
var cozinha = function(){
  this.properties = {
    shortDescription: "Plugin para gerenciar dicionário de dados",
    instructions: {
      "listar itens": "/listar itens",
      "adicionar item": "/adicionar item TITULO INFORMAÇÃO para adicionar um novo item",
      "remover item": "/remover item #ID para remover um item pelo seu identificador"
    }
  }
  this.commands = {
    "listar itens": function(args, reply, msg, db) {
      var collection = context.db.collection('recipes');
      collection.find({}).toArray(function(err, docs) {
        if(docs.length == 0) {
          reply({type: 'text', text: "Nenhum item encontrado."});
          return;
        }
        else {
          var message = Array("Itens:");
          for (var i = 0; i < docs.length; i++) {
            var item = docs[i];
            item = "#"+(i+1)+" - id: "+ item._id.toString()+" - ["+item.name+"]("+item.link+")";
            message.push(item);
          }
          reply({type: 'text', text: message.join("\r\n"), options: {parse_mode: "Markdown", disable_web_page_preview: true}});
        }
      });
    },
    "adicionar item": function(args, reply, msg, db) {
      var url = args[1];
      var collection = context.db.collection('recipes');
      scrape(url).then(function(metadata){
        collection.insert({name: metadata.general.title, link: url}, function (err) {
          reply({type: 'text', text: "'"+metadata.general.title.replace(/^\s+|\s+$/g,"") +"' adicionada com sucesso!", options: { reply_to_message_id: msg.message_id }});
        });
      });
    },
    "remover item": function(args, reply, msg, db) {
      var id = ObjectID(args[1]);
      var collection = context.db.collection('recipes');
      collection.deleteOne({"_id": id}, function (err, removed) {
        if(removed.result.n == 1) {
          reply({type: 'text', text: "Receita removida.", options: { reply_to_message_id: msg.message_id }});
        }
      });
    }
  }
};

module.exports = cozinha;
