var builder = require('botbuilder');
var util = require('util');
var LuisActions = require('../core');
var OR = require('./Backend/requestOR');

var SummaryAction = {
    intentName: 'SummaryAction',
    friendlyName: 'Get Summary',
    confirmOnContextSwitch: true,           // true by default
    // Property validation based on schema-inspector - https://github.com/Atinux/schema-inspector#v_properties
    schema: {
        ID: {
            message: 'Please provide the order ID'
        },
        Token: {
            message: 'Please provide your API token',
            optional: true
        },
    },
    // Action fulfillment method, recieves parameters as keyed-object (parameters argument) and a callback function to invoke with the fulfillment result.
    fulfill: function (session, parameters, callback) {
      /*if(parameters.Token.startIndex){
        var token = session.message.text.slice(parameters.Token.startIndex,parameters.Token.endIndex+1);
      }else{
        var token = parameters.Token.entity;
      }*/
      //var URL = `http://labserver.southcentralus.cloudapp.azure.com:3080/api/sales/orders/${parameters.ID.entity}?extendedProperties=Lines&token=${token}`;
      var URL = "";
      var orderJSON = OR.getJSON(URL);
      //var html = OR.getHTML(orderJSON);
      if(session.message.address.channelId == "email"){
        session.send({
          "channelData": {
            "htmlBody": html,
            "subject": `Order ${property.ID.entity} summary`,
            "importance": "normal"
          }
        });
      }else{
        //OR.getPDF(html);
        var card = OR.createCard(session, orderJSON);
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
      }
        callback('If you need anything else, ask something like  \n  "What is the price if the item *ID*, *LocationID*, *CustomerID*, *Token*?"  \n  or  \n  "I need a summary of the order *ID*, *Token*".');
    }
};

// Contextual action that changes ID for the Summary Action
var SummaryAction_ChangeID = {
    intentName: 'SummaryAction_ChangeID',
    friendlyName: 'Change the Order ID',
    parentAction: SummaryAction,
    canExecuteWithoutContext: true,         // true by default
    schema: {
        ID: {
            message: 'Please provide a new ID'
        }
    },
    fulfill: function (session, parameters, callback, parentContextParameters) {
        // assign new ID to SummaryAction
        parentContextParameters.ID = parameters.ID;

        callback('Order ID changed to ' + parameters.ID.entity);
    }
};

module.exports = [
    SummaryAction,
    SummaryAction_ChangeID
];
