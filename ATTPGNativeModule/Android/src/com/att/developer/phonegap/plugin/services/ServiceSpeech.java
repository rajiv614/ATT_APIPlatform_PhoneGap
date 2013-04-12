/**
 * 
 */
package com.att.developer.phonegap.plugin.services;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Map;

import org.apache.cordova.api.PluginResult;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import com.att.developer.phonegap.plugin.AttPluginConstants;
import com.att.developer.phonegap.plugin.AttPluginUtils;

public class ServiceSpeech implements Service {

	/**
	 *  A method to invoke the service related to Speech To Text functionality.
	 *  @param args A map containing the arguments passed from the javascript
	 *  @return PluginResult
	 */
	public PluginResult performAction(Map<String, String> args) {
		File file = null;
		try {
			System.out.println("FilePath : "+args.get(AttPluginConstants.ARG_FILEPATH));
			file = AttPluginUtils.getFile(args.get(AttPluginConstants.ARG_FILEPATH));

		} catch (FileNotFoundException e) {
			e.printStackTrace();
			return new PluginResult(PluginResult.Status.ERROR, AttPluginUtils.prepareMessage(AttPluginConstants.ERR_FILE_NA_CODE, AttPluginConstants.ERR_FILE_NA_MSG));
		} catch (Exception ex) {
			ex.printStackTrace();
			return new PluginResult(PluginResult.Status.ERROR, AttPluginUtils.prepareMessage(AttPluginConstants.ERR_PROCESS_AUDIO_CODE, AttPluginConstants.ERR_PROCESS_AUDIO_MSG));
		}

		// Http Processing
		DefaultHttpClient httpclient = new DefaultHttpClient();

		boolean isChunked=false;
		String transferEncoding=args.get(AttPluginConstants.ARG_HEADER_TRANSFER_ENCODING);
		if(transferEncoding!=null && transferEncoding.equalsIgnoreCase(AttPluginConstants.VAL_TRANSFER_ENCODING_CHUNKED))
		{
			isChunked=true;
		}
		
		HttpPost httppost = AttPluginUtils.prepareRequest(file, args.get(AttPluginConstants.ARG_URL),isChunked);

		httppost.addHeader("Authorization", args.get(AttPluginConstants.ARG_TOKEN));
		httppost.addHeader("Accept", args.get(AttPluginConstants.ARG_HEADER_ACCEPT));

		if (args.containsKey(AttPluginConstants.ARG_HEADER_CONTENT_TYPE)) {
			httppost.addHeader("Content-Type", args.get(AttPluginConstants.ARG_HEADER_CONTENT_TYPE));
		}

		if (args.containsKey(AttPluginConstants.ARG_HEADER_XSPEECH_CONTEXT)) {
			httppost.addHeader("X-SpeechContext", args.get(AttPluginConstants.ARG_HEADER_XSPEECH_CONTEXT));
		}
		
		if(args.get(AttPluginConstants.ARG_HEADER_XSPEECH_CONTEXT).equalsIgnoreCase("Generic")){
			if (args.containsKey(AttPluginConstants.ARG_CONTENT_LANGUAGE)) {
				httppost.addHeader("Content-Language", args.get(AttPluginConstants.ARG_CONTENT_LANGUAGE));
			}
		}else{
			if(args.containsKey(AttPluginConstants.ARG_XARG)){
				httppost.addHeader("X-Arg", args.get(AttPluginConstants.ARG_XARG));
			}
		}

		if (args.containsKey(AttPluginConstants.ARG_HEADER_CONTENT_LENGTH)) {
			httppost.addHeader("Content-Length", args.get(AttPluginConstants.ARG_HEADER_CONTENT_LENGTH));
		}

		if (args.containsKey(AttPluginConstants.ARG_HEADER_TRANSFER_ENCODING)) {
			httppost.addHeader("Transfer-Encoding", args.get(AttPluginConstants.ARG_HEADER_TRANSFER_ENCODING));
		}
		
		String result = null;
		try {
			result = AttPluginUtils.processResponse(httpclient.execute(httppost));
			System.out.println("result : "+result);
		} catch (Exception e) {
			e.printStackTrace();
			String message = null;
			String code = null;
			if (e.equals(AttPluginConstants.ERR_INV_STATUS_MSG)) {
				code = AttPluginConstants.ERR_INV_STATUS_CODE;
				message = AttPluginConstants.ERR_INV_STATUS_MSG;
			} else {
				code = AttPluginConstants.ERR_PROCESS_REQ_CODE;
				message = AttPluginConstants.ERR_PROCESS_REQ_MSG;
			}
			return new PluginResult(PluginResult.Status.ERROR, AttPluginUtils.prepareMessage(code, message));
		} finally {
			args.clear();
			args = null;
		}

		return new PluginResult(PluginResult.Status.OK, result);
	}
}
