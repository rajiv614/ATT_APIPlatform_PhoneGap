#!/bin/bash -x

TARGET="ATTiOSPhonegapPlugin"
TARGET_FILE="lib${TARGET}"
FILE_NAME=$TARGET_FILE

#Build the simulator package for i386 architecture
/Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild -project ATTiOSPhonegapPlugin.xcodeproj -target $TARGET -sdk "iphonesimulator" -configuration "Release" clean build
mv output_library/${TARGET_FILE}.a output_library/${FILE_NAME}_simulator.a

#Build the iOS package for arm6, arm7, arm7s architectures
/Applications/Xcode.app/Contents/Developer/usr/bin/xcodebuild -project ATTiOSPhonegapPlugin.xcodeproj -target $TARGET -sdk "iphoneos" -configuration "Release" clean build
mv output_library/${TARGET_FILE}.a output_library/${FILE_NAME}_device.a

#Use lipo to combine both builds
cd output_library
lipo -create -output "${FILE_NAME}.a" "${FILE_NAME}_simulator.a" "${FILE_NAME}_device.a"

#Remove the specific builds
rm "${FILE_NAME}_simulator.a" "${FILE_NAME}_device.a"