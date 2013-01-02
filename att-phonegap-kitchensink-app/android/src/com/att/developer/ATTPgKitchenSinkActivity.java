package com.att.developer;

//import org.apache.cordova.DroidGap;
import android.os.Bundle;
import android.app.Activity;
import org.apache.cordova.*;

public class ATTPgKitchenSinkActivity extends DroidGap {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.setIntegerProperty("splashscreen", R.drawable.splash_droid);
        super.loadUrl("file:///android_asset/www/index.html");
    }
}
