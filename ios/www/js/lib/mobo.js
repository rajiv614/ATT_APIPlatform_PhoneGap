/**
 * @author GlobalLogic
 */

/*
 * Sample App using ATT Module exposing the ATT APIs to PhoneGap Mobile.
 */
/*
 * Variables used - phonegap -variable to require att.js module
 */

var phonegap;

// Note: Application Developer should get access key,secret key and shortcode by
// registering on www.developer.att.com website
// and creating sample Application.
var accessKey =  window.localStorage.getItem("accessKey"); 
var secretKey =  window.localStorage.getItem("secretKey");
var scope = window.localStorage.getItem("scopeForOauthToken");
var redirect_url = window.localStorage.getItem("redirect_url");
var headerCount = '500';
var partNumber = '1';
/*
 * authorize @param client_id -access key_id received when application is
 * registered - Mandatory @param scope -scope for which authorization token
 * needs to be generated - Mandatory
 */

function authorize(callback) {
	phonegap.ATT.OAuth.obtainEndUserAuthorization({
		'clientId' : accessKey,
		'scope' : scope
	}, function(data) {
		var url = "https://auth-api.att.com/user/login?client_id=" + accessKey + "&scope=" + scope + "&redirect_url=" + redirect_url;
		document.getElementById("authFrame").src = url;
		$("#oauthcontainer").show();
		$("#authFrame").load(function() {
			var url = this.contentDocument.location.href;
			var vars = [], hash;
			var hashes = url.slice(url.indexOf('?') + 1).split('&');
			for (var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			//Cancel Click Handle
			if(url.indexOf('error_reason')!=-1)
			{
				$("#oauthcontainer").hide();
				return;
			}

			if (vars['code'] != undefined) {
				window.localStorage.oauthCode = JSON.stringify(vars['code']);
				var code = JSON.parse(window.localStorage.oauthCode);
				grantType = 'authorization_code';
				phonegap.ATT.authorize(accessKey, secretKey, scope, grantType, code);

				$("#oauthcontainer").hide();
				callback();
			}
		});
	}, function(error) {
		console.log('Error in authorizing : ' + error);
	});

};

/*
 * CALLING ATT Module functions
 */

var ATT = {

	/*
	 * Single Number MOBO @param body- Will contain three values
	 * Addresses,Subject and Text @param contentType- format in which data is to
	 * be sent Example: contentType @ application/json "body":{"Addresses"
	 * :["tel:XXXXXXXXXX"], "Subject" : "Test MOBO JSON", "Text" : "TEST" },
	 * contentType @ application/xml "body":"<MessageRequest><Addresses>' +
	 * number + ',' + email_id + '</Addresses><Text>' + text +'</Text><Subject>' +
	 * 'test' + '</Subject></MessageRequest>", contentType @
	 * application/x-www-form-urlencoded
	 * "body":"Addresses=tel%3A%2BXXXXXXXXXX&Text=TEST& Subject=TestMOBOURL",
	 * @param attachments -attachments - Mandatory Developer can pass either
	 * filepath or fileObject(base64 urlencoded string) Note : There are two
	 * options for sending any image/audio as part of MMS. Developer can either
	 * pass path of a file in "filepath" or Base64 encoded url string in
	 * "fileObject"
	 */

	MOBOSendMessage : function(number, text, subject, cbData, imageobject) {
		var fileArray = [];
		var fileName;
		var image;
		for ( i = 0; i < imageobject.length; i++) {
			image = imageobject[i];
			fileName = new Date().getTime() + i + "image.jpeg";
			firstFile = {
				'fileName' : fileName,
				'fileType' : "image/jpeg",
				'fileObject' : image
			};
			fileArray.push(firstFile);

		}

		var sendMoboMessage = function() {
			phonegap.ATT.MOBO.sendMessage({
				'accept' : 'application/json',
				'contentType' : 'application/json',
				'body' : {
					"Addresses" : number,
					"Text" : text,
					"Subject" : subject
				},
				'attachments' : fileArray
			}, function(data) {
				cbData(data);
                console.log('MOBO SendMessage Response : ' + data);
			}, function(error) {
				console.log('MOBO SendMessage Error : ' + error);
				cbData(JSON.stringify(error));
			});
		};
		authorize(sendMoboMessage);

	},

	/*
	 * MOBO GET MESSAGE HEADERS @param HeaderCount - Valid Range: Min = 1, Max =
	 * 500 -Mandatory @param IndexCursor - optional- Define an index value for
	 * which HeaderCount will start.
	 */

	MOBOGetMessageHeaders : function(cbData) {
		var getMessageHeaders = function() {
			phonegap.ATT.MOBO.getMessageHeaders({
				'headerCount' : headerCount
			}, function(data) {
				window.localStorage.messageId = JSON.parse(data).MessageHeadersList.Headers[0].MessageId;
				window.localStorage.contentType = JSON.parse(data).MessageHeadersList.Headers[0].MmsContent && JSON.parse(data).MessageHeadersList.Headers[0].MmsContent[1].ContentType;
				console.log('MOBO GetMessageHeaders Successfully Called : : ' + data);
				cbData(data);

			}, function(error) {
				console.log('MOBO GetMessageHeaders Error : ' + error);
				cbData(JSON.stringify(error));
			});
		};
		authorize(getMessageHeaders);
	},

	/*
	 * MOBO GET MESSAGE CONTENT @param MessageId - MessageId received in
	 * response of get message header - Mandatory
	 */

	MOBOGetMessageContent : function(cbData) {
		var getMessageContent = function() {
			phonegap.ATT.MOBO.getMessageContent({
				'messageId' : window.localStorage.messageId,
				'partNumber' : partNumber
			}, function(data) {
				console.log('MOBO GetMessageContent Successfully Called : ' + data);
				var response = 'RESPONSE Is: ' + 'Length:' + data.length + ' Mime Type:' + window.localStorage.contentType;
				cbData(response);
			}, function(error) {
				console.log('MOBO GetMessageContent Error : ' + error);
				cbData(JSON.stringify(error));
			});
		};
		authorize(getMessageContent);
	}
};

define(["require", "exports", "module", "att"], function(require, exports, module) {

	/*
	 * require att.js in 'phonegap' variable
	 */

	phonegap = require('att');

});
