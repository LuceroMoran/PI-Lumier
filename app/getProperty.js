var builder = require('botbuilder');
var util = require('util');
var LuisActions = require('../core');
var IT = require('./Backend/requestIT');

var GetProperty = {
    intentName: 'GetProperty',
    friendlyName: 'Get Property',
    confirmOnContextSwitch: true,           // true by default
    // Property validation based on schema-inspector - https://github.com/Atinux/schema-inspector#v_properties
    schema: {
        Property: {
            message: 'Please tell me which property of the item you would like to check'
        },
        ID: {
            message: 'Please provide the item ID'
        },
        LocationID: {
            message: 'Please provide the location ID'
        },
        CustomerID: {
            message: 'Please provide your customer ID'
        },
        Token: {
            message: 'Please provide your API token'
        },
    },
    // Action fulfillment method, recieves parameters as keyed-object (parameters argument) and a callback function to invoke with the fulfillment result.
    fulfill: function (session, parameters, callback) {
      if(parameters.Token.startIndex){
        var token = session.message.text.slice(parameters.Token.startIndex,parameters.Token.endIndex+1);
      }else{
        var token = parameters.Token.entity;
      }
      var URL = `http://labserver.southcentralus.cloudapp.azure.com:3080/api/inventory/v2/parts/price/${parameters.ID.entity}?companyId=T&customerId=${parameters.CustomerID.entity}&salesLocId=${parameters.LocationID.entity}&sourceLocId=${parameters.LocationID.entity}&shipToId=${parameters.CustomerID.entity}&token=${token}`;
      var itemJSON = IT.getJSON(URL);
      var html = IT.getHTML(itemJSON);
      if(session.message.address.channelId == "email"){
        session.send({
          "channelData": {
            "htmlBody": html,
            "subject": `Item ${parameters.ID.entity} ${parameters.Property.entity}`,
            "importance": "normal"
          }
        });
      }else{
        IT.getPDF(html);
        var card = IT.createCard(session, itemJSON);
        var msg = new builder.Message(session).addAttachment(card);
        session.send(msg);
      }
        callback('If you need anything else, ask something like  \n  "What is the price if the item *ID*, *LocationID*, *CustomerID*, *Token*?"  \n  or  \n  "I need a summary of the order *ID*, *Token*".');
    }
};

// Contextual action that changes ID for the GetProperty Action
var GetProperty_ChangeID = {
    intentName: 'GetProperty_ChangeID',
    friendlyName: 'Change the item\'s ID',
    parentAction: GetProperty,
    canExecuteWithoutContext: true,         // true by default
    schema: {
        ID: {
            message: 'Please provide a new ID'
        }
    },
    fulfill: function (session, parameters, callback, parentContextParameters) {
        // assign new ID to GetProperty
        parentContextParameters.ID = parameters.ID;

        callback('item ID changed to ' + parameters.ID.entity);
    }
};

var GetProperty_ChangeProperty = {
    intentName: 'GetProperty_ChangeProperty',
    friendlyName: 'Change item\'s property',
    parentAction: GetProperty,
    canExecuteWithoutContext: true,         // true by default
    schema: {
        Property: {
            message: 'Please tell me which property of the item you would like to check'
        }
    },
    fulfill: function (session, parameters, callback, parentContextParameters) {
        // assign new ID to GetProperty
        parentContextParameters.Property = parameters.Property;

        callback('Search changed to ' + parameters.Property.entity);
    }
};

// Contextual action that LocationID for the GetProperty Action
var GetProperty_ChangeLocationID = {
    intentName: 'GetProperty_ChangeLocationID',
    friendlyName: 'Change the item\'s location ID',
    parentAction: GetProperty,
    canExecuteWithoutContext: true,         // true by default
    schema: {
        LocationID: {
            message: 'Please provide a new location ID'
        }
    },
    fulfill: function (session, parameters, callback, parentContextParameters) {
        parentContextParameters.LocationID = parameters.LocationID;

        callback('item\'s location ID changed to ' + parameters.LocationID.entity);
    }
};

// Contextual action that changes LocationID for the GetProperty Action
var GetProperty_ChangeCustomerID = {
    intentName: 'GetProperty_ChangeCustomerID',
    friendlyName: 'Change the item\'s customer ID',
    parentAction: GetProperty,
    canExecuteWithoutContext: true,         // true by default
    schema: {
        CustomerID: {
            message: 'Please provide a new customer ID'
        }
    },
    fulfill: function (parameters, callback, parentContextParameters) {
        parentContextParameters.CustomerID = parameters.CustomerID;

        callback('item customer ID changed to ' + parameters.CustomerID.entity);
    }
};

module.exports = [
    GetProperty,
    GetProperty_ChangeID,
    GetProperty_ChangeProperty,
    GetProperty_ChangeCustomerID,
    GetProperty_ChangeLocationID
];
