package com.att.developer.phonegap.activity;

import org.apache.cordova.DroidGap;
import android.os.Bundle;

public class AttPhoneGapActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
}
