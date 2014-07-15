/**
 * @class ATT
 * <b>Introduction:</b>
 *
 * The PhoneGap Plugins for the AT&T API Platform provide the following APIs:
 *
 *• ATT.MMS
 *
 *• ATT.InAppMessaging
 *
 *• ATT.OAuth
 *
 *• ATT.SMS
 * 
 *• ATT.Speech
 * 
 *• ATT.Ads
 *
 *• ATT.TTS
 *
 */
/**
 * @method getCachedAccessToken Returns the access token stored in memory that is used for requests. If there is no token the method returns undefined.
 * @return {String}
 */
/**
 * @method getCachedUserAuthToken Returns the user-consented OAuth token stored in memory that is used for requests.  If there is no token the method returns undefined.
 * @return {String}
 */
/**
 * @class ATT.SMS <b>Introduction:</b>
 *
 * The Short Message Service (SMS) API enables you to target specific customers with alerts and information. Additionally, the SMS API gives your customers the ability to respond to your messages in near real-time.
 * 
 *<b>Description:</b>
 *
 *The SMS API enables authorized applications to send SMS messages to devices on the AT&T network. In addition, this API allows applications to query the delivery status of SMS messages sent from an application.
 *
 *<b>The SMS API provides the following methods:</b>
 *
 *• getSMS
 *
 *• getSMSDeliveryStatus
 *
 *• sendSMS
 */
/**
 * @method sendSMS
 * Sends an SMS message to a recipient.
 * @param {Object} options Specifies a JSON object that contains properties for the following parameters:
 * @param {Object} options.body Specifies an object that contains all of the parameters that a user needs to send a message on an AT&T mobile device. Valid parameters are:
 *
 * @param {String} options.body.address Specifies the MSISDN of the recipients.
 * @param {String} options.body.message Specifies the text of the message to send.
 * @param {String} options.contentType Specifies the format of the message. The acceptable values for this parameter are:
 *
 *• application/json
 *
 *• application/xml
 *
 *• application/x-www-form-urlencoded

 * @param {String} [options.accept="application/json"] Specifies the format of the body of the object returned by this method.
 * 
 * The acceptable values for this parameter are:
 *
 *• application/json
 *
 *• application/xml
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} A JSON or XML formatted object that contains the results. The format of the returned object is specified by the value of the accept parameter in the call to the sendSMS method.
 *
 * <strong>Examples:</strong>
 *
 *<b>Example 1.</b> The following example of the sendSMS method uses a contentType of 'application/json'.
 *
 *      sendSMS({
 *          'body':{"message":"Test AT&T REST",  "address":"tel:xxxxxxxxxx"},//For Multiple Phone Number :- "Address":["tel:xxxxxxxxxx","tel:xxxxxxxxxx"]
 *          'accept' : 'application/json',
 *          'contentType' : 'application/json'
 *       }, function(data) {
 *
 *           //success Callback
 *
 *       }, function(error) {
 *
 *           //error Callback
 *
 *       });
 * 
 *  <i>Note: xxxxxxxxxx represents an AT&T wireless number</i>
 *
 *<b>Example 2.</b> The following example of the sendSMS method uses a contentType of 'application/xml'..
 *
 *      sendSMS({
 *          "body":"<outboundSMSRequest><address>tel:xxxxxxxxxx</address><message>Test XML </message></outboundSMSRequest>",
 *          'accept' : 'application/json',
 *          'contentType' : 'application/xml'
 *       }, function(data) {
 *
 *            //success Callback
 *
 *       }, function(error) {
 *
 *            //error Callback
 *
 *       });
 * 
 *  <i>Note: xxxxxxxxxx represents an AT&T wireless number</i>
 *
 *
 * <b>Example 3.</b>The following example of the sendSMS method uses a contentType of 'application/x-www-form-urlencoded'.
 *
 *      sendSMS({
 *          "body":"address=tel%3A%2B1xxxxxxxxxx&address=tel%3A%2B1xxxxxxxxxx&message=URL%20ENCODED",
 *          'accept' : 'application/json',
 *          'contentType' : 'application/x-www-form-urlencoded'
 *       }, function(data) {
 *
 *            //success Callback
 *
 *       }, function(error) {
 *
 *            //error Callback
 *
 *       });
 *
 * <i>Note: xxxxxxxxxx represents an AT&T wireless number</i>
 */
/**
 * @method getSMSDeliveryStatus
 * Checks the status of a sent SMS message.
 *
 * A final state is reached when the DeliveryStatus field of a DeliveryInfo object is set to one of the following values:
 *
 *• DeliveredToTerminal
 *
 *• DeliveryImpossible
 *
 *• DeliveredToNetwork
 *
 * A single successful delivery status query may be made for a period of thirty minutes following the time a message DeliveryInfo object has been set to a final state. Thirty minutes after a query of the DeliveryInfo object has returned a final state, the DeliveryInfo object is not available for query.
 * @param {Object} options Specifies a JSON object that contains properties for the following parameters:
 * @param {String} options.smsId Specifies the SMS request identifier (ID) that is returned by the sendMMS method as part of the response object.
 * @param {String} options.accept Specifies the format of the body of the object returned by this method.
 * 
 * The acceptable values for this parameter are:
 *
 *•  application/json
 *
 *•  application/xml.
 *
 * The default value for this parameter is: 'application/json'
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns error.
 * @return {Object} A JSON or XML formatted object that contains the delivery status. The format of the returned object is specified by the value of the accept parameter in the call to the getSMSDeliveryStatus method.
 *
 * <strong>Example:</strong>
 *
 * The following is an example of the getSMSDeliveryStatus method.
 *
 *      getSMSDeliveryStatus({
 *           'smsId' : <put smsId here>,
 *           'accept' : 'application/json'
 *
 *       }, function(data) {
 *
 *            //success Callback
 *
 *       }, function(error) {
 *
 *            //error Callback
 *
 *       });
 */
/**
 * @method getSMS
 * Retrieves a list of SMS messages that were sent to the application's short code.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} options.registrationId Specifies the short code identifier (ID) of the application that is obtained when you register your application with AT&T.
 * @param {String} options.accept Specifies the format of the body of the object returned by this method.
 * 
 * The acceptable values for this parameter are:
 *
 *• application/json
 *
 *• application/xml.
 *
 * The default value for this parameter is: 'application/json'
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} A JSON or XML formatted object that contains the list of SMS messages The format of the returned object is specified by the value of the accept parameter in the call to the getSMS method.
 *
 * <strong>Example:</strong>
 *
 * The following is an example of the getSMS method.
 *
 *      getSMS({
 *           'accept' : 'application/json',
 *           'registrationId' : <put registrationId here>
 *       }, function(data) {
 *
 *            //success Callback
 *
 *       }, function(error) {
 *
 *            //error Callback
 *
 *       });
 */

/**
 * @class ATT.OAuth <b>Introduction:</b>
 *
 * The OAuth 2.0 Authentication Management API provides access to the AT&T OAuth service. The OAuth service provides a safe and secure way for AT&T subscribers to access AT&T network resources through a third-party application without the risk of compromising security. The OAuth service ensures that secure, sensitive, and private AT&T subscription details are not exposed to the third-party application.
 * 
 * OAuth 2.0 Authentication Management is an open standard recognized as providing a strong protection to clients and applications. The OAuth service provides developers with a security model that allows them to obtain an authorization code and an access token. By acquiring an authorization code, a resource owner has authorized an application to access a protected resource on their behalf. The receipt of an access token enables an application to access a protected resource on behalf of a resource owner via the AT&T network.
 * 
 * <b>Description:</b>
 * 
 * The OAuth 2.0 Authentication Management API allows third party applications access to the private resources of subscribers without requiring the end-user to provide credentials (such as username and password) to the third party application. An application that is implemented with OAuth, provides a closer and more secure integration with the AT&T API Platform.
 * 
 * <b>The OAuth 2.0 Authentication Management API provides the following methods:</b>
 *
 * 1) authorize
 *
 * 2) obtainEndUserAuthorization
 */
/**
 * @method obtainEndUserAuthorization
 * Obtains information required to obtain an OAuth access token. This method is the initial operation in the OAuth call flow. It is invoked by an application that requires subscriber authorization in order to obtain an OAuth access token. The application’s request for an OAuth access token is forwarded by redirecting the subscriber’s browser to the AT&T Gateway OAuth Server.
 * 
 * <b>Important</b> Currently, this method is necessary and supported only for applications attempting to consume the following APIs:
 *
 * • Location API
 *
 * • In-app Messaging from Mobile Number API
 *
 * @param {Object} options Specifies a JSON object that contains properties for the following parameters:
 * @param {String} options.clientId Specifies the API key that is assigned to the application when the developer creates an application account at [https://devconnect-api.att.com/.](https://devconnect-api.att.com/)
 * @param {String} options.scope Specifies the services for which the application is requesting the end-user to provide consent. The value of the scope parameter is a comma delimited list that contains one or more of the following values that represent the services that are in scope.
 * 
 * • Terminal Location – TL.
 *
 * • In-app Messaging from Mobile Number – IMMN
 * @param {String} [options.redirectUrl] Specifies the URL where the subscriber’s browser is redirected following completion of the authorization process. If this parameter is not specified, the AT&T Gateway uses the value of the provided OAuth Redirect URL that is specified by the developer in the AT&T API Platform console when the application is registered.
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {String} Specifies a query parameter that is included with the redirect_uri parameter of the authorize method in the original OAuth request.
 *
 * <strong>Example:</strong>
 *
 * The following is an example of the obtainEndUserAuthorization method.
 *
 *      obtainEndUserAuthorization({
 *           'clientId' : 'API Key',
 *           'scope' : 'scope values',
 *          'redirectUrl' : 'redirect url'
 *      },function(data) {
 *
 *         success Callback
 *
 *      }, function(error) {
 *
 *          error Callback
 *
 *      });
 */

/**
 * @method authorize
 *
 * Authorizes an application so that it may use specific AT&T APIs.
 *
 * This method must be called directly using the following ATT namespace: <b>Att.authorize('apiKey','secretKey','scope','grantType','oAuthCode')</b>
 *
 * When authorizing an application for use with the Location and In-app Messaging from Mobile Number APIs, the user must send their access key, secret key, scope, grantType, and OAuthCode.
 * 
 * <b>Syntax</b>
 * 
 * authorize( accessKey, secretKey, scope, grantType, oAuthCode )
 *
 * @param {String} accessKey Specifies the API key that is assigned to the application when the developer creates an application account at [https://devconnect-api.att.com/.](https://devconnect-api.att.com/)
 * @param {String} secretKey Specifies the secret key that is assigned to the application when the developer creates an application account at [https://devconnect-api.att.com/.](https://devconnect-api.att.com/)
 * @param {String} scope Specifies a comma separated list of authScopes enumeration values that specify which APIs the app requires access to.
 * @param {String} grantType Specifies the mechanism used to obtain the access token. The acceptable values for this parameter are:
 * 
 * authorization_code: Use when Web-server client applications use the authorization code to obtain the access token.
 * 
 * client_credentials: Use when autonomous client applications use the API key and its secret to obtain the access token.
 * 
 * refresh_token: Use when client applications of both types mentioned above use refresh_token to obtain a new access token after the initial access token expires.
 * 
 * @param {String} oAuthCode Specifies the authorization code. The oAuthCode is returned in the response object of the obtainEndUserAuthorization method. Currently, this parameter is required only when using the Location and In-app Messaging from Mobile Number APIs.
 *    <b>Example:</b>
 *
 * The following is an example of the authorize method.
 *
 *              Att.authorize('apiKey','secretKey','scope','grantType','oAuthCode');
 */

/**
 * @class ATT.MMS <b>Introduction</b>
 *
 * The Multimedia Messaging Service (MMS) API enhances the power of your application’s communications by moving beyond the text-only capabilities of Short Message Service (SMS) messaging. Using the MMS API, you can send mobile terminated or receive mobile originated messages that include video, images and audio attachments as well as text.
 *
 * <b>Description</b>
 *
 *The MMS API enables applications to send Multimedia Messaging Services (MMS) messages and get the delivery status of the sent messages from the network. 
 * 
 * If your application hosts a service that complies with an AT&T specified callback, the application may also receive MMS messages. AT&T will deliver MMS messages to the application as soon as they arrive on the AT&T network.
 *
 * <b>The MMS API provides the following methods:</b>
 *
 *• getMMSDeliveryStatus
 *
 *• sendMMS
 */

/**
 * @method sendMMS
 *
 * Sends an MMS message to the specified recipient.
 *
 * The Multimedia Messaging Service allows for the delivery of different file types. For an updated list, see the[Developer Documentation](https://developer.att.com/developer/tierNpage.jsp?passedItemId=2400428).
 *
 * @param {Object} options Specifies a JSON object that contains properties for the following parameters:
 * @param {Object} options.body Specifies an object that contains all of the parameters that a user needs to send a message on an AT&T mobile device. The acceptable parameters are:
 * @param {String} options.body.address Specifies the MSISDN of the recipients.
 * @param {String} [options.body.subject] Specifies the subject of the message.
 * @param {String} [options.body.Priority="Default"] Acceptable values for this parameter are:
 * 
 *• "Default",
 * 
 *• "Low", 
 * 
 *• "Normal", 
 * 
 *• "High".
 *
 * The defaults value is: 'Default'
 * @param {Array} options.attachments Specifies an array of JSON objects that contain three key-value pairs:
 * 
 * • fileName:"Name of the file"
 * 
 * • fileType:"Type of the file"
 * 
 * • filePath:"Path of the file"
 *
 * The file may be an image, audio, video, or text file.
 * 
 * @param {String} options.contentType Specifies the format of the message content. Acceptable values for this parameter are:
 *
 *• application/json
 *
 *• application/xml
 *
 *• application/x-www-form-urlencoded
 * @param {String} [options.accept="application/json"] Specifies the format of the body of the object returned by this method.
 * 
 * The acceptable values for this parameter are:
 *
 *• application/json
 *
 *• application/xml
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} A JSON or XML formatted object that contains the response. The format of the returned object is specified by the value of the accept parameter in the call to the sendMMS method.
 *
 * <strong>Examples:</strong>
 *
 * <b>Example 1: </b> The following example of the sendMMS method sends a JSON formatted message with high priority.
 *
 *      sendMMS({
 *                  "body":{ "address" : "tel:xxxxxxxxxx,tel:xxxxxxxxxx", "subject" : "Test MMS", "priority" : "High" },
 *                  "contentType" : "application/json",
 *                  "accept" : "application/json",
 *                  "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : image/png",'filePath' :"Path of the file","fileObject":"base-64 encoded string of file object"}, {'fileName' : "Name of the file",'fileType' : "fileType of the file like : image/jpeg",'filePath' :"Path of the file","fileObject":"base-64 encoded string of file object"}]
 *      },  function(data) {
 *
 *           //success Callback
 *
 *       }, function(error) {
 *
 *           //error Callback
 *
 *       });
 * 
 * Note: xxxxxxxxxx represents an AT&T wireless number.
 *
 * <b>Example 2.</b> The following example of the sendMMS method sends an XML formatted message with high priority.
 *
 *      sendMMS({
 *                  "body":"<outboundMessageRequest>" + "\n" + "<address>tel:xxxxxxxxxx</address>" + "\n" + "<subject>Test MMS</subject>" + "\n" + "<priority>High</priority>" + "\n" + "</outboundMessageRequest>",
 *                  "contentType" : "application/xml",
 *                  "accept" : "application/json",
 *                  "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : image/png",'filePath' :"Path of the file","fileObject":"base-64 encoded string of file object"}, {'fileName' : "Name of the file",'fileType' : "type of the file like : image/jpeg",'filePath' :"Path of the file","fileObject":"base-64 encoded string of file object"}]
 *       },  function(data) {
 *
 *           //success Callback
 *
 *       }, function(error) {
 *
 *           //error Callback
 *
 *       });
 * 
 * Note: xxxxxxxxxx represents an AT&T wireless number.
 *
 * <b>Example 3.</b> The following example of the sendMMS method uses a contentType of 'application/x-www-form-urlencoded'.
 *
 *      sendMMS({
 *                  "body":"address=tel%3A%2B1xxxxxxxxxx&priority=High&subject=Test%20MMS",
 *                  "contentType" : "application/x-www-form-urlencoded",
 *                  "accept" : "application/json",
 *                 "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : image/png",'filePath' :"Path of the file","fileObject":"base-64 encoded string of file object"}, {'fileName' : "Name of the file",'fileType' : "type of the file like : image/jpeg",'filePath' :"Path of the file","fileObject":"base-64 encoded string of file object"}]
 *      },  function(data) {
 *
 *          //success Callback
 *
 *      }, function(error) {
 *
 *          //error Callback
 *
 *      });
 *
 * <i>Note: xxxxxxxxxx represents an AT&T wireless number.</i>
 */

/**
 * @method getMMSDeliveryStatus
 *
 * Returns the status of a sent MMS message.
 * @param {Object} options Specifies a JSON object that contains properties for the following parameters,
 * @param {String} options.id Specifies the MMS request id that is returned by the sendMMS method.
 * @param {String} [options.accept="application/json"] Specifies the format of the body of the object returned by this method.
 * 
 * The acceptable values for this parameter are:
 *
 *- application/json
 *
 *- application/xml
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} A JSON or XML formatted object that contains the status information for the message. The format of the returned object is specified by the value of the accept parameter in the call to the getMMSDeliveryStatus method.
 *
 * <strong>Example</strong>
 *
 * The following example of the getMMSDeliveryStatus method returns a JSON object that contains information about the status of the specified message.
 *
 *      getMMSDeliveryStatus({
 *                  'id' : "MMS ID that you get in response of sendMMS.",
 *                  "accept" : "application/json",
 *       },  function(data) {
 *
 *            //success Callback
 *
 *       }, function(error) {
 *
 *            //error Callback
 *
 *       });
 */
/**
 * @class ATT.InAppMessaging <b>Introduction:</b>
 *
 * The In-App Messaging API enables your application to send and retrieve SMS and MMS messages on behalf of your customers’ regular AT&T mobile phone numbers.
 *
 * <b>Description:</b>
 *
 * The In-App Messaging from Mobile Number API allows applications to send and receive SMS and MMS on behalf of a subscriber if that subscriber has given consent. When sending a message on behalf of a subscriber, that subscriber's MSISDN is retrieved from the subscriber’s consent information. The message is then forwarded to the recipients using the subscriber's MSISDN as the sender address. A developer can make a single API request and the AT&T system will determine if the request is an SMS or an MMS message and select the correct transport mechanism accordingly.
 * <br>Some major advantages of using In-App Messaging are:
 * Sending messages from your application: The In-App Messaging Send Message operation allows your customers to send text and picture messages to any U.S. mobile phone using their own AT&T phone number, from within your application. Message recipients can immediately recognize who sent the message.
 * 
 * Receiving messages in your application: Responses to the sent messages can be received by the user’s mobile phone or by your application using the Get Message Headers and Get Message Content operations. Your application can display messages received by the user’s mobile phone, allowing the conversation to continue from within your application.
 *
 * <b>Methods:</b>
 *
 * 1) createMessageIndex
 *
 * 2) deleteMessage
 *
 * 3) deleteMessages
 * 
 * 4) getMessage
 * 
 * 5) getMessageContent
 * 
 * 6) getMessagesDelta
 * 
 * 7) getMessageIndexInfo
 * 
 * 8) getMessageList
 * 
 * 9) sendMessage
 * 
 * 10) getNotificationConnectionDetails
 * 
 * 11) updateMessage
 * 
 * 12) updateMessages
 * 
 */

/**
 * @method createMessageIndex
 * This operation gives the developer the ability to create an index cache for the suscriber's inbox 
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. No content is returned, only HTTP Code 202 (Accepted)
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the getMessageHeaders method.
 *
 *          createMessageIndex({
 *                  'accept' : 'application/json'
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */

/**
 * @method deleteMessage
 * This operation gives the developer the ability to delete a specific message in an inbox.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {String} options.messageId Id of the message that is intended to get deleted.
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. No content is returned, only HTTP Code 204 (No Content)
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the deleteMessage method.
 *
 *          deleteMessage({
 *                  'accept' : 'application/json',
 *					'messageId' : 's01'
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */

/**
 * @method deleteMessages
 * This operation gives the developer the ability to delete messages in an inbox. 
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {String} options.messageIds Comma delimited message ids.
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. 
 * No content is returned, only HTTP Code 204 (No Content)
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the deleteMessage method.
 *
 *          deleteMessages({
 *                  'accept' : 'application/json',
 *					'messageIds' : 's01,s02,s03'
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */

/**
 * @method getMessage
 * The Get Message operation will get a single message from a subscriber's message inbox. 
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {String} options.messageId A message identifier representing a Subscriber Message in the AT&T Messages environment.
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. 
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the getMessage method.
 *
 *          getMessage({
 *                  'accept' : 'application/json',
 *					'messageId' : 's01'
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */


/**
 * @method getMessageContent
 * This method uses information returned by getMessageList to enable applications to fetch one or more subscriber messages from the AT&T Messages environment.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. 
 * 
 * The default value is: application/json
 * @param {String} options.messageId A message identifier representing a Subscriber Message in the AT&T Messages environment.
 * @param {String} options.partId A content identifier representing an attachment in the referenced Subscriber Message
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response is specified by the value of the accept parameter in the request. 
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the getMessageContent method.
 *
 *          getMessageContent({
 *                  'accept' : 'application/json',
 *					'messageId' : 's01',
 *					'partId' : '1'
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */
/**
 * @method getDelta
 * This method provides capability to check for updates by passing in a client state.
 * This is typically used when a client goes from being offline to becoming online. If the subscriber’s mailbox index cache does not exist an error (409) would be returned to the client and the client would have to re-initialize the cache 
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {String} options.state state The client would have this string from a either the Get Message Index request, or from the getMessageList request.
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. 
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the getDelta method.
 *
 *          getDelta({
 *                  'accept' : 'application/json',
 *					'state' : 'xxxxxxxxxxxxxxxxxx'
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 * <i> Note: xxxxxxxxxxxxxxxxxx represents the state of the Inbox </i>
 */

/**
 * @method getMessageIndexInfo
 * This operation allows the developer to get the state, status and message count of the index cache for the subscriber’s inbox.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. 
 * 
 * The messageIndexInfo object returned has the following parameters:
 * @param {String} status This parameters indicates the status of the message index cache. The following values could be returned
 *    <ul>
 *    <li>NOT_INITIALIZED</li>
 *    <li>INITIALIZING</li>
 *	  <li>INITIALIZED</li>
 *    <li>ERROR</li>
 *    </ul>
 * @param {String} state This is an opaque string that denotes the current state of the mailbox in the platform.
 * @param {Number} messageCount Number of message indexes cached for the subscriber
 *
 * <strong>Example:</strong>
 * 
 * The following is an example of the getMessageIndexInfo method.
 *
 *          getMessageIndexInfo({
 *                  'accept' : 'application/json'
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */

/**
 * @method getMessageList
 * Enables an application to retrieve meta-data for one or more Subscriber Messages from the AT&T Messages environment.
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} options.limit The number of messages to be returned:
 *
 * Valid Range: Min = 1, Max = 500
 *
 * If offset is defined, the number of messages defined in limit will be returned starting  with the first message defined by offset.
 * @param {String} [options.offset] Defines an index value at which the limit starts.
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request.
 *
 * <strong>Example:</strong>
 * 
 * The following is an example of the getMessageList method.
 *
 *          getMessageList({
 *                  'accept' : 'application/json',
 *                  'limit' : 500 //Valid Range: Min = 1, Max = 500 // Should be integer
 *                  'offset' : '123' //Define an index value at which offset will start.
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */

/**
 * @method sendMessage
 * Enables an application to send messages on behalf of an AT&T subscriber. Each time the sendMessage method is invoked, a single message can be sent to one or more destination devices. Messages are processed synchronously and sent asynchronously to the destination.
 * @param {Object} options A JSON object containing the following properties:
 * @param {Object} options.body An object containing all of the parameters that a user needs to send a message on an AT&T mobile device. Valid parameters are:
 * @param {Array} options.body.Addresses The MSISDN of the recipient, or a comma separated list of MSISDNs for multiple recipients. For example: tel:6507038846,tel:6507038847.
 * @param {String} options.body.Subject The subject of the message.
 * @param {String} options.body.Text The text portion of the message. If the request is detected as MMS then the following character sets will be supported:
 * @param {Boolean} options.body.isGroup If set to true the message is sent as a group MMS message as compared to a Broadcase message when sending to multiple recipients 
 *
 *• ASCII
 *
 *• UTF-8
 *
 *• UTF-16
 *
 *• ISO-8859-1
 *
 * If the request is detected as SMS then the following character set will be supported:
 *
 *• ISO-8859-1
 *
 * Note: This data becomes mandatory if attachment(s) is NOT provided in the request.
 * @param {Array} options.attachments An array of JSON objects containing three key-value pairs, i.e. <i>{fileName:"Name of the file",fileType:"Type of the file",filePath:"Path of the file"}</i> The file can be image, audio ,video or text.
 * @param {String} options.contentType Specifies the format of the message content. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 *
 *• application/x-www-form-urlencoded

 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request.
 *
 * <strong>Examples:</strong>
 *
 * <b>1.</b> The following example of the sendMessage method uses a contentType of 'application/json'.
 *
 *      sendMessage({
 *                   "body":{ "MessageRequest": {"Addresses": ["mail@mail.mail","mail@mail.mail","tel:xxxxxxxxxx"], "Text": "Hello world", "Subject": "Hi" ,"isGroup": false} },
 *                   "contentType" : "application/json",
 *                   "accept" : "application/json",
 *                   "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : image/png",'filePath' :"Path of the file"}, {'fileName' : "Name of the file",'fileType' : "type of the file like : image/jpeg",'filePath' :"Path of the file"}]
 *        }, function(data) {
 *
 *           success Callback
 *
 *       }, function(error) {
 *
 *           error Callback
 *
 *       });
 *
 * <b>2.</b> The following example of the sendMessage method uses a contentType of 'application/xml'.
 *  
 *      sendMessage({
 *                    "body":"<MessageRequest>"+"\n"+"<Addresses>tel:xxxxxxxxxx,tel:xxxxxxxxxx,mail@mail.mail</Addresses>"+"\n"+"<Text>Hello world</Text>"+"\n"+"<Subject>Hi</Subject>"+"\n"+"</MessageRequest>",
 *                    "contentType" : "application/xml",
 *                    "accept" : "application/json",
 *                    "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : image/png",'filePath' :"Path of the file"}, {'fileName' : "Name of the file",'fileType' : "type of the file like : image/jpeg",'filePath' :"Path of the file"}]
 *        }, function(data) {
 *
 *           success Callback
 *
 *       }, function(error) {
 *
 *           error Callback
 *
 *       });
 *
 *
 * <b>3.</b> The following example of the sendMessage method uses a contentType of 'application/x-www-form-urlencoded'.
 *
 *      sendMessage({
 *                   "body":"Addresses=tel%3A%2Bxxxxxxxxxx&Addresses=tel%3A%2Bxxxxxxxxxx&Addresses=mail@mail.mail&Text=Hello&Subject=Hi&isGroup=false",
 *                   "contentType" : "application/x-www-form-urlencoded",
 *                   "accept" : "application/json",
 *                  "attachments" : [{'fileName' : "Name of the file",'fileType' : "type of the file like : image/png",'filePath' :"Path of the file"}, {'fileName' : "Name of the file",'fileType' : "type of the file like : image/jpeg",'filePath' :"Path of the file"}]
 *        }, function(data) {
 *
 *           success Callback
 *
 *       }, function(error) {
 *
 *           error Callback
 *
 *       });
 *
 * <i>Note: xxxxxxxxxx represents an AT&T wireless number</i>
 */


/**
 * @method updateMessage
 * This operation allows the developer to update the flags that are associated with a specific message. The developer passes in the messageId & flags
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {String} options.messageId Id of the message that is intended to be updated.
 * @param {Object} options.body An object containing all of the parameters that a user needs to update messages
 * @param {Object} options.body.message Container for flags that need to be updated
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. No content is returned, only HTTP Code 204 (No Content)
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the updateMessage method.
 *
 *          updateMessage({
 *                  'accept' : 'application/json',
 *					'messageId' : 's01',
 *					'body' : {'message': {'isUnread' : true} }
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */
 /**
 * @method updateMessages
 * TThis operation allows the developer to update the flags that are associated with a collection of messages. The developer can pass in any number of messages
 * @param {Object} options A JSON object containing the following properties:
 * @param {String} [options.accept] Specifies the format of the body of the response. Valid values are:
 *
 *• application/json
 *
 *• application/xml
 * 
 * The default value is: application/json
 * @param {Object} options.body An object containing all of the parameters that a user needs to update messages
 * @param {Object} options.body.message Container for flags that need to be updated (message Id & isUnread flag)
 * @param {String} options.body.message.messageId Message Id of the message that needs to be updated
 * @param {String} options.body.message.isUnread Desired value of the isUnread flag that the message will be updated to 
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} An object containing the response. The format of the response (JSON or XML) is specified by the value of the accept parameter in the request. No content is returned, only HTTP Code 204 (No Content)
 * 
 * <strong>Example:</strong>
 * 
 * The following is an example of the updateMessages method.
 *
 *          updateMessages({
 *                  'accept' : 'application/json',
 *					'messageId' : 's01',
 *					'body' : {'message': {'MessageId': 's01','isUnread' : true}, {'MessageId': 's03','isUnread' : false} }
 *           }, function(data) {
 *
 *               success Callback
 *
 *           }, function(error) {
 *
 *               error Callback
 *
 *           });
 */

/**
 * @class ATT.Speech <b>Introduction:</b>
 *
 * The Speech API enables authorized applications to transcribe speech (audio) to text. In addition, your application may influence the results by passing a speech context in the Speech To Text method.
 *
 * <b>Description:</b>
 *
 * The Speech API is a service that accepts audio data and returns the text representation of that audio. The text output may then be processed by different speech contexts to produce text results that represent that speech context. Each speech context is tuned to produce results more suitable for a given scenario.
 * 
 * <b>The Speech API provides the following methods:</b>
 *
 *• speechToText
 */

/**
 * @method speechToText
 * Returns a text translation of the specified audio file using the specified speech context. The audio file must have one of the following sets of constraints: 16 bit PCM WAV, single channel, 8 kHz sampling, or AMR (narrowband), 12.2 kbit/s, 8 kHz sampling.
 *
 * @param {Object} options Specifies a JSON object that contains properties for the following parameters:
 * @param {String} options.filePath Specifies the path of the audio file that is translated to text. (For the Android platform, the path should be in the following format: /mnt/sdcard/.../fileName.fileExtension).
 * @param {String} [options.transferEncoding] Specifies how the audio file is encoded when transferred. This parameter is required only for a streaming request, and should be set to the following value:chunked
 * @param {String} [options.xSpeechContext="Generic"] Specifies the speech context that is applied to the transcribed text. Acceptable values for this property are:
 *
 *• Generic
 *
 *• TV
 *
 *• BusinessSearch
 *
 *• Websearch
 *
 *• SMS
 *
 *• Voicemail
 *
 *• QuestionAndAnswer
 *
 *• Gaming
 *
 *• SocialMedia
 *
 * If <b>TV</b> context is chosen, then the X-Arg parameter <b>Search</b> must be defined.
 * @param {String} options.contentType The content type of the request. Valid values are:
 *
 *• audio/wav (or audio/x-wav)
 *
 *• audio/amr
 *
 *• audio/amr-wb
 *
 *• audio/x-speex
 *
 *• audio/x-speex-with-header-byte;rate=16000
 *
 *• audio/x-speex-with-header-byte;rate=8000
 *
 *• audio/raw;coding=linear;rate=16000;byteorder=LE
 *
 *• audio/raw;coding=linear;rate=16000;byteorder=BE
 *
 *• audio/raw;coding=linear;rate=8000;byteorder=LE
 *
 *• audio/raw;coding=linear;rate=8000;byteorder=BE
 *
 *• audio/raw;coding=ulaw;rate=16000
 *
 *• audio/raw;coding=ulaw;rate=8000
 *
 *Note: the API Gateway shall not modify this header when passed onto the Speech enabler, except to remove white space in order to ensure consistent use of parameters.
 * @param {String} [options.accept="application/json"] Specifies the format of the body of the object returned by this method.
 * 
 * The acceptable values for this parameter are:
 *
 *• application/json
 *
 *• application/xml
 * @param {Number} options.contentLength <b>(IOS only).</b>This property is required only for a <b>non-streaming request.</b>
 * @param {String} [options.contentLanguage="en-US"] Only Specifies the language of the submitted audio.  Only used when xSpeechContext parameter is set to “Generic”.  Choose one of the following two choices:
 * 
 *• "en-US" (English - United States)
 * 
 *• "es-US" (Spanish - United States)
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} A JSON or XML formatted object that contains the transcribed text. The format of the returned object is specified by the value of the accept parameter in the call to the Speech To Text method.
 *
 * <b>Example:</b>
 *
 * The following is an example of the speechToText method.
 *
 *       speechToText({
 *           'filePath':'Path of audio file'//In android,Path should be like : /mnt/sdcard/.../example.wav.
 *           'xSpeechContext' : 'Generic',
 *           'contentType' : 'audio/wav',
 *           'contentLength' : length,//For IOS only.
 *           'accept':'application/json',
 *           'contentLanguage': 'es-US'
 *      },function(data) {
 *
 *         //success Callback
 *
 *      }, function(error) {
 *
 *          //error Callback
 *
 *      });
 */
 
 /**
 * @class ATT.Ads <b>Introduction:</b>
 *
 * The Advertising API enables authorized applications to receive pay per click advertisements to be placed within their app.
 *
 * <b>Description:</b>
 *
 * The Advertising API is a service that returns advertisements enabling the developer to insert the advertisements into their application.
 * 
 * <b>The Advertising API provides the following methods:</b>
 *
 *• getAds
 */

/**
 * @method getAds
 * This operation returns an advertisement to the application.
 * 
 * All of the data is received through the callbacks.
 * The success callback will receive A JSON or XML formatted object that contains the content for the ad to be displayed.
 * The format of the returned object is specified by the value of the accept parameter in the call to the getAds method.
 *
 * <b>Example:</b>
 *
 * The following is an example of the getAds method.
 *
 *      getAds({
 *          accept: "application/json",
 *          udid: "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
 *          body: {
 *              Category: "auto",
 *          },
 *          accept: "application/json"
 *      },function(data) {
 *      
 *         //success Callback
 *      
 *      }, function(error) {
 *      
 *          //error Callback
 *      
 *      });
 *
 * @param {Object} options Specifies a JSON object that contains properties for the following parameters:
 * @param {String} options.udid Required field that specifies the Merchant ID associated with your app. The UDID Parameter is used for ad tracking purpose.
 * @param {String} [options.accept="application/json"] Specifies the format of the body of the response. Valid values are:
 *
 * • application/json
 *
 * • application/xml
 * @param {String/Object} options.body Specifies parameters for the ads request in either a either a flat object of a URI Encoded string
 * @param {String} options.body.Category Specifies the category for the advertisement
 * 
 * The acceptable values for this parameter are:
 * 
 * • auto
 * 
 * • business
 * 
 * • finance
 * 
 * • chat
 * 
 * • community
 * 
 * • social
 * 
 * • personals
 * 
 * • communication
 * 
 * • technology
 * 
 * • games
 * 
 * • health
 * 
 * • medical
 * 
 * • maps
 * 
 * • local
 * 
 * • entertainment
 * 
 * • movies
 * 
 * • tv
 * 
 * • music
 * 
 * • photos
 * 
 * • video
 * 
 * • news
 * 
 * • weather
 * 
 * • sports
 * 
 * • shopping
 * 
 * • tools
 * 
 * • travel
 * 
 * • other
 * @param {String} [options.body.Gender] The Gender of the demographic audience of the app.
 * For Male use “M” and for Female use “F”.  This would be an optional run time parameter
 * @param {Number} [options.body.ZipCode] Zip/Postal code of a user. For US only.
 * @param {Number} [options.body.Number] Area code of a user.  For US only.
 * @param {String} [options.body.City] The City (with state) of the device user. For US only.
 * @param {String} [options.body.Country] Country of visitor. Overrides the country detected by IP.
 * An ISO 3166 code to be used for specifying a country code.
 * @param {Number} [options.body.Longitude] User location latitude value (in degrees).
 * @param {Number} [options.body.Latitude] User location latitude value (in degrees).
 * @param {Number} [options.body.MaxHeight] Maximum height of the ad banner to be shown.
 * @param {Number} [options.body.MaxWidth] Maximum width of the ad banner to be shown.
 * @param {Number} [options.body.MinHeight] Minimum height of the ad banner to be shown.
 * @param {Number} [options.body.MinWidth] Minimum width of the ad banner to be shown.
 * @param {Number} [options.body.Type] Type of ads to be returned (1 – text, 2 – image, ).
 * You can set different combinations with these values. For example, 3 = 1 + 2 (text + image).
 * Only type =3 will be supported in this release . So the response could be either text or image Ad.
 * @param {String} [options.body.AgeGroup]
 * The age group of the demographic audience of the app. Choose one of the following:
 * 
 * • 1-13
 * 
 * • 14-25
 * 
 * • 26-35
 * 
 * • 36-55
 * 
 * • 55-100
 * @param {Number} [options.body.Over18] Filter ads by over 18 content: 0 or 1 — deny over 18 content, 2 — only over 18 content, 3 - allow all ads.
 * @param {String} [options.body.Keywords] Filter ads by keywords (delimited by keywords=music, commas).
 * @param {Boolean} [options.body.IsSizeRequired] If set true, the image size values (width and height) will be returned in html.
 * @param {Number} [options.body.Premium=0] Filter ads by premium status (0 – non- premium, 1 – premium only, 2 – both). Default value is 0.
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 */

/**
 * @class ATT.TTS <b>Introduction:</b>
 *
 * The Text to Speech API converts the original spoken text into audio content.
 *
 * <b>Description:</b>
 *
 * The Text To Speech API transcribes text into binary audio data and applies a male or female synthesized voice. The Speech API applies an API-specific lexicon and transcribes the original text into binary audio data. The original text may be represented in English or Spanish. The returned binary audio data may be represented in AMR or WAV audio formats.

 * 
 * <b>The TTS API provides the following method:</b>
 *
 *• textToSpeech
 */

/**
 * @method textToSpeech
 * Returns an audio file in a particular voice and language for the text that was sent.
 * @param {Object} options Specifies a JSON object that contains properties for the following parameters:
 * @param {String} options.accept Specifies the particular audio file type that has to be generated. The following audio types can be requested for audio generation: audio/amr, audio/amr-wb and audio/x-wav.
 * @param {String} options.contentType Specifies the format in which the content is being transmitted in the body. Following are the Content Types that are supported text/plain and application/ssml+xml.
 * @param {String} options.body Specifies the text content that needs to be converted to audio file.
 * @param {String} options.filePath Specifies the path where the audio file has to be stored after the text translation. (For the Android platform, the path should be in the following format: /mnt/sdcard/.../fileName.fileExtension).
 * @param {String} [options.xarg="VoiceName=crystal"] This parameter exposes the properties through which the audio file generation can have few variations like changing the audio voice character, tempo of the audio file and volume of the audio file when generated. Acceptable values for this property are
 *
 *• VoiceName
 *
 *• Tempo
 *
 *• Volume
 *
 *• AppId
 *
 *• OrgId
 *
 *• ClientApp
 *
 *• Client Version
 *
 *• Client Screen
 *
 * If <b>VoiceName</b> to be specified in particular then this property has to be updated with the preset voice characters.
 *
 *• mike
 *
 *• crystal
 *
 *• rosa
 *
 *• alberto
 *
 * @param {String} [options.accept="application/json"] Specifies the format of the audio file that by this method. These are following audio types are :audio/amr, audio/amr-wb and audio/x-wav.
 * 
 * The acceptable values for this parameter are:
 *
 *• audio/wav
 *
 *• audio/amr
 *
 *• audio/amr-wb
 *
 * @param {Function} success The callback function that is called when the method returns success.
 * @param {Function} error The callback function that is called when the method returns an error.
 * @return {Object} A JSON formatted object that contains the path of the audio file. The filepath returned with file name and extension is specified by the value of the accept parameter in the call to the textToSpeech method.
 *
 * <b>Example:</b>
 *
 * The following is an example for textToSpeech request method.
 *
 *		textToSpeech({
 *			'accept' : 'audio/wav',
 *			'contentType' : text/plain,
 *			'body':text,
 *			"filePath" : filePath,
 *			'xarg' : "VoiceName=crystal"
 *
 *		}, function(data) {
 *			// success CallBack
 *		}, function(error) {
 *		    //failure Callback
 *		});
 *       
 */

