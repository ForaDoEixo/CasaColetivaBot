var Util = require('./../src/Util');
var scrape = require('html-metadata');
var ObjectID = require('mongodb').ObjectID;

var inventario = function() {
  this.properties = {
    shortDescription: "Plugin de inventário",
    instructions: {
      "inventario listar": "_/inventario adicionar NOME_ para um item",
      "inventario adicionar": "_/inventario listar_ listar os itens cadastrados",
      inventario remover"": "_/inventario remover #ID_ para remover um item"
    }
  };
  this.commands = {
    "inventario listar": function(args, reply, msg, db) {
      var collection = db.collection('recipes');
      collection.find({}).toArray(function(err, docs) {
        if(docs.length == 0) {
          reply({type: 'text', text: "Nenhuma item registrado."});
          return;
        }
        else {
          var message = Array("Receitas:");
          for (var i = 0; i < docs.length; i++) {
            var item = docs[i];
            item = "#"+(i+1)+" - id: "+ item._id.toString()+" - ["+item.name+"]("+item.link+")";
            message.push(item);
          }
          reply({type: 'text', text: message.join("\r\n"), options: {parse_mode: "Markdown", disable_web_page_preview: true}});
        }
      });
    },

    "inventario adicionar": function(args, reply, msg, db) {
      var url = args[1];
      var collection = db.collection('recipes');
      scrape(url).then(function(metadata){
        collection.insert({name: metadata.general.title, link: url}, function (err) {
          reply({type: 'text', text: "'"+metadata.general.title.replace(/^\s+|\s+$/g,"") +"' adicionada com sucesso!", options: { reply_to_message_id: msg.message_id }});
        });
      });
    },

    "inventario remover": function(args, reply, msg, db) {
      var id = ObjectID(args[1]);
      var collection = this.db.collection('recipes');
      collection.deleteOne({"_id": id}, function (err, removed) {
        if(removed.result.n == 1) {
          reply({type: 'text', text: "Receita removida.", options: { reply_to_message_id: msg.message_id }});
        }
      });
    }
  }
}
module.exports = inventario;
