var Util = require('./../src/Util');
var scrape = require('html-metadata');

var agenda = function(){
  this.properties = {
    shortDescription: "Montar e visualizar uma agenda",
    instructions: {
      "agenda hoje": "/agenda hoje para mostrar os eventos programados para hoje",
      "agenda horarios": "/agenda horarios para ver os horários pré-definidos"

    }
  }
  this.commands = {
    "agenda hoje": (args, reply, msg, db) {
      reply({type: 'text', text: "Lucas, qual o agenda?", options: { reply_to_message_id: msg.message_id }});
    },
    "agenda horarios": (args, reply, msg, db) {
      message = ["Quadro de horários:\r\n",
                 "Café da manhã - 08:30",
                 "Almoço - 12:30",
                 "Café da tarde - 16:20+10",
                 "Jantar - 20:30"];
      reply({type: 'text', text: message.join("\r\n"), options: { reply_to_message_id: msg.message_id }});
    }
  }
};

module.exports = agenda;
