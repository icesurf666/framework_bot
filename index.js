// Импорт Telegraf и Markup
const {
  Telegraf,
  Markup
} = require('telegraf')
// Импорт dotenv для защиты API токена
require('dotenv').config()
// Импорт нашего модуля с константами
const my_const = require('./const')
// Инициализация бота с помощью Telegraf
const bot = new Telegraf(process.env.BOT_TOKEN)

// Обработка команды /start
bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name ? ctx.message.from.first_name : 'незнакомец'}!`))
// Обработка команды /help
bot.help((ctx) => ctx.reply(my_const.commands))
// Обработка команды /course
bot.command('framework', async (ctx) => {
  try {
    await ctx.replyWithHTML('<b>Ваше приложение будет обладать сложным функционалам и вам важна производительность?</b>', Markup.inlineKeyboard(
      [
        [
          Markup.button.callback('Да', 'answer_1_btn_1'), 
          Markup.button.callback('Нет', 'answer_1_btn_2')
        ]
      ]
    ))
  } catch (e) {
    console.error(e)
  }
})
/**
 * Функция для отправки сообщения ботом
 * @param {String} id_btn Идентификатор кнопки для обработки
 * @param {String} src_img Путь к изображению, или false чтобы отправить только текст
 * @param {String} text Текстовое сообщение для отправки
 * @param {Boolean} preview Блокировать превью у ссылок или нет, true - блокировать, false - нет
 */
function addActionBot(id_btn, src_img, text, preview) {
  bot.action(id_btn, async (ctx) => {
    try {
      await ctx.answerCbQuery()
      if (src_img !== false) {
        await ctx.replyWithPhoto({
          source: src_img
        })
      }
      await ctx.replyWithHTML(text, {
        disable_web_page_preview: preview
      })
    } catch (e) {
      console.error(e)
    }
  })
}

bot.action('answer_1_btn_1', async (ctx) => {
  try {
    await ctx.answerCbQuery()
    await ctx.replyWithHTML('<b>Ваша команда разработки состоит преимущественно из js разработчиков?</b>', Markup.inlineKeyboard([
      [Markup.button.callback('Да', 'answer_2_btn1')],
      [Markup.button.callback('Нет', 'answer_2_btn2')]
    ]))
  } catch (e) {
    console.error(e)
  }
})

// Обработчик кнопок с помощью функции
addActionBot('answer_2_btn1', './img/React-icon.svg.png', 'Лучшее решение - React native', true)
addActionBot('answer_2_btn2', './img/flutter.png', 'Лучшее решение - Flutter', true)
addActionBot('btn_3', false, my_const.text3, false)

// Запустить бота
bot.launch()

// Включить плавную остановку
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))