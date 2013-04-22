Native plugin implementation for Android and IOS projects are available here.

Incase of updating the library, below are the steps required to generate the fat static lib.

Below are the commands that is used to generate the fat static library, that can be used
to build applications for both iphone simulator and device.

1. In terminal go to the phonegap plugin project
2. /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild -project ATTiOSPhonegapPlugin.xcodeproj -target "ATTiOSPhonegapPlugin" -sdk "iphonesimulator" -configuration "Release" clean build
3. /Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild -project ATTiOSPhonegapPlugin.xcodeproj -target "ATTiOSPhonegapPlugin" -sdk "iphoneos" -configuration "Release" clean build
4. use the lipo command to combine the simulator(i386 architecture) and iphone(armv6 armv7 armv7s architectures) to a single library
5. lipo -create -output "libATTiOSPhonegapPlugin.a" "libATTiOSPhonegapPlugin_simulator.a" "libATTiOSPhonegapPlugin_device.a"

Add that library to your application.