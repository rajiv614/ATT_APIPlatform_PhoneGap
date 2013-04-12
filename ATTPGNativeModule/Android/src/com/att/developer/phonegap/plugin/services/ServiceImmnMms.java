/**
 * 
 */
package com.att.developer.phonegap.plugin.services;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.URL;
import java.util.Date;
import java.util.Map;

import javax.net.ssl.HttpsURLConnection;

import org.apache.cordova.api.PluginResult;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.database.Cursor;
import android.net.Uri;
import android.provider.MediaStore;
import android.util.Base64;

import com.att.developer.phonegap.plugin.AttPluginConstants;


public class ServiceImmnMms implements Service {

	/**
	 * @property {String} SEPARATOR
	 */
	public static final String SEPERATOR = "--";

	private static Activity activity;
	
	@SuppressWarnings("static-access")
	public ServiceImmnMms(Activity activity)
	{
		this.activity=activity;
	}

	/**
	 *  A method to invoke the service related to IMMN MMS functionality.
	 *  @param args A map containing the arguments passed from the javascript
	 *  @return PluginResult
	 */
	public PluginResult performAction(Map<String, String> args) {

		String accessToken = args.get(AttPluginConstants.ARG_TOKEN);
		System.out.println(args.get(AttPluginConstants.ARG_ATTACHMENTS));
		String attachmentJson = args.get(AttPluginConstants.ARG_ATTACHMENTS).substring(1, args.get(AttPluginConstants.ARG_ATTACHMENTS).length()-1);
		System.out.println(attachmentJson);
		
		String[] filePaths=null,fileTypes=null,fileNames=null,attachments=null,fileObjects=null;
		
		try {
			JSONObject js=null;
			
			if("".equalsIgnoreCase(attachmentJson.trim()))
			{
				fileNames=new String[]{};
				fileTypes=new String[]{};
				filePaths=new String[]{};
				fileObjects=new String[]{};
			}
			else
			{
				attachments=attachmentJson.split("\\},");
				
				fileNames=new String[attachments.length];
				fileTypes=new String[attachments.length];
				filePaths=new String[attachments.length];
				fileObjects= new String[attachments.length];
				
				for(int i=0;i<attachments.length;i++)
				{
					js=new JSONObject(attachments[i]+"}");
					fileNames[i]=((String)js.get("fileName"));
					fileTypes[i]=((String)js.get("fileType"));
					filePaths[i]=((String)js.get("filePath"));
					if(js.has("fileObject"))
					{
						fileObjects[i]=((String)js.get("fileObject"));
					}
				}
				
			}
			
			
		} catch (JSONException e) {
			e.printStackTrace();
			return new PluginResult(PluginResult.Status.ERROR, e.getMessage());
		}


		String result = "";

		try
		{
			result = sendMms(args.get(AttPluginConstants.ARG_URL), accessToken, args.get(AttPluginConstants.ARG_BODY), fileTypes, fileNames,
					filePaths, fileObjects, args.get(AttPluginConstants.ARG_HEADER_ACCEPT),args.get(AttPluginConstants.ARG_HEADER_CONTENT_TYPE));
			System.out.println(result);
		}
		catch (Exception e) {
			e.printStackTrace();
			return new PluginResult(PluginResult.Status.OK,result);
		}
		

		return new PluginResult(PluginResult.Status.OK,result);
	}

	/**
	 * This method sends a MMS Message
	 * 
	 * MMS allows for the delivery of different file types. Please see the
	 * developer documentation for an updated list:
	 * https://developer.att.com/developer/tierNpage.jsp?passedItemId=2400428
	 * 
	 * @param host
	 *            The domain name (or ip address) and port the request is
	 *            submitted to. Example https://beta-api.att.com
	 * @param accessToken
	 *            The Token representing the logged in user
	 * @param body
	 *            The body containing the Address, Subject and Text
	 * @param fileType
	 *            The type of the file
	 * @param fileName
	 *            The name of the file
	 * @param filePaths
	 * 			  The path of the file
	 * @param fileObjects
	 * 			  The Base64 encoded file object string
	 * @param headerAccept
	 *            The Accept parameter
	 * @param contentType
	 *            Content-Type of the header
	 * @return response in String format
	 * @method sendMms
	 * @static
	 */
	public static String sendMms(String host, String accessToken, String body,
			String[] fileType, String[] fileName, String[] filePaths, String[] fileObjects,
			String headerAccept, String contentType) {
		String theReturn = null;

		URL url;
		try {
			url = new URL(host);
			String boundary = getBoundary();

			HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
			conn.setDoOutput(true);
			conn.setDoInput(true);
			conn.setRequestMethod("POST");
			conn.setRequestProperty("Authorization", accessToken);
			conn.setRequestProperty("content-type", contentType);
			conn.setRequestProperty("accept", headerAccept);
			conn.setRequestProperty(
					"content-type",
					"multipart/form-data; type=\""+contentType+"\"; start=\"<start>\"; boundary=\""
							+ boundary + "\"");

			OutputStreamWriter wr = new OutputStreamWriter(
					conn.getOutputStream());
			String content = buildBeginMMSMessage(boundary, body, fileName,
					fileType, filePaths, fileObjects, contentType);

			wr.write(content);
			wr.write(buildEndMMSMessage(boundary));
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
		} catch (Exception e) {

			theReturn = e.getMessage();
		}

		return theReturn;
	}

	private static String buildBeginMMSMessage(String boundary, String body,
			String[] fileName, String[] type, String[] filePaths, String[] fileObjects,
			String contentType) {
		
		StringBuffer theReturn = new StringBuffer("--").append(boundary)
				.append("\r\n");
		theReturn.append("Content-Type: application/json; charset=UTF-8").append("\r\n");
		theReturn.append("Content-ID: <start>").append("\r\n");
		theReturn
				.append("Content-Disposition: form-data; name=\"root-fields\"")
				.append("\r\n");
		theReturn.append("\r\n");
		
		theReturn.append(body).append("\r\n");
			
		String thisLine = null;

		for (int i = 0, j = fileName.length; i < j; i++) {
			System.out.println("FileName: " + fileName[i] + "\t FileType: "
					+ type[i]);

			theReturn.append("\r\n--").append(boundary).append("\r\n");
			theReturn.append("Content-Type: ").append(type[i]).append("\r\n");
			theReturn.append("Content-ID: <").append(fileName[i]).append(">")
					.append("\r\n");
			theReturn.append("Content-Transfer-Encoding: base64").append("\r\n");
			theReturn.append("Content-Disposition: form-data; name=\"")
					.append(fileName[i]).append("\";filename=\"").append(fileName[i]).append("\"").append("\r\n");
			theReturn.append("\r\n");

			if(fileObjects[i] !=null && !"".equalsIgnoreCase(fileObjects[i]))
			{
				theReturn.append(fileObjects[i]);
			}
			else
			{
				try {
					
					if(filePaths[i] != null && filePaths[i].startsWith("content:") )
					{
						Uri uri= Uri.parse(filePaths[i]);
						filePaths[i]=convertMediaUriToPath(uri);
						System.out.println("File Path after convertMediaUriToPath : "+filePaths[i]);
					}
					FileInputStream mFileInputStream = new FileInputStream(
							filePaths[i]);
					ByteArrayOutputStream bos = new ByteArrayOutputStream();
					byte[] b = new byte[1024];
					int bytesRead = 0;
					while ((bytesRead = mFileInputStream.read(b)) != -1) {
						bos.write(b, 0, bytesRead);
					}
					byte[] ba = bos.toByteArray();
					thisLine = Base64.encodeToString(ba, 0);
					theReturn.append(thisLine);
					mFileInputStream.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
			
		}
	//	System.out.println(theReturn);
		return theReturn.toString();
	}

	private static String convertMediaUriToPath(Uri uri) {
	    String [] proj={MediaStore.Images.Media.DATA};
	    Cursor cursor = activity.getContentResolver().query(uri, proj,  null, null, null);
	    int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
	    cursor.moveToFirst();
	    String path = cursor.getString(column_index); 
	    cursor.close();
	    return path;
	}
	
	private static String buildEndMMSMessage(String boundary) {
		StringBuffer theReturn = new StringBuffer();
		theReturn.append("\n");
		theReturn.append("--").append(boundary).append("--");
		return theReturn.toString();
	}

	private static String getBoundary() {
		return "----=_Part_0_1" + Math.round((Math.random() * 10000000)) + "."
				+ new Date().getTime() * 1000;

	}

	@SuppressWarnings("unused")
	private static String combine(String[] s, String glue) {
		int k = s.length;
		if (k == 0)
			return null;
		StringBuilder out = new StringBuilder();
		out.append(s[0]);
		for (int x = 1; x < k; ++x)
			out.append(glue).append(s[x]);
		return out.toString();
	}

}
