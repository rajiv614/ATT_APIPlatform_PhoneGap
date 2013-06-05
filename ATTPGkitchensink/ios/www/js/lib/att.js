/**
 * @author Globallogic
 */

define(["require", "exports", "module"], function(require, exports, module) {'use strict';
	/*
	* ATT Module A framework for exposing the ATT APIs to PhoneGap
	* Mobile.
	*
	* This framework is designed for APIs provided by ATT. Each service
	* is represented as a NameSpace, within which each operation is
	* exposed.
	*
	* This framework requires you to refer to the ATT API reference for
	* handling request, and responses received from the service. i.e.
	* refer to : https://devconnect-api.att.com/docs/
	*/

	// *********************************************************network
	// createHttpObject() START*****************************
	var httpRequest = {
		createHttpObject : function(object, cbOnData, cbOnError) {
			console.log('jQuery Request Object :' + JSON.stringify(object));
			object["success"] = function(response) {
				if (object.headers.Accept === 'application/xml') {
					var xmlResponse = new XMLSerializer().serializeToString(response);
					console.log('XML response :' + xmlResponse);
					cbOnData(xmlResponse);
				} else if (object.headers.Accept === 'application/json') {
					var jsonResponse = JSON.stringify(response);
					console.log('JSON response :' + jsonResponse);
					cbOnData(jsonResponse);
				} else if ((object.headers.Accept === 'audio/wav') 
						|| (object.headers.Accept === 'audio/amr') 
						|| (object.headers.Accept === 'audio/x-wav')) {
					
					console.log('Response :' + response);
					var jsonResponse = JSON.stringify(response);
					console.log('JSON response :' + jsonResponse);
					cbOnData(response);
				} else if (object.headers.Accept === undefined) {
					var jsonResponse = JSON.stringify(response);
					console.log('JSON response :' + jsonResponse);
					cbOnData(jsonResponse);
				}
			};
			object["error"] = function(xhr, status, errThrown) {
				var out = "<br>Error status " + status;
				out += "<br>Error request status text: " + xhr.statusText;
				out += "<br>Error request status: " + xhr.status;
				out += "<br>Error request response text: " + xhr.responseText;
				out += "<br>Error response header: " + xhr.getAllResponseHeaders();
				console.log('Error in http request :' + out);
				cbOnError(out);

			};
			object["timeout"] = 90000;
			/**
			 * jQuery Ajax Network Call
			 */
			$.ajax(object);
		}
	};

	// *********************************************************network
	// createHttpObject() END******************

	// *********************************************************atthelper
	// prepareExecutor() START*****************************
	var attHelper = {
		prepareExecutor : function(thisRef) {
			if (thisRef.preparer && !thisRef.prepared) {
				thisRef.preparer();
				thisRef.prepared = true;
			}
		}
	};
	// *********************************************************atthelper
	// prepareExecutor() END******************

	// *********************************************************bedframe
	// build() START*****************************************
	var bedFrame = {};

	var BedFrame = {};
	/**
	 * Default property type that results in only the latest specified
	 * value being used (that is, the deepest child's value will be used
	 * over any of its parents). Particularly useful for specifying
	 * default values that most children use, and then overriding those
	 * default values on exceptional children.
	 */
	BedFrame.PROPERTY_TYPE_ONLY_LATEST = 0;
	/**
	 * Property type that results in child values equating to their
	 * parent value plus their own, separated by a forward slash.
	 * Particularly useful for creating a URL hierarchy.
	 */
	BedFrame.PROPERTY_TYPE_SLASH_COMBINE = 1;
	/**
	 * Property type that results in a parent value not propogating to
	 * its children.
	 */
	BedFrame.PROPERTY_TYPE_IGNORE = 2;

	/**
	 * Recursively builds a full API on the target object, as defined in
	 * the api object. Properties will be added to the target object,
	 * but the object reference itself will not be altered. This means
	 * you can safely "build" on a CommonJS exports object.
	 *
	 * @param target
	 *            The object that the API will be created in.
	 * @param api
	 *            The specifications for the API you want to expose
	 *            through objects. Read "THE API OBJECT" in readme.md to
	 *            find out more.
	 */

	bedFrame.build = function bedFrameTransformObject(target, api) {
		// Save a reference to the children property of the current
		// segment of the API.
		var children = api.children || [], c;

		// Iterate over every child to set up its API.
		for (c in children) {
			// Avoid prototyped members.
			if (!children.hasOwnProperty(c)) {
				continue;
			}
			// Create a shorter reference to the present child.
			var child = children[c];
			// Determine the present property types, or default to an
			// empty object.
			// (We will pass this variable down in the next step;
			// propertyTypes is itself by default typed ONLY_LATEST).
			var propertyTypes = child.propertyTypes || api.propertyTypes || {};
			// Don't pass down children (that causes an infinite
			// recursion).
			propertyTypes.children = BedFrame.PROPERTY_TYPE_IGNORE;

			// Iterate over every member of the current segment of the
			// API.
			for (var o in api) {
				// Avoid prototyped members and children.
				if (!api.hasOwnProperty(o)) {
					continue;
				}
				// Based on the property type specified for this API,
				// cascade property down from parent to child.
				switch (propertyTypes[o]
				|| BedFrame.PROPERTY_TYPE_ONLY_LATEST) {
					case BedFrame.PROPERTY_TYPE_ONLY_LATEST:
						// ONLY_LATEST results in child taking precedence
						// over the parent, completely replacing the value.
						child[o] = child[o] === undefined ? api[o] : child[o];
						break;
					case BedFrame.PROPERTY_TYPE_SLASH_COMBINE:
						// SLASH_COMBINE results in the child ending up with
						// a slash-separated-value from the top most
						// parent to the present child, where elements
						// without a value are ignored (there won't be any
						// double slashes in the computed value).
						var parts = [];
						if (api[o]) {
							parts.push(api[o]);
						}
						if (child[o]) {
							parts.push(child[o]);
						}
						child[o] = parts.join('/');
						break;
				}
			}

			// If the current child specifies the method property, and
			// does not have any children, it's an endpoint and
			// needs to be set up as a method. Inject it in to the
			// target.
			if (child.method && !child.children) {
				target[child.method] = (function(child) {
					return function() {
						// Executors are designed to work based off of
						// their context. Act upon the child, which is a
						// mixed
						// down result of its parent, and its parent's
						// parent, and so on.
						return child.executor.apply(child, arguments);
					};
				})(child);
			}
			// Otherwise, inject the new property in to the target, and
			// recurse upon the sub-segment of the API.
			else if (child.property) {
				bedFrameTransformObject(target[child.property] = {}, child);
			}
		}
	};

	bedFrame.BedFrame = BedFrame;
	// *********************************************************bedframe
	// build() END******************

	// Namespace used for API methods
	var ATT = {};
	
	(function() { //used to keep varibles private
		var protocol = 'https://';
		var domain = 'api.att.com';
		var origin = protocol + domain;
		
		// Constants key-value for setting Default Values and URL's
		ATT.Constants = {
			CONTENT_TYPE_JSON : 'application/json',
			ACCEPT_TYPE_JSON : 'application/json',
			CONTENT_TYPE_URL_ENCODED : 'application/x-www-form-urlencoded',
			ENDPOINT_ACCESS_TOKEN : origin + '/oauth/access_token',
			ENDPOINT_SMS : origin + '/sms/v3/messaging',
			ENDPOINT_STT : origin + '/speech/v3/speechToText',
			ENDPOINT_NOTARY : origin + '/Security/Notary/Rest/1/SignedPayload',
			ENDPOINT_ADS: origin + '/rest/1/ads?',
			ENDPOINT_MMS : origin + '/mms/v3/messaging',
			ENDPOINT_OAUTH : origin + '/oauth',
			ENDPOINT_LOCATION : origin + '/2/devices/location',
			ENDPOINT_DEVICECAPABILITIES : origin + '/1/devices/',
			ENDPOINT_IMMN : origin + '/rest/1/MyMessages',
			ENDPOINT_ROOT_PAYMENT : origin,
			ENDPOINT_PAYMENT_NEWTRANSACTION : '/rest/3/Commerce/Payment/Transactions',
			ENDPOINT_PAYMENT_TRANSACTIONSTATUS : '/rest/3/Commerce/Payment/Transactions/',
			ENDPOINT_PAYMENT_NEWSUBSCRIPTIONS : '/rest/3/Commerce/Payment/Subscriptions',
			ENDPOINT_PAYMENT_SUBSCRIPTIONSTATUS : '/rest/3/Commerce/Payment/Subscriptions/',
			ENDPOINT_PAYMENT_REFUNDTRANSACTION : '/rest/3/Commerce/Payment/Transactions',
			ENDPOINT_PAYMENT_GETSUBSCRIPTIONDETAILS : '/rest/3/Commerce/Payment/Subscriptions/',
			ENDPOINT_PAYMENT_GETNOTIFICATION : '/rest/3/Commerce/Payment/Notifications/',
			ENDPOINT_PAYMENT_ACKNOWLEDGENOTIFICATION : '/rest/3/Commerce/Payment//Notifications/',
			ENDPOINT_CALLMGMT : origin + '/rest/1/Sessions',
			ENDPOINT_TTS : origin + '/speech/v3/textToSpeech'
	
		};
	})();

	// Session variables used across all methods
	var sessionOBJ = {
		attHelper : attHelper, // provide attHelper object
		bedFrame : bedFrame, // provide bedframe object for generic
		// method implementation format used
		// here.
		accessKeyId : null, // To be initialized via the authorize
		// method
		secretKey : null, // To be initialized via the authorize
		// method
		accessToken : null, // To be initialized via the
		// generateAccessToken method
		scope : null, // To be initalized via the authorize method
		oauthCode : null, // To be initialized via the
		// generateAccessToken method, Required only
		// if grantType = 'authorization_code'.
		grantType : null, // To be initialized via the
		// generateAccessToken method, value
		// 'client_credentials'.
		isOAuth_Code : false, // To be initialized via executors which
		// invoke call for OAUTH Token
		oauthToken : null, // To be initialized via the
		// generateAccessToken method,if grantType =
		// 'authorization_code'.
		refreshToken : null

	};

	/*
	 * method to generate Access Token This method generate Token based
	 * on the value of grantType. It is used to generate Access Token if
	 * grantType = 'client_credentials'. It is used to generate Oauth
	 * Token if grantType = 'authorization_code'.
	 */

	var generateAccessToken = function(callBackToken) {
		var cbOnData = function(response) {
			var token = JSON.parse(response);
            console.log('Token generated: ' + response);
			if (sessionOBJ.isOAuth_Code === true) {
				sessionOBJ.isOAuth_Code = false;
				callBackToken(token.access_token);
			} else if (sessionOBJ.grantType === 'client_credentials') {
				window.localStorage.refreshToken = token.refresh_token;
				window.localStorage.access_token = token.access_token;
				callBackToken(window.localStorage.access_token);
			} else if (sessionOBJ.grantType === 'refresh_token') {
				window.localStorage.refreshToken = token.refresh_token;
				window.localStorage.access_token = token.access_token;
				callBackToken(window.localStorage.access_token);
			}

		};
		var cbOnError = function(error) {
			alert('error in generating token: ' + error);
			console.log('error in generating token: ' + error);
		};
		var body = null;
		var sUrl = ATT.Constants.ENDPOINT_ACCESS_TOKEN;

		if ((sessionOBJ.isOAuth_Code) && (sessionOBJ.grantType === 'authorization_code') && (sessionOBJ.oauthCode !== null)) {
			body = 'client_id=' + sessionOBJ.accessKeyId + '&client_secret=' + sessionOBJ.secretKey + '&grant_type=' + sessionOBJ.grantType + '&code=' + sessionOBJ.oauthCode;
		} else {
			if (sessionOBJ.grantType === 'client_credentials') {
				body = 'client_id=' + sessionOBJ.accessKeyId + '&client_secret=' + sessionOBJ.secretKey + '&grant_type=' + sessionOBJ.grantType + '&scope=' + sessionOBJ.scope;
			}
			if (sessionOBJ.grantType === 'refresh_token') {
				body = 'client_id=' + sessionOBJ.accessKeyId + '&client_secret=' + sessionOBJ.secretKey + '&grant_type=' + sessionOBJ.grantType + '&refresh_token=' + window.localStorage.refreshToken;
			}

		}
		var jquery_object = {
			url : sUrl,
			type : 'POST',
			async : true,
			data : body,
			headers : {
				Accept : ATT.Constants.ACCEPT_TYPE_JSON
			},
			crossDomain : true,
			beforeSend : function(xhr) {
				xhr.setRequestHeader('Content-Type', ATT.Constants.CONTENT_TYPE_URL_ENCODED);

			}
		};
		httpRequest.createHttpObject(jquery_object, cbOnData, cbOnError);

	};

	/*
	 * method to check Access Token .Once Access Token generated, saves
	 * in window.localStorage.access_token.If Access Token is not
	 * generated once, call generateAccessToken method,else use the
	 * existing Access Token.
	 */

	var checkAccessToken = function(callBackFunction) {
		if (window.localStorage.access_token) {
			callBackFunction(window.localStorage.access_token);
		} else {
			generateAccessToken(callBackFunction);
		}
	};

	/*
	 * Uses the ATT API to invoke an Action specified by the method,
	 * along with the parameters, returns the response returned by the
	 * Service, and raises an Error callback in case of a failure.
	 * @param params - Parameters to be sent @param cbOnData - CallBack
	 * to be invoked for Response @param cbOnError - Callback to be
	 * invoked for Error
	 */

	/*
	 * Executor for SMS api
	 */

	var SMSExecutor = function(params, cbOnData, cbOnError) {
		sessionOBJ.attHelper.prepareExecutor(this);
		var self = this;
		
		
		
		var smsRequest = function(accessToken) {
			var jquery_object = {
				type : self.verb,
				async : true,
				headers : {
					Accept : params.accept
				},
				crossDomain : true,
				beforeSend : function(xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer' + ' ' + accessToken);

					if (params.contentType !== undefined) {
						xhr.setRequestHeader('Content-Type', params.contentType);
					}
					if (params.accept !== undefined) {
						xhr.setRequestHeader('Accept', params.accept);
					}
				}
			};

			if (self.method.toLowerCase() === 'sendsms') {
				if (params.contentType.toLowerCase() === ATT.Constants.CONTENT_TYPE_JSON) {
					jquery_object.data = "{\"outboundSMSRequest\":" + JSON.stringify(params.body) + "}";
				} else {
					jquery_object.data = params.body;
				}
			}
			if (params.smsId !== undefined) {
				jquery_object.url = self.endPoint + self.appendUrl + params.smsId;
			} else if (params.registrationId !== undefined) {
				var getSMSEndPoint = (self.endPoint + self.appendUrl) + params.registrationId;
				jquery_object.url = getSMSEndPoint;
			} else {
				jquery_object.url = self.endPoint + self.appendUrl;
			}

			httpRequest.createHttpObject(jquery_object, cbOnData, cbOnError);
		};
		/*
		 * CALLING function to check Access Token If already Generated
		 * then direct call API else generate AccessToken
		 */
		checkAccessToken(smsRequest);

	};

	/*
	 * Executor for NOTARY api
	 */

	var NOTARYExecutor = function(params, cbOnData, cbOnError) {
		sessionOBJ.attHelper.prepareExecutor(this);
		var self = this, notaryRequest;
		notaryRequest = function(accessToken) {
			if (params.data.MerchantPaymentRedirectUrl !== undefined) {
				params.data.MerchantPaymentRedirectUrl = params.data.MerchantPaymentRedirectUrl + "?token=" + window.localStorage.access_token;
			}
			var jquery_object = {
				type : self.verb,
				async : true,
				url : self.endPoint,
				headers : {
					Accept : params.accept
				},
				data : JSON.stringify(params.data),
				crossDomain : true,
				beforeSend : function(xhr) {
					xhr.setRequestHeader('Client_id', params.clientId);
					if (params.contentLength) {
						xhr.setRequestHeader('Content-Length', params.contentLength);
					}
					xhr.setRequestHeader('Client_secret', params.clientSecret);
					if (params.contentType !== undefined) {

						xhr.setRequestHeader('Content-Type', params.contentType);
					}
					if (params.accept !== undefined) {
						xhr.setRequestHeader('Accept', params.accept);
					}

				}
			};

			httpRequest.createHttpObject(jquery_object, cbOnData, cbOnError);
		};
		/*
		 * CALLING function to check Access Token If already Generated
		 * then direct call API else generate AccessToken
		 */
		checkAccessToken(notaryRequest);

	};

	/*
	 * Executor for SPEECHTOTEXT api
	 */
	var STTExecutor = function(params, cbOnData, cbOnError) {
		sessionOBJ.attHelper.prepareExecutor(this);
		var self = this, ContentType, accept, sttRequest;
		sttRequest = function(accessToken) {

			var token = 'Bearer' + ' ' + accessToken;
			if (params.accept !== undefined) {
				accept = params.accept;
			}

			if (params.contentType !== undefined) {
				ContentType = params.contentType;
			}

			var args = [{
				filePath : params.filePath,
				token : token,
				accept : accept,
				contentType : ContentType,
				contentLanguage : ((params.contentLanguage === undefined) ? "" : params.contentLanguage),
				contentLength : ((params.contentLength === undefined) ? "" : params.contentLength),
				XSpeechContext : ((params.xSpeechContext === undefined) ? "Generic" : params.xSpeechContext),
				transferEncoding : ((params.transferEncoding === undefined) ? "" : params.transferEncoding),
				xarg : ((params.xarg === undefined) ? "" : params.xarg),
				url : self.endPoint
			}];
			return cordova.exec(cbOnData, cbOnError, "AttPlugin", "speechToText", args);
		};
		/*
		 * CALLING function to check Access Token If already Generated
		 * then direct call API else generate AccessToken
		 */
		checkAccessToken(sttRequest);

	};
	
	/*
	 * Executor for TextToSpeech api
	 */
	var TTSExecutor = function(params, cbOnData, cbOnError) {
	    sessionOBJ.attHelper.prepareExecutor(this);
	    var self, args;
	    self = this;
	    //var accessToken = 'e3a8e54ed675bb863b605aea926354dd';
	    var ttsRequest = function(accessToken) {
	     
	    	var token = 'Bearer' + ' ' + accessToken;
	    	args = [ {
				url : self.endPoint,
				token : token,
				body : params.body ? params.body : '',
				data : params.data,
				contentType : params.contentType ? params.contentType
						: '',
				accept : params.accept ? params.accept 
						: '',
				xarg : params.xarg,
				filePath : params.filePath

			} ];
	    	
	    	return Cordova.exec(cbOnData, cbOnError, "AttPlugin",
					"textToSpeech", args);
	    };
	    /*
	     * CALLING function to check Access Token If already Generated
	     * then direct call API else generate AccessToken
	     */
	    checkAccessToken(ttsRequest);

	   };

	/*
	 * Executor for OAUTH api
	 */

	var OAUTHExecutor = function(params, cbOnData, cbOnError) {
		sessionOBJ.attHelper.prepareExecutor(this);
		var self = this;
		var jquery_object = {
			type : self.verb,
			async : true,
			headers : {
				Accept : params.accept
			},
			crossDomain : true
		};
		if ((params.clientId !== undefined) && (params.scope !== undefined)) {
			if (params.redirectUrl !== undefined) {
				jquery_object.url = self.endPoint + self.appendUrl + '?' + 'client_id=' + params.clientId + '&' + 'scope=' + params.scope + '&' + 'redirect_url=' + params.redirectUrl;
			} else {
				jquery_object.url = self.endPoint + self.appendUrl + '?' + 'client_id=' + params.clientId + '&' + 'scope=' + params.scope;
			}
		} else {
			jquery_object.url = self.endPoint + self.appendUrl;
		}
		httpRequest.createHttpObject(jquery_object, cbOnData, cbOnError);
	};

	/*
	 * Executor for LOCATION api
	 */

	var LOCATIONExecutor = function(params, cbOnData, cbOnError) {
		sessionOBJ.attHelper.prepareExecutor(this);
		var self = this, locationRequest, body = '';
		locationRequest = function(accessToken) {
			if ((params.requestedAccuracy !== undefined) || (params.tolerance !== undefined) || (params.acceptableAccuracy !== undefined)) {
				for (var keys in params) {
					if ((params.hasOwnProperty(keys)) && (keys !== 'Accept')) {
						body = body + '&' + keys + '=' + params[keys];

					}

				}
				body = body.substr(1, body.length);

			}

			var jquery_object = {
				type : self.verb,
				async : true,
				headers : {
					Accept : params.accept
				},
				url : self.endPoint + '?' + body,
				crossDomain : true,
				beforeSend : function(xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer' + ' ' + accessToken);
					if (params.accept !== undefined) {
						xhr.setRequestHeader('Accept', params.accept);
					}
				}
			};
			httpRequest.createHttpObject(jquery_object, cbOnData, cbOnError);

		};

		/*
		 * set sessionOBJ.isOAuth_Code = true to indicate generation of
		 * oauth token.
		 * CALLING function generate AccessToken
		 */

		sessionOBJ.isOAuth_Code = true;
		generateAccessToken(locationRequest);

	};
	
	/**
	 * Executor for ADS api.
	 * This ADS api call uses native module.
	 */

	var ADSExecutor = function(params, cbOnData, cbOnError) {"use strict";
		sessionOBJ.attHelper.prepareExecutor(this);
		var self = this, adsRequest;
		adsRequest = function(accessToken) {
			
			var queryString = (typeof params.body === 'string') ? params.body : $.param(params.body);
			
			var jquery_object = {
				type : self.verb,
				url: self.endPoint + queryString,
				async : true,
				crossDomain : true,
				headers: {
					'Accept': params.accept,
					'Authorization': 'Bearer' + ' ' + accessToken,
					'Udid': params.udid
				}
			};
			
			httpRequest.createHttpObject(jquery_object, cbOnData,
					cbOnError);
		};
		/**
		 * CALLING function to check Access Token
		 * If already Generated then direct call API else generate AccessToken
		 */
		
		checkAccessToken(adsRequest);
	};

	/*
	 * Executor for MMS api
	 */
	var MMSExecutor = function(params, cbOnData, cbOnError) {
		sessionOBJ.attHelper.prepareExecutor(this);
		var self = this, mmsRequest;
		mmsRequest = function(accessToken) {
			if (self.method.toLowerCase() === 'getmmsdeliverystatus') {
				var jquery_object = {
					type : self.verb,
					async : true,
					headers : {
						Accept : params.accept
					},
					url : self.endPoint + self.appendUrl + '/' + params.id,
					crossDomain : true,
					beforeSend : function(xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer' + ' ' + accessToken);

					}
				};

				httpRequest.createHttpObject(jquery_object, cbOnData, cbOnError);

			} else {
				var token = 'Bearer' + ' ' + accessToken;
				var data;
				if (params.contentType.toLowerCase() === ATT.Constants.CONTENT_TYPE_JSON) {
					data = "{\"outboundMessageRequest\":" + JSON.stringify(params.body) + "}";
				}else {
					data = params.body;
				}
				var types = [{
					body : (params.body !== undefined) ? data : '',
					accessToken : token,
					url : self.endPoint + self.appendUrl,
					accept : (params.accept !== undefined) ? params.accept : '',
					attachments : (params.attachments && params.attachments.length > 0) ? params.attachments : [{}],
					contentType : (params.contentType !== undefined) ? params.contentType : ''
				}]
				return Cordova.exec(cbOnData, cbOnError, "AttPlugin", "sendMMS", types);

			}

		};
		/*
		 * CALLING function to check Access Token If already Generated
		 * then direct call API else generate AccessToken
		 */
		checkAccessToken(mmsRequest);

	};

	/*
	 * Executor for Payment api
	 */

	var PaymentExecutor = function(params, cbOnData, cbOnError) {
		var self = this, refundTransaction, getStatus;
		sessionOBJ.attHelper.prepareExecutor(this);
		if (self.method.toLowerCase() === 'newtransaction' || self.method.toLowerCase() === 'newsubscription') {
			cbOnData(this.endPoint + this.appendUrl + '?Signature=' + params.signature + "&SignedPaymentDetail=" + params.signedDocument + "&clientid=" + params.clientId);
		} else if (self.method.toLowerCase() === 'refundtransaction') {

			refundTransaction = function(accessToken) {
				var jquery_object = {
					type : self.verb,
					async : true,
					headers : {
						Accept : params.accept
					},
					url : self.endPoint + self.appendUrl + '/' + params.transactionId + '?Action=' + params.action,
					crossDomain : true,
					beforeSend : function(xhr) {

						xhr.setRequestHeader('Authorization', ('Bearer' + ' ' + accessToken));
						if (params.contentType !== undefined) {
							xhr.setRequestHeader('Content-Type', params.contentType);
						}
						if (params.accept !== undefined) {
							xhr.setRequestHeader('Accept', params.accept);
						}
					}
				};
				if (params.contentType === ATT.Constants.CONTENT_TYPE_JSON) {
					jquery_object.data = JSON.stringify(params.body);
				} else {
					jquery_object.data = params.body;
				}

				httpRequest.createHttpObject(jquery_object, cbOnData, cbOnError);

			};

			checkAccessToken(refundTransaction);

		} else {
			getStatus = function(accessToken) {
				var jquery_object = {
					type : self.verb,
					async : true,
					headers : {
						Accept : params.accept
					},
					crossDomain : true,
					beforeSend : function(xhr) {
						xhr.setRequestHeader('Authorization', 'Bearer' + ' ' + accessToken);
						if (params.accept !== undefined) {
							xhr.setRequestHeader('Accept', params.accept);
						}
					}
				};

				if (self.method.toLowerCase() === 'getsubscriptionstatus') {
					if (params.subscriptionId) {
						jquery_object.url = self.endPoint + self.appendUrl + 'SubscriptionId/' + params.subscriptionId;
					} else if (params.merchantTransactionId) {
						jquery_object.url = self.endPoint + self.appendUrl + 'MerchantTransactionId/' + params.merchantTransactionId;
					} else if (params.subscriptionAuthCode) {
						jquery_object.url = self.endPoint + self.appendUrl + 'SubscriptionAuthCode/' + params.subscriptionAuthCode;
					}
				} else if (self.method.toLowerCase() === 'gettransactionstatus') {
					if (params.transactionId) {
						jquery_object.url = self.endPoint + self.appendUrl + 'TransactionId/' + params.transactionID;
					} else if (params.merchantTransactionId) {
						jquery_object.url = self.endPoint + self.appendUrl + 'MerchantTransactionId/' + params.merchantTransactionId;
					} else if (params.transactionAuthCode) {
						jquery_object.url = self.endPoint + self.appendUrl + 'TransactionAuthCode/' + params.transactionAuthCode;
					}
				} else if (self.method.toLowerCase() === 'getnotification' || self.method.toLowerCase() === 'acknowledgenotification') {
					jquery_object.url = self.endPoint + self.appendUrl + params.notificationId;
				} else if (self.method.toLowerCase() === 'getsubscriptiondetails') {
					jquery_object.url = self.endPoint + self.appendUrl + params.merchantSubscriptionId + '/Detail/' + params.consumerId;
				}
				httpRequest.createHttpObject(jquery_object, cbOnData, cbOnError);

			};
			/*
			 * CALLING function to check Access Token If already
			 * Generated then direct call API else generate AccessToken
			 */
			checkAccessToken(getStatus);

		}
	};

	/*
	 * Executor for DeviceCapabilities api
	 */

	var DeviceCapabilitiesExecutor = function(params, cbOnData, cbOnError) {"use strict";
		sessionOBJ.attHelper.prepareExecutor(this);
		var self = this, ObtainDeviceCapabilities;
		var address;
		ObtainDeviceCapabilities = function(accessToken) {

			address = encodeURIComponent(params.Address);
			var jquery_object = {
				type : self.verb,
				async : true,
				headers : {
					Accept : params.Accept
				},
				url : self.endPoint + address + self.appendUrl,
				crossDomain : true,
				beforeSend : function(xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer' + ' ' + accessToken);
					if (params.Accept === undefined) {
						xhr.setRequestHeader('Accept', self.accept);
					}
				}
			};

			httpRequest.createHttpObject(jquery_object, cbOnData, cbOnError);

		};
		/*
		 * set sessionOBJ.isOAuth_Code = true to indicate generation of
		 * oauth token.
		 * CALLING function generate AccessToken
		 */
		sessionOBJ.isOAuth_Code = true;
		generateAccessToken(ObtainDeviceCapabilities);

	};
	
	/*
	 * Executor for Call Management api
	 */

	var CallMgmtExecutor = function(params, cbOnData, cbOnError) {
		sessionOBJ.attHelper.prepareExecutor(this);
		var self = this;
		var callMgmtRequest = function(accessToken) {
			var jquery_object = {
				type : self.verb,
				async : false,
				headers : {
					Accept : params.accept
				},
				crossDomain : true,
				beforeSend : function(xhr) {
					xhr.setRequestHeader('Authorization', 'Bearer'
							+ ' ' + accessToken);

					if (params.contentType !== undefined) {
						xhr.setRequestHeader('Content-Type',
								params.contentType);
					}
					if (params.accept !== undefined) {
						xhr.setRequestHeader('Accept', params.accept);
					}
				}
			};

			if (self.method.toLowerCase() === 'createsession') {
				if (params.contentType.toLowerCase() === ATT.Constants.CONTENT_TYPE_JSON) {
					jquery_object.data = JSON.stringify(params.body);
				} else {
					jquery_object.data = params.body;
				}
				//jquery_object.url = self.endPoint + self.appendUrl;
				jquery_object.url = self.endPoint;
			}
			else if (self.method.toLowerCase() === 'sendsignal') {
				
				if (params.contentType.toLowerCase() === ATT.Constants.CONTENT_TYPE_JSON) {
					jquery_object.data = JSON.stringify(params.body);
				} else {
					jquery_object.data = params.body;
				}
				jquery_object.url = self.endPoint + '/' + params.cmsId + '/Signals';
			}
			
			httpRequest.createHttpObject(jquery_object, cbOnData,
					cbOnError);
		};
		/*
		 * CALLING function to check Access Token If already Generated
		 * then direct call API else generate AccessToken
		 */
		checkAccessToken(callMgmtRequest);

	};

	/*
	 * Executor for IMMN api
	 */
	var IMMNExecutor = function(params, cbOnData, cbOnError) {
		sessionOBJ.attHelper.prepareExecutor(this);
		var self = this, immnRequest;

		immnRequest = function(accessToken) {

			if (self.method.toLowerCase() === 'sendmessage') {
				var token = 'Bearer' + ' ' + accessToken;
				var types = [{
					body : params.body ? params.body : '',
					accessToken : token,
					url : self.endPoint,
					accept : (params.accept !== undefined) ? params.accept : '',
					attachments : (params.attachments !== undefined) ? params.attachments : [{}],
					contentType : params.contentType ? params.contentType : ''
				}]
				return Cordova.exec(cbOnData, cbOnError, "AttPlugin", "sendMessage", types);

			} else {
				var jquery_object = {
					type : self.verb,
					async : true,
					headers : {
						Accept : params.accept
					},
					crossDomain : true,
					beforeSend : function(xhr) {
						if (params.accept !== undefined) {
							xhr.setRequestHeader('Accept', params.accept);
						}
						xhr.setRequestHeader('Authorization', ('Bearer' + ' ' + accessToken));
						if (params.contentType !== undefined) {
							xhr.setRequestHeader('Content-Type', params.contentType);
						}
					}
				};
				if (self.method.toLowerCase() === 'getmessageheaders') {
					if (params.indexCursor !== undefined) {
						jquery_object.url = self.endPoint + '?' + 'HeaderCount=' + params.headerCount + '&' + 'IndexCursor=' + encodeURIComponent(params.indexCursor);
					} else {
						jquery_object.url = self.endPoint + '?' + 'HeaderCount=' + params.headerCount;
					}
				} else if (self.method.toLowerCase() === 'getmessagecontent') {

					if (params.partNumber !== undefined) {
						jquery_object.url = self.endPoint + '/' + params.messageId + '/' + params.partNumber;
					} else {

						jquery_object.url = self.endPoint + '/' + params.messageId;
					}
				}
				httpRequest.createHttpObject(jquery_object, cbOnData, cbOnError);
			}
			/*
			 * set sessionOBJ.isOAuth_Code = true to indicate generation of
			 * oauth token.
			 * CALLING function generate AccessToken
			 */
		};
		sessionOBJ.isOAuth_Code = true;
		generateAccessToken(immnRequest);
	};

	/*
	 * Stores the security credentials in the Module Session scope
	 * @param accessKeyId - AccessKey provided by the user @param
	 * secretKey - SecretKey provided by the user @param scope -Scope
	 * provided by user @param grantType -grantType provided by user
	 */

	ATT.authorize = function(accessKeyId, secretKey, scope, grantType, oauthCode) {
		sessionOBJ.accessKeyId = accessKeyId;
		sessionOBJ.secretKey = secretKey;
		sessionOBJ.scope = scope;
		sessionOBJ.grantType = grantType;
		if (!sessionOBJ.oauthCode) {
			sessionOBJ.oauthCode = oauthCode;
		}
	};

	sessionOBJ.bedFrame.build(ATT, {
		verb : 'POST',
		preparer : function() {
			if (!this.action) {
				var initCap = this.method.substr(0, 1).toUpperCase();
				this.action = initCap + this.method.substr(1);
				// Action is Usually same as Method
				// Name, unless explicitly stated
			}
		},
		children : [{
			property : 'SMS',
			endPoint : ATT.Constants.ENDPOINT_SMS,
			executor : SMSExecutor,
			children : [{
				'method' : 'sendSMS',
				'appendUrl' : '/outbox'
			}, {
				'method' : 'getSMSDeliveryStatus',
				'appendUrl' : '/outbox/',
				'verb' : 'GET'

			}, {
				'method' : 'getSMS',
				'verb' : 'GET',
				'appendUrl' : '/inbox/'
			}]

		}, {
			property : 'Speech',
			endPoint : ATT.Constants.ENDPOINT_STT,
			executor : STTExecutor,
			children : [{
				'method' : 'speechToText'

			}]

		}, {
			property : 'Notary',
			endPoint : ATT.Constants.ENDPOINT_NOTARY,
			executor : NOTARYExecutor,
			children : [{
				'method' : 'signedPayload'

			}]

		}, {
			property : 'Ads',
			endPoint : ATT.Constants.ENDPOINT_ADS,
			executor : ADSExecutor,
			children : [ {
				'method' : 'getAds',
				'verb': 'GET'
			} ]

		}, {
			property : 'MMS',
			endPoint : ATT.Constants.ENDPOINT_MMS,
			executor : MMSExecutor,
			children : [{
				'method' : 'sendMMS',
				'appendUrl' : '/outbox'
			}, {
				'method' : 'getMMSDeliveryStatus',
				'appendUrl' : '/outbox',
				'verb' : 'GET'
			}]

		}, {
			property : 'OAuth',
			endPoint : ATT.Constants.ENDPOINT_OAUTH,
			executor : OAUTHExecutor,
			children : [{
				'method' : 'obtainEndUserAuthorization',
				'appendUrl' : '/authorize',
				'verb' : 'GET'

			}]

		}, {
			property : 'Location',
			endPoint : ATT.Constants.ENDPOINT_LOCATION,
			executor : LOCATIONExecutor,
			children : [{
				'method' : 'getDeviceLocation',
				'verb' : 'GET'
			}]

		}, {
			property : 'DeviceCapabilities',
			endPoint : ATT.Constants.ENDPOINT_DEVICECAPABILITIES,
			executor : DeviceCapabilitiesExecutor,
			children : [{
				'method' : 'getDeviceCapabilities',
				'appendUrl' : '/info',
				'verb' : 'GET',
				'accept' : ATT.Constants.ACCEPT_TYPE_JSON

			}]
		}, {
			property : 'Payment',
			endPoint : ATT.Constants.ENDPOINT_ROOT_PAYMENT,
			executor : PaymentExecutor,
			children : [{
				'method' : 'newTransaction',
				'appendUrl' : ATT.Constants.ENDPOINT_PAYMENT_NEWTRANSACTION,
				'verb' : 'GET'
			}, {
				'method' : 'getTransactionStatus',
				'appendUrl' : ATT.Constants.ENDPOINT_PAYMENT_TRANSACTIONSTATUS,
				'verb' : 'GET'
			}, {
				'method' : 'newSubscription',
				'appendUrl' : ATT.Constants.ENDPOINT_PAYMENT_NEWSUBSCRIPTIONS,
				'verb' : 'GET'
			}, {
				'method' : 'getSubscriptionStatus',
				'appendUrl' : ATT.Constants.ENDPOINT_PAYMENT_SUBSCRIPTIONSTATUS,
				'verb' : 'GET'
			}, {
				'method' : 'refundTransaction',
				'appendUrl' : ATT.Constants.ENDPOINT_PAYMENT_REFUNDTRANSACTION,
				'verb' : 'PUT'
			}, {
				'method' : 'getSubscriptionDetails',
				'appendUrl' : ATT.Constants.ENDPOINT_PAYMENT_GETSUBSCRIPTIONDETAILS,
				'verb' : 'GET'
			}, {
				'method' : 'getNotification',
				'appendUrl' : ATT.Constants.ENDPOINT_PAYMENT_GETNOTIFICATION,
				'verb' : 'GET'
			}, {
				'method' : 'acknowledgeNotification',
				'appendUrl' : ATT.Constants.ENDPOINT_PAYMENT_ACKNOWLEDGENOTIFICATION,
				'verb' : 'PUT'
			}]

		}, {
			property : 'IMMN',
			endPoint : ATT.Constants.ENDPOINT_IMMN,
			executor : IMMNExecutor,
			children : [{
				'method' : 'sendMessage'

			}, {
				'method' : 'getMessageHeaders',
				'verb' : 'GET'

			}, {
				'method' : 'getMessageContent',
				'verb' : 'GET'
			}]
		}, {
			property : 'CallMgmt',
			endPoint : ATT.Constants.ENDPOINT_CALLMGMT,
			executor : CallMgmtExecutor,
			children : [{
				'method' : 'createSession'
			}, {
				'method' : 'sendSignal'
			}]
		}, {
			property : 'tts',
			endPoint : ATT.Constants.ENDPOINT_TTS,
			executor : TTSExecutor,
			children : [{
				'method' : 'textToSpeech'
			}]
		}]
	});

	exports.ATT = ATT;
});
