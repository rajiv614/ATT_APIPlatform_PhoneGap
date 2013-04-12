/**
 * 
 */
package com.att.developer.phonegap.plugin;

import java.io.File;
import java.io.FileNotFoundException;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.FileEntity;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

/**
 *This is a utility class containing the common helper methods required by the Plugins
 * 
 */
public class AttPluginUtils {
	public static JSONObject prepareMessage(String code, String message) {
		JSONObject returnVal = new JSONObject();
		try {
			returnVal.put(code, message);
		} catch (JSONException e) {
			e.printStackTrace();
			System.out.println("Unable to prepare return message");
		}

		return returnVal;
	}

	/**
	 * Method to fetch and return the File Object from the File Name.
	 * @param fileName
	 * @return File
	 * @throws FileNotFoundException
	 */
	public static File getFile(String fileName) throws FileNotFoundException {
		// File Processing
		File file = new File(fileName);

		if (!file.exists()) {
			System.out.println("File not found, Path: " + file.getAbsolutePath());

			throw new FileNotFoundException();

		} else {
			System.out.println("File Found, Path: " + file.getAbsolutePath());
		}

		return file;
	}

	/**
	 * Method to initialize and prepare an HttpPost object
	 * @param file
	 * @param url
	 * @param chunked
	 * @return HttpPost
	 */
	public static HttpPost prepareRequest(File file, String url,boolean chunked) {
		HttpPost post = new HttpPost(url);

		FileEntity reqEntity = new FileEntity(file, "binary/octet-stream");
		reqEntity.setContentType("binary/octet-stream");
		reqEntity.setChunked(chunked);
		post.setEntity(reqEntity);

		return post;
	}

	/**
	 * Method to process the response and return the result in a readable format
	 * @param response
	 * @return String
	 * @throws Exception
	 */
	public static String processResponse(HttpResponse response) throws Exception {
		HttpEntity resEntity = response.getEntity();
		String result = EntityUtils.toString(resEntity);
		return result.toString();
	}
}
