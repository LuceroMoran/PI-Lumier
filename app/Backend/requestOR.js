var builder = require('botbuilder');
var pdf = require('html-pdf');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports.getJSON = function (URL) {
  URL = URL.replace(/\n+/g, '');
  URL = URL.replace(/\s+/g, '');
  var x = new XMLHttpRequest();
  var objJSON = "";
  /*x.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200){
      var obj = eval ("(" + this.responseText + ")");
      var toParse = JSON.stringify(obj);
      objJSON = JSON.parse(toParse);
    }
  };
  x.open('GET', URL, false);
  x.setRequestHeader("Accept", "application/json");
  x.send();*/
  return objJSON;
};

module.exports.getPDF = function(html){
  pdf.create(html).toFile('../Files/sampleSum.pdf', function(err, res) {
    if (err) return console.log(err);
    console.log(res);
  });
};

module.exports.getHTML = function(objJSON){
  var html = `<body bgcolor=#ddd></br></br> \
  <table align=center width=90% border=0 style="color:#555; border-style:dotted; border-width:1px; font-family:Helvetica,Arial,sans-serif;font-size:10;"> \
    <tr > \
      <td align=center style="font-weight:bold;" width=90%>Order Deatails</td> \
    </tr> \
  </table> \
  </br> \
  </br> \
  <table border=0 width=90% align=center bgcolor=#497bae bordercolor=456f9a cellpadding=5 style="color:#fff; font-family:Helvetica,Arial,sans-serif; border-style:outset; border-width:2px;"> \
  <tr> \
    <td style="font-weight:bold;"> \
      Customer ID : ${objJSON.CustomerId}</br> \
      Location ID: ${objJSON.LocationId} \
    </td> \
  </tr> \
  </table> \
  </body> \
  <table border=0 bgcolor=#ccc align=center cellpadding=6 width=90% style="color:#fff; font-family:Helvetica,Arial,sans-serif; border-style:dashed; border-width:2px; font-size:15px">\
    <tr bgcolor=#eee style="color:#333;" >\
      <td valign=top align=left style="font-weight:bold;" width=13%>\
        Customer \
      </td> \
      <td valign=middle style="font-size:12px;" width=20%> \
         ID: ${objJSON.CustomerId} <br/> \
         Name: ${objJSON.Taker}<br/> \
         Email Address: ${objJSON.ShipToMailAddress}<br/> \
        ZipCode: ${objJSON.ZipCode}<br/> \
      </td> \
      <td align=left valign=top style="font-weight:bold;" width=13%> \
        Shipping \
      </td> \
      <td valign=middle style="font-size:12px; " width=20%> \
        Name: ${objJSON.ShipToName} <br/> \
        Address: ${objJSON.ShipToAddress1}<br/> \
       City: ${objJSON.ShipToCity}, ${objJSON.OeHdrShip2State}<br/> \
       Phone: ${objJSON.ShipToPhone}<br/> \
    </tr> \
    </table> \ `
    return html;
}

module.exports.createCard = function(session, objJSON){
  return new builder.HeroCard(session)
    .title('Order Details')
    .subtitle('Description')
    .text(``)
    .buttons([
        builder.CardAction.openUrl(session, 'C:\\Users\\Miguel Mtz\\Documents\\UANL\\7Sem\\PI\\PI-Lumier\\app\\Files\\sampleSum.pdf', 'Full Summary')
    ]);
}
