/**
 * 
 */
package com.att.developer.phonegap.plugin;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.att.developer.AttException;
import com.att.developer.http.AttRequest;
import com.att.developer.http.AttResponse;
import com.att.developer.http.AttResponseFile;

public class AttPlugin extends CordovaPlugin {
	
	private static Set<String> possibleActions;
	
	private static boolean initilaized = false;
	
	private static void init() {
		if(initilaized) return;
		
		possibleActions = new HashSet<String>();
		possibleActions.addAll(Arrays.asList(new String[] {
			"sendMMS",
			"sendMessage",
			"speechToText",
			"textToSpeech",
			"sendWAPPush"
		}));
		
		initilaized = true;
	}
	
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
		init();
		
		if(!possibleActions.contains(action)) {
			return false;
		}
		
		final JSONObject params = args.getJSONObject(0);
		
		cordova.getThreadPool().execute(new Runnable() { //Prevents blocking the WebCore Thread
            public void run() {
            	PluginResult pr;
            	try {
            		AttResponse res = AttRequest.send(params);
            		if(params.has(AttRequest.JSON_RES_FILE_PATH)) {
            			pr = getFileResult((AttResponseFile) res);
            		} else {
            			pr = new PluginResult(PluginResult.Status.OK, res.getResponseString());
            		}
            	} catch(Exception e) {
            		callbackContext.error(e.getMessage());
            		return;
            	}
            	
            	//needed to format the response correctly and prevent throwing bug
            	//It stringifies the JSON string the way phonegap expects it
            	//PluginResult pr = new PluginResult(PluginResult.Status.OK, responseString);
            	callbackContext.success(pr.getMessage());
            }
		});
		
		return true;
	}
	
	private static PluginResult getFileResult(AttResponseFile fileRes) throws AttException {
		JSONObject respObj = new JSONObject();
		
		try { respObj.put("filePath", fileRes.getFile().getAbsolutePath()); }
		catch(Exception e) { throw new AttException(e); }
		
		return new PluginResult(PluginResult.Status.OK, respObj);
	}
}
