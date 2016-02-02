var BotFactory = require('./src/BotFactory');
if(!process.argv[2]) {
  console.log("Informe o arquivo de configuração como argumento.")
  process.exit(1);
}
var config = require("./" + process.argv[2]);
if(!config) {
  console.log("Erro ao processar arquivo de configuração.")
  process.exit(1);
}
console.log("Iniciando bot...");
var bot = new BotFactory("casaColetivaBot", config.token, config.plugins);
bot.run();
