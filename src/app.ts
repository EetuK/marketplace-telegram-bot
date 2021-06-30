import { Scenes, session, Telegraf } from "telegraf";
import { Scheduler } from "./helpers/scheduler";
import { createAddParserWizard } from "./commands/addParser";
import { createEditParsersWizard } from "./commands/editParsers";
import { EWizards } from "./commands/wizards";
import { config } from "./helpers/configuration";
import { logger } from "./helpers/log";
import { chatIdMiddleware } from "./commands/chatIdMiddleware";

config.init();

const { TOKEN } = config.getConfig();

const bot = new Telegraf(TOKEN);

bot.use(chatIdMiddleware);

const scheduler = new Scheduler();
const wizards = [
  createAddParserWizard(scheduler, bot),
  createEditParsersWizard(scheduler, bot),
];
const stage = new Scenes.Stage(wizards);

bot.use(session());
bot.use(stage.middleware());

bot.catch((err: Error, ctx) => {
  if (err.message === "unauthorized") {
    // silent
    return;
  }
  throw err;
});

bot.command("start", (ctx) => {
  (ctx as any).scene.enter(EWizards.AddParser);
});

bot.command("list", (ctx) => {
  (ctx as any).scene.enter(EWizards.ListParsers);
});

// Start bot
bot.launch().then(() => {
  logger.info(`Bot ${bot.botInfo.username} is up and running`);
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

process.on("uncaughtException", function (err) {
  logger.error(err);
});
