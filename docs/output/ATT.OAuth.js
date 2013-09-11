Ext.data.JsonP.ATT_OAuth({"parentMixins":[],"statics":{"css_var":[],"event":[],"css_mixin":[],"method":[],"cfg":[],"property":[]},"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/attPhoneGapPluginAPI.html#ATT-OAuth' target='_blank'>attPhoneGapPluginAPI.js</a></div></pre><div class='doc-contents'><p><b>Introduction:</b></p>\n\n<p>The OAuth 2.0 Authentication Management API provides access to the AT&amp;T OAuth service. The OAuth service provides a safe and secure way for AT&amp;T subscribers to access AT&amp;T network resources through a third-party application without the risk of compromising security. The OAuth service ensures that secure, sensitive, and private AT&amp;T subscription details are not exposed to the third-party application.</p>\n\n<p>OAuth 2.0 Authentication Management is an open standard recognized as providing a strong protection to clients and applications. The OAuth service provides developers with a security model that allows them to obtain an authorization code and an access token. By acquiring an authorization code, a resource owner has authorized an application to access a protected resource on their behalf. The receipt of an access token enables an application to access a protected resource on behalf of a resource owner via the AT&amp;T network.</p>\n\n<p><b>Description:</b></p>\n\n<p>The OAuth 2.0 Authentication Management API allows third party applications access to the private resources of subscribers without requiring the end-user to provide credentials (such as username and password) to the third party application. An application that is implemented with OAuth, provides a closer and more secure integration with the AT&amp;T API Platform.</p>\n\n<p><b>The OAuth 2.0 Authentication Management API provides the following methods:</b></p>\n\n<p>1) authorize</p>\n\n<p>2) obtainEndUserAuthorization</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-authorize' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ATT.OAuth'>ATT.OAuth</span><br/><a href='source/attPhoneGapPluginAPI.html#ATT-OAuth-method-authorize' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ATT.OAuth-method-authorize' class='name expandable'>authorize</a>( <span class='pre'>accessKey, secretKey, scope, grantType, oAuthCode</span> )</div><div class='description'><div class='short'>Authorizes an application so that it may use specific AT&amp;T APIs. ...</div><div class='long'><p>Authorizes an application so that it may use specific AT&amp;T APIs.</p>\n\n<p>This method must be called directly using the following ATT namespace: <b>Att.authorize('apiKey','secretKey','scope','grantType','oAuthCode')</b></p>\n\n<p>When authorizing an application for use with the Location and In-app Messaging from Mobile Number APIs, the user must send their access key, secret key, scope, grantType, and OAuthCode.</p>\n\n<p><b>Syntax</b></p>\n\n<p>authorize( accessKey, secretKey, scope, grantType, oAuthCode )</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>accessKey</span> : String<div class='sub-desc'><p>Specifies the API key that is assigned to the application when the developer creates an application account at <a href=\"https://devconnect-api.att.com/\">https://devconnect-api.att.com/.</a></p>\n</div></li><li><span class='pre'>secretKey</span> : String<div class='sub-desc'><p>Specifies the secret key that is assigned to the application when the developer creates an application account at <a href=\"https://devconnect-api.att.com/\">https://devconnect-api.att.com/.</a></p>\n</div></li><li><span class='pre'>scope</span> : String<div class='sub-desc'><p>Specifies a comma separated list of authScopes enumeration values that specify which APIs the app requires access to.</p>\n</div></li><li><span class='pre'>grantType</span> : String<div class='sub-desc'><p>Specifies the mechanism used to obtain the access token. The acceptable values for this parameter are:</p>\n\n<p>authorization_code: Use when Web-server client applications use the authorization code to obtain the access token.</p>\n\n<p>client_credentials: Use when autonomous client applications use the API key and its secret to obtain the access token.</p>\n\n<p>refresh_token: Use when client applications of both types mentioned above use refresh_token to obtain a new access token after the initial access token expires.</p>\n</div></li><li><span class='pre'>oAuthCode</span> : String<div class='sub-desc'><p>Specifies the authorization code. The oAuthCode is returned in the response object of the obtainEndUserAuthorization method. Currently, this parameter is required only when using the Location and In-app Messaging from Mobile Number APIs.\n   <b>Example:</b></p>\n\n<p>The following is an example of the authorize method.</p>\n\n<pre><code>         Att.authorize('apiKey','secretKey','scope','grantType','oAuthCode');\n</code></pre>\n</div></li></ul></div></div></div><div id='method-obtainEndUserAuthorization' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ATT.OAuth'>ATT.OAuth</span><br/><a href='source/attPhoneGapPluginAPI.html#ATT-OAuth-method-obtainEndUserAuthorization' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ATT.OAuth-method-obtainEndUserAuthorization' class='name expandable'>obtainEndUserAuthorization</a>( <span class='pre'>options, success, error</span> ) : String</div><div class='description'><div class='short'>Obtains information required to obtain an OAuth access token. ...</div><div class='long'><p>Obtains information required to obtain an OAuth access token. This method is the initial operation in the OAuth call flow. It is invoked by an application that requires subscriber authorization in order to obtain an OAuth access token. The application’s request for an OAuth access token is forwarded by redirecting the subscriber’s browser to the AT&amp;T Gateway OAuth Server.</p>\n\n<p><b>Important</b> Currently, this method is necessary and supported only for applications attempting to consume the following APIs:</p>\n\n<p>• Location API</p>\n\n<p>• In-app Messaging from Mobile Number API</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>Specifies a JSON object that contains properties for the following parameters:</p>\n<ul><li><span class='pre'>clientId</span> : String<div class='sub-desc'><p>Specifies the API key that is assigned to the application when the developer creates an application account at <a href=\"https://devconnect-api.att.com/\">https://devconnect-api.att.com/.</a></p>\n</div></li><li><span class='pre'>scope</span> : String<div class='sub-desc'><p>Specifies the services for which the application is requesting the end-user to provide consent. The value of the scope parameter is a comma delimited list that contains one or more of the following values that represent the services that are in scope.</p>\n\n<p>• Terminal Location – TL.</p>\n\n<p>• In-app Messaging from Mobile Number – IMMN</p>\n</div></li><li><span class='pre'>redirectUrl</span> : String (optional)<div class='sub-desc'><p>Specifies the URL where the subscriber’s browser is redirected following completion of the authorization process. If this parameter is not specified, the AT&amp;T Gateway uses the value of the provided OAuth Redirect URL that is specified by the developer in the AT&amp;T API Platform console when the application is registered.</p>\n</div></li></ul></div></li><li><span class='pre'>success</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns success.</p>\n</div></li><li><span class='pre'>error</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns an error.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Specifies a query parameter that is included with the redirect_uri parameter of the authorize method in the original OAuth request.</p>\n\n<p><strong>Example:</strong></p>\n\n<p>The following is an example of the obtainEndUserAuthorization method.</p>\n\n<pre><code> obtainEndUserAuthorization({\n      'clientId' : 'API Key',\n      'scope' : 'scope values',\n     'redirectUrl' : 'redirect url'\n },function(data) {\n\n    success Callback\n\n }, function(error) {\n\n     error Callback\n\n });\n</code></pre>\n</div></li></ul></div></div></div></div></div></div></div>","tagname":"class","inheritable":null,"singleton":false,"override":null,"html_meta":{},"mixins":[],"files":[{"href":"attPhoneGapPluginAPI.html#ATT-OAuth","filename":"attPhoneGapPluginAPI.js"}],"linenr":710,"members":{"css_var":[],"event":[],"css_mixin":[],"method":[{"tagname":"method","owner":"ATT.OAuth","name":"authorize","id":"method-authorize","meta":{}},{"tagname":"method","owner":"ATT.OAuth","name":"obtainEndUserAuthorization","id":"method-obtainEndUserAuthorization","meta":{}}],"cfg":[],"property":[]},"alternateClassNames":[],"aliases":{},"inheritdoc":null,"component":false,"private":null,"subclasses":[],"name":"ATT.OAuth","extends":null,"uses":[],"mixedInto":[],"superclasses":[],"id":"class-ATT.OAuth","enum":null,"meta":{},"requires":[]});