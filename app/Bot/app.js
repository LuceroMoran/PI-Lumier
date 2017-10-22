require('dotenv-extended').load({
    path: '../.env'
});

var builder = require('botbuilder');
var restify = require('restify');

var LuisActions = require('../../core');
var SampleActions = require('../all');
var LuisModelUrl = process.env.LUIS_MODEL_URL;
var DefaultReplyHandler = function (session) {
    session.endDialog(
        //email info template
        'Sorry, I did not understand "%s". Use sentences like  \n  "What is the price if the item *ID*, *LocationID*, *CustomerID*, *Token*?"  \n  or  \n  "I need a summary of the order *ID*, *Token*".',
        session.message.text);
};

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector);
var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intentDialog = bot.dialog('/', new builder.IntentDialog({ recognizers: [recognizer] })
    .onDefault(DefaultReplyHandler));

LuisActions.bindToBotDialog(bot, intentDialog, LuisModelUrl, SampleActions, DefaultReplyHandler, onContextCreationHandler);

function onContextCreationHandler(action, actionModel, next, session) {
    next();
}
