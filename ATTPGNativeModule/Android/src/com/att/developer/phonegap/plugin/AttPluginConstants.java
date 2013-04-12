package com.att.developer.phonegap.plugin;

public interface AttPluginConstants {
	public final String SPEECH_URI = "/rest/1/SpeechToText";
	public final String MMS_URI = "/rest/mms/2/messaging/outbox";
	public final String IMMN_MMS_URI = "/rest/1/MyMessages";

	public final String ACTION_SPEECH = "speechToText";
	public final String ACTION_MMS = "sendMMS";
	public final String ACTION_IMMN_MMS = "sendMessage";
	public final String ACTION_MMS_STATUS = "mmsstatus";
	public final String ACTION_WAP = "sendWAPPush";
	public final String ACTION_TTS = "textToSpeech";

	public final String ARG_JSON_OBJ = "json";
	public final String ARG_URL = "host";
	public final String ARG_TOKEN = "token";
	public final String ARG_FILENAME = "fileName";
	public final String ARG_FILETYPE = "fileType";
	public final String ARG_FILEPATH = "filePath";
	public final String ARG_BODY = "body";
	public final String ARG_ADDRESS = "address";
	public final String ARG_DATA = "data";
	public final String ARG_SUBJECT = "subject";
	public final String ARG_TEXT = "text";
	public final String ARG_PRIORITY = "priority";
	public final String ARG_ATTACHMENTS = "attachments";
	public final String ARG_MMS_ID = "mmsId";
	public final String ARG_HEADER_ACCEPT = "headerAccept";
	public final String ARG_XARG = "xarg";
	public final String ARG_HEADER_CONTENT_TYPE = "headerContentType";
	public final String ARG_HEADER_CONTENT_LENGTH = "headerContentLength";
	public final String ARG_HEADER_XSPEECH_CONTEXT = "headerXSpeechContent";
	public final String ARG_HEADER_TRANSFER_ENCODING = "headerTransferEncoding";
	public final String ARG_CONTENT_LANGUAGE = "contentLanguage";
	
	public final String VAL_TRANSFER_ENCODING_CHUNKED = "chunked";

	public final String VAL_CONTENT_TYPE_WAV = "audio/wav";
	public final String VAL_CONTENT_TYPE_AMR = "audio/amr";

	public final String ERR_INV_ACT_CODE = "PLAT001";
	public final String ERR_INV_ACT_MSG = "Invalid Action Provided";

	public final String ERR_INV_PARAM_CODE = "PLAT002";
	public final String ERR_INV_PARAM_MSG = "Invalid Parameters Provided";

	public final String ERR_INV_PROCESS_CODE = "PLAT003";
	public final String ERR_INV_PROCESS_MSG = "Processing error occured";

	public final String ERR_FILE_NA_CODE = "PLAT004";
	public final String ERR_FILE_NA_MSG = "File not found";

	public final String ERR_PROCESS_AUDIO_CODE = "PLAT005";
	public final String ERR_PROCESS_AUDIO_MSG = "Unable to process audio file";

	public final String ERR_INV_STATUS_CODE = "PLAT006";
	public final String ERR_INV_STATUS_MSG = "Status Code not 200/201";

	public final String ERR_PROCESS_REQ_CODE = "PLAT007";
	public final String ERR_PROCESS_REQ_MSG = "Error while executing request";
}
