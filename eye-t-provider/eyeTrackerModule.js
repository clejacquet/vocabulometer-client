const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const log4js = require("log4js");
const gazejs = require("gazejs");

const log = log4js.getLogger("GazeJSTest");
const eyeTracker = gazejs.createEyeTracker(gazejs.TOBII_GAZE_SDK);//or gazejs.SR_EYELINK_SDK

let left, right; // left.x left.y etc, positions of the gaze

const listener = {
	onConnect:function(){
		log.info("Library version: "+eyeTracker.getLibraryVersion());
		log.info("Model name: "+eyeTracker.getModelName());

		eyeTracker.start();
		console.log("OnConnect");
	},
	onStart:function(){
		console.log("OnStart");
	},
	onStop:function(){
		console.log("OnStop");
	},
	onError:function(error){
		console.log(error);
	},
	onGazeData:function(gazeData){
		left = gazeData.left;
		right = gazeData.right;
	}
};

eyeTracker.setListener(listener);
eyeTracker.connect();

//When request from the client
io.on('connection', function (socket) {
    socket.on('updateRequest', function (msg) {
    		if (left && right) {
					io.emit('coordinates', left.x, left.y, right.x, right.y);
				}
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});


//
// //--- GazeJs ----
// //---------------
//
// var callbackTypes = require("gazejs/tobii/callback_types");
// var bridjs = require("bridjs");
// var errorCode = new bridjs.NativeValue.uint32();
// var ErrorCodes = require("gazejs/tobii/error_codes");
// var TobiiGaze = require("gazejs/tobii/gaze");
// var gaze = new TobiiGaze();
// var dataTypes = require("gazejs/tobii/data_types"), log4js = require("log4js");
// var log = log4js.getLogger("GazeJSTest");
// var modelUrl = new Buffer(dataTypes.Constants.DEVICE_INFO_MAX_MODEL_LENGTH);
// var eyeTracker, eventLoopErrorCode = new bridjs.NativeValue.uint32();
//
// var onConnectCallback, onStopTrackingCallback, onDeviceInfoCallback, onStartTrackingCallback,
//     onGazeDataCallback;
//
// var checkError = function (errorCode) {
//     var value;
//
//     if (typeof (errorCode) === "number") {
//         value = errorCode;
//     } else {
//         value = errorCode.get();
//     }
//
//     if (value !== ErrorCodes.SUCCESS) {
//         throw new GazeException("Gaze error :" + gaze.getErrorMessage(value));
//     }
// }
//
//
// function startTracking() {
//     var deviceInfo = new dataTypes.DeviceInfo();
//
//     gaze.connect(eyeTracker, bridjs.byPointer(errorCode));
//     checkError(errorCode);
//
//     gaze.getDeviceInfo(eyeTracker, bridjs.byPointer(deviceInfo), bridjs.byPointer(errorCode));
//     checkError(errorCode);
//
//     log.info("OnDeviceInof, serial number = " + bridjs.toString(deviceInfo.serialNumber));
//
//     gaze.startTracking(eyeTracker, onGazeDataCallback, bridjs.byPointer(errorCode), null);
//     checkError(errorCode);
//
//     //tobiigaze_start_tracking_async(eye_tracker, &start_tracking_callback, &on_gaze_data, 0);
// }
//
// function stopTracking() {
//     gaze.stopTracking(eyeTracker, bridjs.byPointer(errorCode));
//     checkError(errorCode);
//
//     gaze.disconnect(eyeTracker);
//
//     gaze.breakEventLoop((eyeTracker));
// }
//
// function destroy() {
//     log.info("Destroy eyeTracker: " + eyeTracker);
//
//     if (eyeTracker) {
//         gaze.destroy((eyeTracker));
//     }
//
//     //config.free();
//
//     log.info("done");
//
//     process.exit();
// }
//
// try {
//     //config.init(bridjs.byPointer(errorCode));
//     // gazejs.checkError(errorCode);
//     gaze.getConnectedEyeTracker(modelUrl, dataTypes.Constants.DEVICE_INFO_MAX_MODEL_LENGTH,
//         bridjs.byPointer(errorCode));
//     checkError(errorCode);
//     //config.getDefaultEyeTrackerUrl(modelUrl, dataTypes.Constants.DEVICE_INFO_MAX_MODEL_LENGTH,
//     //        bridjs.byPointer(errorCode));
//     //gazejs.checkError(errorCode);
//     //modelUrl.write("--auto\0");
//     log.info("Model name: " + bridjs.toString(modelUrl));
//
//     log.info("Natvie library version: " + gaze.getVersion());
//
//     eyeTracker = gaze.create(modelUrl, bridjs.byPointer(errorCode));
//     checkError(errorCode);
//
//     gaze.setLogging("log.txt", dataTypes.LogLevel.OFF, bridjs.byPointer(errorCode));
//     checkError(errorCode);
//     log.info("Start event loop");
//     bridjs.async(gaze).runEventLoop((eyeTracker),
//         bridjs.byPointer(eventLoopErrorCode), function () {
//             checkError(eventLoopErrorCode);
//             log.info("gaze.runEventLoop() returned");
//
//             destroy();
//         });
//
//     /*Delay execution to workaround strange crash issue*/
//     setTimeout(function () {
//         gaze.registerError((eyeTracker), onErrorCallback, null);
//         startTracking();
//     }, 16);
// } catch (e) {
//     log.error(e);
//
//     destroy();
// }
//
//
// onErrorCallback = bridjs.newCallback(callbackTypes.AsyncCallback, function (errorCode, userData) {
//     log.info("OnError: " + gaze.getErrorMessage(errorCode));
//
//     setTimeout(destroy, 0);
// });
//
//
// onGazeDataCallback = bridjs.newCallback(callbackTypes.Listener, function (gazeData, extensions, userData) {
//     left = gazeData.left.gazePointOnDisplayNormalized, right = gazeData.right.gazePointOnDisplayNormalized;
// });
// //-----------------------
//
//
// app.get('/', function (req, res) {
//     res.sendfile('index.html');
// });
//
// //When request from the client
// io.on('connection', function (socket) {
//     socket.on('updateRequest', function (msg) {
//         io.emit('coordinates', left.x, left.y, right.x, right.y);
//     });
// });
//
// http.listen(3000, function () {
//     console.log('listening on *:3000');
// });
