Ext.data.JsonP.ATT_TTS({"parentMixins":[],"statics":{"css_var":[],"event":[],"css_mixin":[],"method":[],"cfg":[],"property":[]},"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/attPhoneGapPluginAPI.html#ATT-TTS' target='_blank'>attPhoneGapPluginAPI.js</a></div></pre><div class='doc-contents'><p><b>Introduction:</b></p>\n\n<p>The Text to Speech API converts the original spoken text into audio content.</p>\n\n<p><b>Description:</b></p>\n\n<p>The Text To Speech API transcribes text into binary audio data and applies a male or female synthesized voice. The Speech API applies an API-specific lexicon and transcribes the original text into binary audio data. The original text may be represented in English or Spanish. The returned binary audio data may be represented in AMR or WAV audio formats.</p>\n\n<p><b>The TTS API provides the following method:</b></p>\n\n<p>• textToSpeech</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-textToSpeech' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='ATT.TTS'>ATT.TTS</span><br/><a href='source/attPhoneGapPluginAPI.html#ATT-TTS-method-textToSpeech' target='_blank' class='view-source'>view source</a></div><a href='#!/api/ATT.TTS-method-textToSpeech' class='name expandable'>textToSpeech</a>( <span class='pre'>options, success, error</span> ) : Object</div><div class='description'><div class='short'>Returns an audio file in a particular voice and language for the text that was sent. ...</div><div class='long'><p>Returns an audio file in a particular voice and language for the text that was sent.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>options</span> : Object<div class='sub-desc'><p>Specifies a JSON object that contains properties for the following parameters:</p>\n<ul><li><span class='pre'>accept</span> : String<div class='sub-desc'><p>Specifies the particular audio file type that has to be generated. The following audio types can be requested for audio generation: audio/amr, audio/amr-wb and audio/x-wav.</p>\n</div></li><li><span class='pre'>contentType</span> : String<div class='sub-desc'><p>Specifies the format in which the content is being transmitted in the body. Following are the Content Types that are supported text/plain and application/ssml+xml.</p>\n</div></li><li><span class='pre'>body</span> : String<div class='sub-desc'><p>Specifies the text content that needs to be converted to audio file.</p>\n</div></li><li><span class='pre'>filePath</span> : String<div class='sub-desc'><p>Specifies the path where the audio file has to be stored after the text translation. (For the Android platform, the path should be in the following format: /mnt/sdcard/.../fileName.fileExtension).</p>\n</div></li><li><span class='pre'>xarg</span> : String (optional)<div class='sub-desc'><p>This parameter exposes the properties through which the audio file generation can have few variations like changing the audio voice character, tempo of the audio file and volume of the audio file when generated. Acceptable values for this property are</p>\n\n<p>• VoiceName</p>\n\n<p>• Tempo</p>\n\n<p>• Volume</p>\n\n<p>• AppId</p>\n\n<p>• OrgId</p>\n\n<p>• ClientApp</p>\n\n<p>• Client Version</p>\n\n<p>• Client Screen</p>\n\n<p>If <b>VoiceName</b> to be specified in particular then this property has to be updated with the preset voice characters.</p>\n\n<p>• mike</p>\n\n<p>• crystal</p>\n\n<p>• rosa</p>\n\n<p>• alberto</p>\n<p>Defaults to: <code>&quot;VoiceName=crystal&quot;</code></p></div></li><li><span class='pre'>accept</span> : String (optional)<div class='sub-desc'><p>Specifies the format of the audio file that by this method. These are following audio types are :audio/amr, audio/amr-wb and audio/x-wav.</p>\n\n<p>The acceptable values for this parameter are:</p>\n\n<p>• audio/wav</p>\n\n<p>• audio/amr</p>\n\n<p>• audio/amr-wb</p>\n<p>Defaults to: <code>&quot;application/json&quot;</code></p></div></li></ul></div></li><li><span class='pre'>success</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns success.</p>\n</div></li><li><span class='pre'>error</span> : Function<div class='sub-desc'><p>The callback function that is called when the method returns an error.</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>A JSON formatted object that contains the path of the audio file. The filepath returned with file name and extension is specified by the value of the accept parameter in the call to the textToSpeech method.</p>\n\n<p><b>Example:</b></p>\n\n<p>The following is an example for textToSpeech request method.</p>\n\n<pre><code>textToSpeech({\n    'accept' : 'audio/wav',\n    'contentType' : text/plain,\n    'body':text,\n    \"filePath\" : filePath,\n    'xarg' : \"VoiceName=crystal\"\n\n}, function(data) {\n    // success CallBack\n}, function(error) {\n    //failure Callback\n});\n</code></pre>\n</div></li></ul></div></div></div></div></div></div></div>","tagname":"class","inheritable":null,"singleton":false,"override":null,"html_meta":{},"mixins":[],"files":[{"href":"attPhoneGapPluginAPI.html#ATT-TTS","filename":"attPhoneGapPluginAPI.js"}],"linenr":1583,"members":{"css_var":[],"event":[],"css_mixin":[],"method":[{"tagname":"method","owner":"ATT.TTS","name":"textToSpeech","id":"method-textToSpeech","meta":{}}],"cfg":[],"property":[]},"alternateClassNames":[],"aliases":{},"inheritdoc":null,"component":false,"private":null,"subclasses":[],"name":"ATT.TTS","extends":null,"uses":[],"mixedInto":[],"superclasses":[],"id":"class-ATT.TTS","enum":null,"meta":{},"requires":[]});