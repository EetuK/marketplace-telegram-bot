import * as dotenv from "dotenv";
import { Scenes, session } from "telegraf";
import { Scheduler } from "./helpers/scheduler";
import { createAddParserWizard } from "./commands/addParser";
import { createEditParsersWizard } from "./commands/editParsers";
import { EWizards } from "./commands/wizards";
dotenv.config({ path: `${__dirname}/../.env` });
import { bot } from "./helpers/bot";

const scheduler = new Scheduler();
const wizards = [
  createAddParserWizard(scheduler, bot),
  createEditParsersWizard(scheduler, bot),
];
const stage = new Scenes.Stage(wizards);

bot.use(session());
bot.use(stage.middleware());

bot.command("start", (ctx) => {
  (ctx as any).scene.enter(EWizards.AddParser);
});

bot.command("list", (ctx) => {
  (ctx as any).scene.enter(EWizards.ListParsers);
});

bot.hears("Delete", (ctx) => {
  ctx.replyWithMarkdown("JEAAA");
});

// Start bot
bot.launch().then(() => {
  console.info(`Bot ${bot.botInfo.username} is up and running`);
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
