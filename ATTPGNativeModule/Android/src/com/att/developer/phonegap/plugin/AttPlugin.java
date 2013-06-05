/**
 * 
 */
package com.att.developer.phonegap.plugin;

import java.util.WeakHashMap;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.att.developer.phonegap.plugin.services.Service;
import com.att.developer.phonegap.plugin.services.ServiceImmnMms;
import com.att.developer.phonegap.plugin.services.ServiceMms;
import com.att.developer.phonegap.plugin.services.ServiceSpeech;
import com.att.developer.phonegap.plugin.services.ServiceTTS;

public class AttPlugin extends CordovaPlugin {

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.apache.cordova.api.Plugin#execute(java.lang.String,
	 * org.json.JSONArray, java.lang.String)
	 */
	/**
	 * The method invoked from the corresponding javascript file using cordova.exec method
	 * @param action Action Type invoked from javascript
	 * @param args Arguments passed from the javascript
	 * @param callbackContext
	 * @return boolean Returning false results in a "MethodNotFound" error.
	 */
	@Override
	public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
		try {
			final Service service = getService(action);
			if (service != null) {
				final WeakHashMap<String, String> preparedArgs = prepareArguments(action, args);
				System.out.println("prepareArguments : "+preparedArgs);
				cordova.getThreadPool().execute(new Runnable() { //Prevents blocking the WebCore Thread
		            public void run() {
						PluginResult response = service.performAction(preparedArgs);
						if(PluginResult.Status.OK.ordinal() == response.getStatus()) {
							callbackContext.success(response.getMessage());
						} else {
							callbackContext.error(response.getMessage());
						}
		            }
				});
			} else {
				callbackContext.error(AttPluginUtils.prepareMessage(AttPluginConstants.ERR_INV_ACT_CODE, AttPluginConstants.ERR_INV_ACT_MSG));
				return false;
			}
		} catch (JSONException e) {
			callbackContext.error(AttPluginUtils.prepareMessage(AttPluginConstants.ERR_INV_PARAM_CODE, AttPluginConstants.ERR_INV_PARAM_MSG+" : "+e.getMessage()));
			e.printStackTrace();
		} catch (Exception ex) {
			callbackContext.error(AttPluginUtils.prepareMessage(AttPluginConstants.ERR_INV_PROCESS_CODE, AttPluginConstants.ERR_INV_PROCESS_MSG+" : "+ex.getMessage()));
			ex.printStackTrace();
		}

		return true;
	}

	/**
	 * Returns the implementation as per the type of action being invoked
	 * @param action
	 * @return Service
	 */
	private Service getService(String action) {
		if (action.equalsIgnoreCase(AttPluginConstants.ACTION_SPEECH)) {
			return new ServiceSpeech();
		} else if (action.equalsIgnoreCase(AttPluginConstants.ACTION_MMS)) {
			return new ServiceMms(this.cordova.getActivity());
		} else if (action.equalsIgnoreCase(AttPluginConstants.ACTION_IMMN_MMS)) {
			return new ServiceImmnMms(this.cordova.getActivity());
		} else if (action.equalsIgnoreCase(AttPluginConstants.ACTION_TTS))
			return new ServiceTTS();

		return null;
	}

	private WeakHashMap<String, String> prepareArguments(String action, JSONArray args) throws JSONException, Exception {

		WeakHashMap<String, String> argValues = new WeakHashMap<String, String>(5);
		try {
			if(AttPluginConstants.ACTION_SPEECH.equals(action))
			{
				JSONObject json=args.getJSONObject(0);
				argValues.put(AttPluginConstants.ARG_URL, json.getString("url"));
				argValues.put(AttPluginConstants.ARG_FILEPATH, json.getString("filePath"));
				argValues.put(AttPluginConstants.ARG_TOKEN, json.getString("token"));
				argValues.put(AttPluginConstants.ARG_HEADER_ACCEPT, json.getString("accept"));
				String headerContentType = json.getString("contentType");
				argValues.put(AttPluginConstants.ARG_HEADER_CONTENT_TYPE, headerContentType);
				argValues.put(AttPluginConstants.ARG_CONTENT_LANGUAGE, json.getString("contentLanguage"));
				argValues.put(AttPluginConstants.ARG_HEADER_XSPEECH_CONTEXT, json.getString("XSpeechContext"));
				argValues.put(AttPluginConstants.ARG_XARG, json.getString("xarg"));
				if (!"".equals(json.getString("contentLength")) && (headerContentType != null && !(AttPluginConstants.VAL_CONTENT_TYPE_WAV.equals(headerContentType) || AttPluginConstants.VAL_CONTENT_TYPE_AMR.equals(headerContentType)))) {
					argValues.put(AttPluginConstants.ARG_HEADER_CONTENT_LENGTH, json.getString("contentLength"));
				}
				if (!"".equals(json.getString("transferEncoding"))) {
					argValues.put(AttPluginConstants.ARG_HEADER_TRANSFER_ENCODING, json.getString("transferEncoding"));
				}
			}
			else if(AttPluginConstants.ACTION_MMS.equals(action))
			{
				JSONObject json=args.getJSONObject(0);
				
				argValues.put(AttPluginConstants.ARG_URL, json.getString("url"));
				argValues.put(AttPluginConstants.ARG_TOKEN, json.getString("accessToken"));
				argValues.put(AttPluginConstants.ARG_HEADER_ACCEPT, json.getString("accept"));
				argValues.put(AttPluginConstants.ARG_HEADER_CONTENT_TYPE, json.getString("contentType"));
				argValues.put(AttPluginConstants.ARG_BODY,json.getString("body"));
				argValues.put(AttPluginConstants.ARG_ATTACHMENTS,json.getString("attachments"));
			}
			else if(AttPluginConstants.ACTION_MMS_STATUS.equals(action))
			{
				argValues.put(AttPluginConstants.ARG_URL, args.getString(0));
				argValues.put(AttPluginConstants.ARG_FILEPATH, args.getString(1));
				argValues.put(AttPluginConstants.ARG_TOKEN, args.getString(2));
				argValues.put(AttPluginConstants.ARG_HEADER_ACCEPT, args.getString(3));
				argValues.put(AttPluginConstants.ARG_HEADER_CONTENT_TYPE, args.getString(4));
				argValues.put(AttPluginConstants.ARG_MMS_ID,args.getString(5));
			}
			else if(AttPluginConstants.ACTION_IMMN_MMS.equals(action))
			{
				JSONObject json=args.getJSONObject(0);
				
				argValues.put(AttPluginConstants.ARG_URL, json.getString("url"));
				argValues.put(AttPluginConstants.ARG_TOKEN, json.getString("accessToken"));
				argValues.put(AttPluginConstants.ARG_HEADER_ACCEPT, json.getString("accept"));
				argValues.put(AttPluginConstants.ARG_HEADER_CONTENT_TYPE, json.getString("contentType"));
				argValues.put(AttPluginConstants.ARG_BODY,json.getString("body"));
				argValues.put(AttPluginConstants.ARG_ATTACHMENTS,json.getString("attachments"));
			} 
			else if(AttPluginConstants.ACTION_TTS.equals(action))
			{
				JSONObject json=args.getJSONObject(0);
				
				argValues.put(AttPluginConstants.ARG_URL, json.getString("url"));
				argValues.put(AttPluginConstants.ARG_TOKEN, json.getString("token"));
				argValues.put(AttPluginConstants.ARG_HEADER_ACCEPT, json.getString("accept"));
				argValues.put(AttPluginConstants.ARG_HEADER_CONTENT_TYPE, json.getString("contentType"));
				argValues.put(AttPluginConstants.ARG_BODY,json.getString("body"));
				argValues.put(AttPluginConstants.ARG_XARG, json.getString("xarg"));
				argValues.put(AttPluginConstants.ARG_FILEPATH, json.getString("filePath"));
			}
		} catch (JSONException e) {
			throw e;
		} catch (Exception ex) {
			throw ex;
		}

		return argValues;
	}

}
