package com.att.developer.phonegap.plugin.services;

import java.util.Map;

import org.apache.cordova.api.PluginResult;

public interface Service {
	public PluginResult performAction(Map<String, String> args);
}
