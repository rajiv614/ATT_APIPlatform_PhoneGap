package com.att.developer.phonegap.plugin.services;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.Map;

import org.apache.cordova.api.PluginResult;
import com.att.developer.phonegap.plugin.AttPluginConstants;

public class ServiceWap implements Service{

	/**
	 *  A method to invoke the service related to WAP Push functionality.
	 *  @param args A map containing the arguments passed from the javascript
	 *  @return PluginResult
	 */
	public PluginResult performAction(Map<String, String> args) {
		
		String host = args.get(AttPluginConstants.ARG_URL);
		String accessToken = args.get(AttPluginConstants.ARG_TOKEN);
		String body = args.get(AttPluginConstants.ARG_BODY);
		String xml = args.get(AttPluginConstants.ARG_DATA);
		String contentType = args.get(AttPluginConstants.ARG_HEADER_CONTENT_TYPE);
		String accept = args.get(AttPluginConstants.ARG_HEADER_ACCEPT);
		
		String response =null;
		try{
			response = wapPush(host, accessToken, body, xml, contentType,
					accept);
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return new PluginResult(PluginResult.Status.ERROR,response);
		}
		
		return new PluginResult(PluginResult.Status.OK,response);
	}

	private static String getBoundary() {
		return "----=_Part_0_1" + Math.round((Math.random() * 10000000)) + "."
				+ new Date().getTime() * 1000;

	}

	/**
	 * This method pushes a WAP Message
	 * 
	 * @param host
	 *            The domain name (or ip address) and port the request is
	 *            submitted to. Example https://beta-api.att.com
	 * @param accessToken
	 *            The Token representing the logged-in user
	 * @param body
	 *            The body containing the address of the recipient
	 * @param xml
	 *            The message to push
	 * @param contentType
	 *            Content-Type of the header
	 * @param accept
	 *            The Accept parameter
	 *           
	 * @return will return a response String of the WAP Push functionality
	 * @method wapPush
	 * @static
	 */
	public static String wapPush(String host, String accessToken, String body,
			String xml, String contentType, String accept) {
		String theReturn = null;
		URL url = null;
		String boundary = getBoundary();

		try {
			url = new URL(host);
			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", accessToken);
			conn.setRequestProperty("content-type", contentType);
			conn.setRequestProperty("accept", accept);
			conn.setRequestProperty("content-type",
					"multipart/form-data; type=\"" + contentType
							+ "\"; start=\"<part0Phonegap>\"; boundary=\""
							+ boundary + "\"");

			OutputStreamWriter wr = new OutputStreamWriter(
					conn.getOutputStream());
			String request = buildWAPMessage(boundary, body, xml, contentType);
			wr.write(request);
			wr.flush();
			wr.close();

			StringBuffer response = new StringBuffer();

			if (conn.getResponseCode() < 400) {
				BufferedReader is = new BufferedReader(new InputStreamReader(
						conn.getInputStream()));
				String str;
				while (null != ((str = is.readLine()))) {
					response.append(str);
				}
				is.close();
			} else {
				BufferedReader is = new BufferedReader(new InputStreamReader(
						conn.getErrorStream()));
				String str;
				while (null != ((str = is.readLine()))) {
					response.append(str);
				}
				is.close();
			}
			theReturn = response.toString();
			System.out.println("******Response is : "+theReturn);
		} catch (Exception e) {
			theReturn = e.getMessage();
		}
		return theReturn;
	}

	private static String buildWAPMessage(String boundary, String body,
			String message, String contentType) {


		StringBuffer theReturn = new StringBuffer("--").append(boundary)
				.append("\n");
		theReturn.append("Content-Type: " + contentType).append("\n");
		theReturn.append("Content-ID: <part0@sencha.com>").append("\n");
		theReturn
				.append("Content-Disposition: form-data; name=\"root-fields\"")
				.append("\n");
		theReturn.append("\n");
		
		theReturn.append(body).append("\n");
		
		theReturn.append("--").append(boundary).append("\n");
		theReturn.append("Content-Type: text/xml").append("\n");
		theReturn.append("Content-ID: <part2@sencha.com>").append("\n");
		theReturn.append("\n");
		theReturn
				.append("Content-Disposition: form-data; name=\"PushContent\"")
				.append("\n");
		theReturn.append("Content-Type: text/vnd.wap.si").append("\n");
		theReturn.append("Content-Length: 12").append("\n");
		theReturn.append("X-Wap-Application-Id: x-wap-application:wml.ua")
				.append("\n");
		theReturn.append("\n");
		theReturn.append(message);
		theReturn.append("\n");
		theReturn.append("--").append(boundary).append("--");
		return theReturn.toString();
	}

}

