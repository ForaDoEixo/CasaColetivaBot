/*
 DESCRIPTION:
 PluginHelper
 This special plugin will manage help command, enable/disable plugin requests and much more that the average plugin-writer should not be concerned of.

 AUTHOR:
 Alan Meira

 COMMANDS:
 !help
 !list
 !enable
 !disable

 EXAMPLE:
 TODO
 */

var Util = require('./../src/Util');
var ajuda = function(){
  this.inline = true;
  this.properties = {
    shortDescription: "Plugin de ajuda",
    instructions: {
      "ajuda": "/ajuda para receber instruções básicas",
      "listar": "/listar lista os módulos disponíveis",
      "iniciar": "/iniciar para iniciar uma sessão com o bot",
      "info": "/info NomeDoModulo para saber mais sobre um módulo"
    }
  }
  this.generateList = function(){
    var message = "*Módulos ativos*\n\n"
    var messageInline = "\n*Módulos automáticos*\n\n"
    pluginNames = Object.keys(this.plugins)
    for(var i in pluginNames)
    {
      plugin = this.plugins[pluginNames[i]];
      if(!plugin.hidden && !plugin.inline)
        message += "• " + plugin.name + "\n";

      if(!plugin.hidden && plugin.inline)
        messageInline += "• " + plugin.name + "\n";
    }
    message += messageInline;
    message += "\nDigite `/ajude NomeDoModulo` para saber mais sobre.";
    return message;
  }

  this.commands = {
    "ajuda": function(args, reply, msg, db) {
      plugin = args[1];
      if(plugin) {
        if(this.plugins[plugin] && !this.plugins[plugin].hidden) {
          help = this.plugins[plugin];
          message = ["*" + help.name + "*", help.shortDescription, "\n"]
          for(var k in help.instructions)
            message.push(help.instructions[k])
          reply({type:"text", text: message.join("\n"), options:{parse_mode: "Markdown"} })
        }
      }
      else {
        console.log(1);
        message = this.generateList();
        console.log(2);
        reply({type:"text", text: message, options:{parse_mode: "Markdown"} })
      }
    },
    "listar": function(args, reply, msg, db) {
      message = this.generateList();
      reply({type:"text", text: message, options:{parse_mode: "Markdown"} });
    },
    "iniciar": function(args, reply, msg, db) {
      message = "Digite `/list` ou `/help` pra ver uma lista de ações possíveis. Use `/info` para saber mais sobre mim.";
      reply({type:"text", text: message, options:{parse_mode: "Markdown"} });
    },
    "info": function(args, reply, msg, db) {
      message = "Está com preguiça de lavar louça? Mande o bot lavar pra você! (mentira, você vai ter que lavar).";
      reply({type:"text", text: message, options:{parse_mode: "Markdown", disable_web_page_preview: true} });
    }
  }

  this.addPlugin = function(plugin){
    this.plugins[plugin.properties.name] = plugin.properties;
  };
};

module.exports = ajuda;
