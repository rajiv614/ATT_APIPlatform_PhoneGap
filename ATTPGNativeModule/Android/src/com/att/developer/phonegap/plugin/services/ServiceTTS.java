/**
 * 
 */
package com.att.developer.phonegap.plugin.services;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.FileOutputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;

import org.apache.cordova.api.PluginResult;
import org.json.JSONObject;

import com.att.developer.phonegap.plugin.AttPluginConstants;

public class ServiceTTS implements Service {

	/**
	 *  A method to invoke the service related to Speech To Text functionality.
	 *  @param args A map containing the arguments passed from the javascript
	 *  @return PluginResult
	 */
	public PluginResult performAction(Map<String, String> args) {

		StringBuffer response = new StringBuffer();
		String host = args.get(AttPluginConstants.ARG_URL);
		String token = args.get(AttPluginConstants.ARG_TOKEN);
		String body = args.get(AttPluginConstants.ARG_BODY);
		String contentType = args.get(AttPluginConstants.ARG_HEADER_CONTENT_TYPE);
		String accept = args.get(AttPluginConstants.ARG_HEADER_ACCEPT);
		String xarg = args.get(AttPluginConstants.ARG_XARG);
		String filePath = args.get(AttPluginConstants.ARG_FILEPATH);
		System.out.println("FilePath : " + filePath);
		
		try{
			URL url = null;
			int nBuffSize = 1024, nRes = 1;
			try {
				url = new URL(host);
				HttpURLConnection conn = (HttpURLConnection) url.openConnection();
				conn.setDoOutput(true);
				conn.setDoInput(true);
				conn.setRequestMethod("POST");
				conn.setRequestProperty("Authorization", token);
				conn.setRequestProperty("content-type", contentType);
				conn.setRequestProperty("accept", accept);
				conn.setRequestProperty("body", body);
				conn.setRequestProperty("X-Arg", xarg);

				OutputStreamWriter outStream = new OutputStreamWriter(
						conn.getOutputStream());
				outStream.write(body);
				outStream.flush();
				outStream.close();

				int responseCode = conn.getResponseCode();
				if (responseCode < 400) {
					
					System.out.println("Response Code is < 400");
					BufferedInputStream is = new BufferedInputStream(conn.getInputStream());
					FileOutputStream out = new FileOutputStream(filePath, false);
					byte[] binaryBody = new byte[nBuffSize];
					//while((nRes = is.read(binaryBody, 0, nBuffSize)) != -1){
					while((nRes = is.read(binaryBody)) != -1){
						System.out.println("Iam able to read the binary data + nRes : " + nRes);
						out.write(binaryBody, 0, nRes);
					}
	                out.flush();
	                out.close();
					is.close();
					response.append("Resp Code : " + conn.getResponseCode() + 
							" Resp Message : " + conn.getResponseMessage());
					JSONObject json = new JSONObject();
					json.put("response", response.toString());
					json.put("filePath", filePath);
					return new PluginResult(PluginResult.Status.OK,json);
					
				} else {
					System.out.println("Response Code is > 400");
					BufferedReader is = new BufferedReader(new InputStreamReader(
							conn.getErrorStream()));
					String str;
					while (null != ((str = is.readLine()))) {
						response.append(str);
					}
					is.close();
					return new PluginResult(PluginResult.Status.ERROR,response.toString());
				}
			} catch (Exception e) {
				System.out.println("Erro in writing binary data to file, Err Code - " + e.getMessage() + " ,Err Message - " + e.getMessage());
				return new PluginResult(PluginResult.Status.ERROR,e.getMessage());
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return new PluginResult(PluginResult.Status.ERROR,response.toString());
		}
	}
}