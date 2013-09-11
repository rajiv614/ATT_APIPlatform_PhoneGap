if (typeof cordova !== "undefined") {
	var att = {};

	
	att.speechToText = function(json, cb, ecb) {
		var args=[{"filePath": json.filePath ,
					"token":json.token,
					"url" : json.host,
					"accept" : json.headerAccept,
					"contentLength" : json.headerContentLength === undefined ? "" : json.headerContentLength,
					"XSpeechContext" : json.headerXSpeechContent === undefined ? "Generic" : json.headerXSpeechContent,
					"transferEncoding" : json.headerTransferEncoding === undefined ? "" : json.headerTransferEncoding,
					"contentType" : json.headerContentType
			 }];
		
		return cordova.exec(cb, ((ecb === undefined) ? att.failureCallback : ecb),
				"AttPlugin", "speechToText", args);
	};
	
	
	
	
	
	att.sendMMS = function(json, cb, ecb) {
		
		var args=[{"body": json.body ,
				   "accessToken":json.token,
				   "url" : json.host,
				   "accept" : json.headerAccept,
				   "attachments" : json.attachments,
				   "contentType" : json.headerContentType
				 }];
		alert(JSON.stringify(args));
		return cordova.exec(cb, ((ecb === undefined) ? att.failureCallback : ecb),
				"AttPlugin", "sendMMS", args);
	};
	
	
	
	
	
	att.sendMessage = function(json, cb, ecb) {
		
		var args=[{"body": json.body ,
			   "accessToken":json.token,
			   "url" : json.host,
			   "accept" : json.headerAccept,
			   "attachments" : json.attachments,
			   "contentType" : json.headerContentType
			 }];
		return cordova.exec(cb, ((ecb === undefined) ? att.failureCallback : ecb),
				"AttPlugin", "sendMessage", args);
	};
	
	
	
	
	att.sendWAPPush = function(json, cb, ecb) {
		
		var args=[{"body": json.body ,
			   "accessToken":json.token,
			   "url" : json.host,
			   "accept" : json.headerAccept,
			   "data" : json.data,
			   "contentType" : json.headerContentType
			 }];
		return cordova.exec(cb, ((ecb === undefined) ? att.failureCallback : ecb),
				"AttPlugin", "sendWAPPush", args);
	};
	
	att.failureCallback = function (err) {
		console.log("Error: " + JSON.stringify(err));
		alert("Error: " + JSON.stringify(err));
	};
}