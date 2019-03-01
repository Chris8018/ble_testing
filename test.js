// Discovery options match any devices advertising:
// . The standard heart rate service.
// . Both 16-bit service IDs 0x1802 and 0x1803.
// . A proprietary 128-bit UUID service c48e6067-5295-48d3-8d5c-0395f61792b1.
// . Devices with name "ExampleName".
// . Devices with name starting with "Prefix".
//
// And enables access to the battery service if devices
// include it, even if devices do not advertise that service.
// let options = {
//     filters: [
//         {services: ['battery_service']},
//         {services: [0x1802, 0x1803]},
//         {services: ['c48e6067-5295-48d3-8d5c-0395f61792b1']},
//         {name: 'CC2650 SensorTag'},
//         //{namePrefix: 'Prefix'}
//     ],
//     //optionalServices: ['battery_service']
// }
//
// navigator.bluetooth.requestDevice(options).then(function(device) {
//     console.log('Name: ' + device.name);
//     // Do something with the device.
// })
//     .catch(function(error) {
//         console.log("Something went wrong. " + error);
//     });

// navigator.bluetooth.requestDevice().then(
//     function (d) { console.log("Found ", d) },
//     function (e) { console.log("Error ", e) })

// navigator.bluetooth.requestDevice({filters: [{services: 'heart_rate'}, {name: 'VP2'}]})
//     .then(device => {
//         console.log('Connecting to GATT Server...', device.gatt.connect());
//         //return device.gatt.connect();
//     })
//     .then(server => {
//         console.log('Getting Service...', server.getPrimaryService(serviceUuid));
//         //return ;
//     })
//     // .then(service => {
//     //     console.log('Getting Characteristic...');
//     //     return service.getCharacteristic(characteristicUuid);
//     // })
//     // .then(characteristic => {
//     //     myCharacteristic = characteristic;
//     //     return myCharacteristic.startNotifications().then(_ => {
//     //         log('> Notifications started');
//     //         myCharacteristic.addEventListener('characteristicvaluechanged',
//     //             handleNotifications);
//     //     });
//     // })
//     .catch(error => {
//         log('Argh! ' + error);
//     });


//
// var _this;
// var state = {};
// var previousPose;
//
// class MyoWebBluetooth{
//     constructor(name){
//         _this = this;
//         this.name = name;
//         this.services = services;
//         this.characteristics = characteristics;
//
//         this.standardServer;
//     }
//
//     connect(){
//         return navigator.bluetooth.requestDevice({
//             filters: [
//                 {name: this.name},
//                 {
//                     services: [services.batteryService.uuid,
//                         services.imuDataService.uuid,
//                         services.controlService.uuid,
//                         services.emgDataService.uuid]
//                 }
//             ],
//             optionalServices: [services.classifierService.uuid]
//         })
//             .then(device => {
//                 console.log('Device discovered', device.name);
//                 return device.gatt.connect();
//             })
//             .then(server => {
//                 console.log('server device: '+ Object.keys(server.device));

// this.getServices([services.batteryService, services.controlService, services.emgDataService, services.imuDataService, services.classifierService], [characteristics.batteryLevelCharacteristic, characteristics.commandCharacteristic, characteristics.emgData0Characteristic, characteristics.imuDataCharacteristic, characteristics.classifierEventCharacteristic], server);
//         })
//         .catch(error => {console.log('error',error)})
// }

// getServices(requestedServices, requestedCharacteristics, server){
//     this.standardServer = server;
//
//     requestedServices.filter((service) => {
//         if(service.uuid == services.batteryService.uuid){
//             // No need to pass in all requested characteristics for the battery service as the battery level is the only characteristic available.
//             _this.getBatteryData(service, characteristics.batteryLevelCharacteristic, this.standardServer)
//         } else if(service.uuid == services.controlService.uuid){
//             _this.getControlService(requestedServices, requestedCharacteristics, this.standardServer);
//         }
//     })
// }
//
// getBatteryData(service, reqChar, server){
//     return server.getPrimaryService(service.uuid)
//         .then(service => {
//             console.log('getting battery service');
//             _this.getBatteryLevel(reqChar.uuid, service)
//         })
// }
//
// getBatteryLevel(characteristic, service){
//     return service.getCharacteristic(characteristic)
//         .then(char => {
//             console.log('getting battery level characteristic');
//             char.addEventListener('characteristicvaluechanged', _this.handleBatteryLevelChanged);
//             return char.readValue();
//         })
//         .then(value => {
//             let batteryLevel = value.getUint8(0);
//             console.log('> Battery Level is ' + batteryLevel + '%');
//             state.batteryLevel = batteryLevel;
//         })
//         .catch(error => {
//             console.log('Error: ', error);
//         })
// }
//
// getControlService(requestedServices, requestedCharacteristics, server){
//     let controlService = requestedServices.filter((service) => { return service.uuid == services.controlService.uuid});
//     let commandChar = requestedCharacteristics.filter((char) => {return char.uuid == characteristics.commandCharacteristic.uuid});
//
//     // Before having access to IMU, EMG and Pose data, we need to indicate to the Myo that we want to receive this data.
//     return server.getPrimaryService(controlService[0].uuid)
//         .then(service => {
//             console.log('getting service: ', controlService[0].name);
//             return service.getCharacteristic(commandChar[0].uuid);
//         })
//         .then(characteristic => {
//             console.log('getting characteristic: ', commandChar[0].name);
//             // return new Buffer([0x01,3,emg_mode,imu_mode,classifier_mode]);
//             // The values passed in the buffer indicate that we want to receive all data without restriction;
//             let commandValue = new Uint8Array([0x01,3,0x02,0x03,0x01]);
//             characteristic.writeValue(commandValue);
//         })
//         .then(_ => {
//             let IMUService = requestedServices.filter((service) => {return service.uuid == services.imuDataService.uuid});
//             let EMGService = requestedServices.filter((service) => {return service.uuid == services.emgDataService.uuid});
//             let classifierService = requestedServices.filter((service) => {return service.uuid == services.classifierService.uuid});
//
//             let IMUDataChar = requestedCharacteristics.filter((char) => {return char.uuid == characteristics.imuDataCharacteristic.uuid});
//             let EMGDataChar = requestedCharacteristics.filter((char) => {return char.uuid == characteristics.emgData0Characteristic.uuid});
//             let classifierEventChar = requestedCharacteristics.filter((char) => {return char.uuid == characteristics.classifierEventCharacteristic.uuid});
//
//             if(IMUService.length > 0){
//                 console.log('getting service: ', IMUService[0].name);
//                 _this.getIMUData(IMUService[0], IMUDataChar[0], server);
//             }
//             if(EMGService.length > 0){
//                 console.log('getting service: ', EMGService[0].name);
//                 _this.getEMGData(EMGService[0], EMGDataChar[0], server);
//             }
//             if(classifierService.length > 0){
//                 console.log('getting service: ', classifierService[0].name);
//                 _this.getClassifierData(classifierService[0], classifierEventChar[0], server);
//             }
//         })
//         .catch(error =>{
//             console.log('error: ', error);
//         })
// }

// handleBatteryLevelChanged(event){
//     let batteryLevel = event.target.value.getUint8(0);
//     state.batteryLevel = batteryLevel;
//
//     console.log('> Battery Level is ' + batteryLevel + '%');
//
//     _this.onStateChangeCallback(state);
// }
//
// handleIMUDataChanged(event){
//     //byteLength of ImuData DataView object is 20.
//     // imuData return {{orientation: {w: *, x: *, y: *, z: *}, accelerometer: Array, gyroscope: Array}}
//     let imuData = event.target.value;
//
//     let orientationW = event.target.value.getInt16(0) / 16384;
//     let orientationX = event.target.value.getInt16(2) / 16384;
//     let orientationY = event.target.value.getInt16(4) / 16384;
//     let orientationZ = event.target.value.getInt16(6) / 16384;
//
//     let accelerometerX = event.target.value.getInt16(8) / 2048;
//     let accelerometerY = event.target.value.getInt16(10) / 2048;
//     let accelerometerZ = event.target.value.getInt16(12) / 2048;
//
//     let gyroscopeX = event.target.value.getInt16(14) / 16;
//     let gyroscopeY = event.target.value.getInt16(16) / 16;
//     let gyroscopeZ = event.target.value.getInt16(18) / 16;
//
//     var data = {
//         orientation: {
//             x: orientationX,
//             y: orientationY,
//             z: orientationZ,
//             w: orientationW
//         },
//         accelerometer: {
//             x: accelerometerX,
//             y: accelerometerY,
//             z: accelerometerZ
//         },
//         gyroscope: {
//             x: gyroscopeX,
//             y: gyroscopeY,
//             z: gyroscopeZ
//         }
//     }
//
//     state = {
//         orientation: data.orientation,
//         accelerometer: data.accelerometer,
//         gyroscope: data.gyroscope
//     }
//
//     _this.onStateChangeCallback(state);
// }
//
// onStateChangeCallback() {}
//
// getIMUData(service, characteristic, server){
//     return server.getPrimaryService(service.uuid)
//         .then(newService => {
//             console.log('getting characteristic: ', characteristic.name);
//             return newService.getCharacteristic(characteristic.uuid)
//         })
//         .then(char => {
//             char.startNotifications().then(res => {
//                 char.addEventListener('characteristicvaluechanged', _this.handleIMUDataChanged);
//             })
//         })
// }
//
// getEMGData(service, characteristic, server){
//     return server.getPrimaryService(service.uuid)
//         .then(newService => {
//             console.log('getting characteristic: ', characteristic.name);
//             return newService.getCharacteristic(characteristic.uuid)
//         })
//         .then(char => {
//             char.startNotifications().then(res => {
//                 char.addEventListener('characteristicvaluechanged', _this.handleEMGDataChanged);
//             })
//         })
// }
//
// getClassifierData(service, characteristic, server){
//     return server.getPrimaryService(service.uuid)
//         .then(newService => {
//             console.log('getting characteristic: ', characteristic.name);
//             return newService.getCharacteristic(characteristic.uuid)
//         })
//         .then(char => {
//             char.startNotifications().then(res => {
//                 char.addEventListener('characteristicvaluechanged', _this.handlePoseChanged);
//             })
//         })
// }
//
// handlePoseChanged(event){
//     let eventReceived = event.target.value.getUint8(0);
//     let poseEventCode = event.target.value.getInt16(1) / 256;
//     let armSynced, armType, myoDirection, myoLocked;
//
//     let arm = event.target.value.getUint8(1);
//     let x_direction = event.target.value.getUint8(2);
//
//     switch(eventReceived){
//         case 1:
//             _this.eventArmSynced(arm, x_direction);
//             armSynced = true;
//             break;
//         case 2:
//             armSynced = false;
//             break;
//         case 3:
//             _this.getPoseEvent(poseEventCode);
//             break;
//         case 4:
//             myoLocked = false;
//             break;
//         case 5:
//             myoLocked = true;
//             break;
//         case 6:
//             armSynced = false;
//             break;
//     }
//
//     state.armSynced = armSynced;
//     state.myoLocked = myoLocked;
//
//     _this.onStateChangeCallback(state);
// }
//
// eventArmSynced(arm, x_direction){
//     armType = (arm == 1) ? 'right' : ((arm == 2) ? 'left' : 'unknown');
//     myoDirection = (x_direction == 1) ? 'wrist' : ((x_direction == 2) ? 'elbow' : 'unknown');
//
//     state.armType = armType;
//     state.myoDirection = myoDirection;
//
//     _this.onStateChangeCallback(state);
// }
//
// getPoseEvent(code){
//     let pose;
//     previousPose = pose;
//     switch(code){
//         case 1:
//             pose = 'fist';
//             break;
//         case 2:
//             pose = 'wave in';
//             break;
//         case 3:
//             pose = 'wave out';
//             break;
//         case 4:
//             pose = 'fingers spread';
//             break;
//         case 5:
//             pose = 'double tap';
//             break;
//         case 255:
//             pose = 'unknown';
//             break;
//     }
//
//     if(previousPose !== pose){
//         state.pose = pose;
//         _this.onStateChangeCallback(state);
//     }
// }
//
// handleEMGDataChanged(event){
//     //byteLength of ImuData DataView object is 20.
//     // imuData return {{orientation: {w: *, x: *, y: *, z: *}, accelerometer: Array, gyroscope: Array}}
//     let emgData = event.target.value;
//
//     let sample1 = [
//         emgData.getInt8(0),
//         emgData.getInt8(1),
//         emgData.getInt8(2),
//         emgData.getInt8(3),
//         emgData.getInt8(4),
//         emgData.getInt8(5),
//         emgData.getInt8(6),
//         emgData.getInt8(7)
//     ]
//
//     let sample2 = [
//         emgData.getInt8(8),
//         emgData.getInt8(9),
//         emgData.getInt8(10),
//         emgData.getInt8(11),
//         emgData.getInt8(12),
//         emgData.getInt8(13),
//         emgData.getInt8(14),
//         emgData.getInt8(15)
//     ]
//
//     state.emgData = sample1;
//
//     _this.onStateChangeCallback(state);
// }
//
// onStateChange(callback){
//     _this.onStateChangeCallback = callback;
// }
//}
//
// window.onload = function(){
//     let button = document.getElementById("connect");
//     let message = document.getElementById("message");
//
//     if ( 'bluetooth' in navigator === false ) {
//         button.style.display = 'none';
//         message.innerHTML = 'This browser doesn\'t support the <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API" target="_blank">Web Bluetooth API</a> :(';
}

//let renderer, scene, camera;
// var mesh;
//
// let accelerometerData, gyroscopeData, poseData, emgData,
//     orientationData, batteryLevel, armType, armSynced, myoDirection, myoLocked;
//
// var axis = new THREE.Vector3();
// var quaternion = new THREE.Quaternion();
// var quaternionHome = new THREE.Quaternion();
// var initialised = false;
// var timeout = null;
//
// button.onclick = function(e){
//     var myoController = new MyoWebBluetooth("Myo");
//     myoController.connect();
//
//     myoController.onStateChange(function(state){
//
//         if(state.batteryLevel){
//             batteryLevel = state.batteryLevel + '%';
//         }
//
//         accelerometerData = state.accelerometer;
//         gyroscopeData = state.gyroscope;
//         poseData = state.pose;
//         emgData = state.emgData;
//         orientationData = state.orientation;
//         armType = state.armType;
//         armSynced = state.armSynced;
//         myoDirection = state.myoDirection;
//         myoLocked = state.myoLocked;
//
//         displayData();

//***
// Orientation data coming back from the Myo is very sensitive.
// Not very useful to display on 3D cube as it is, but tried anyway.
//***

if(mesh !== undefined){
  var angle = Math.sqrt( orientationData.x * orientationData.x + orientationData.y * orientationData.y + orientationData.z * orientationData.z );

	if ( angle > 0 ) {
		axis.set( orientationData.x, orientationData.y, orientationData.z )
		axis.multiplyScalar( 1 / angle );
		quaternion.setFromAxisAngle( axis, angle );

		// if ( initialised === false ) {
		// 	quaternionHome.copy( quaternion );
		// 	quaternionHome.inverse();
		// 	initialised = true;
		// }
	} else {
		quaternion.set( 0, 0, 0, 1 );
	}

  // mesh.quaternion.copy( quaternionHome );
	mesh.quaternion.multiply( quaternion );
}
});
}

// init();
// render();

    function init(){
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.001, 10 );

        renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementsByClassName('container')[0].appendChild( renderer.domElement );

        var loader = new THREE.JSONLoader()
        loader.load('myo.json', function(geometry){
          var material = new THREE.MeshPhongMaterial( { color: 0x888899, shininess: 15, side: THREE.DoubleSide } );
        		mesh = new THREE.Mesh( geometry, material );
            mesh.rotation.x = 0.5;
            mesh.scale.set(0.5, 0.5, 0.5);
        		scene.add( mesh );
        })

        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshPhongMaterial({color: 0x888899, shininess: 15, side: THREE.DoubleSide });
        mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = 0.5;
        scene.add(mesh);

        var light = new THREE.HemisphereLight( 0xddddff, 0x808080, 0.7 );
        light.position.set( 0, 1, 0 );
        scene.add( light );

        var light = new THREE.DirectionalLight( 0xffffff, 0.6 );
        light.position.set( 1, 1, 1 );
        scene.add( light );

        var light = new THREE.DirectionalLight( 0xffffff, 0.4 );
        light.position.set( 1, -1, 1 );
        scene.add( light );

        camera.position.z = 5;
    }

    function render(){
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    function displayData(){
        if(batteryLevel){
            var batteryLevelDiv = document.getElementsByClassName('battery-data')[0];
            batteryLevelDiv.innerHTML = batteryLevel;
        }

        if(armType){
            var armTypeDiv = document.getElementsByClassName('arm-type-data')[0];
            armTypeDiv.innerHTML = armType;
        }

        if(armSynced){
            var armSyncedDiv = document.getElementsByClassName('arm-synced-data')[0];
            armSyncedDiv.innerHTML = armSynced;
        }

        if(myoDirection){
            var myoDirectionDiv = document.getElementsByClassName('myo-direction-data')[0];
            myoDirectionDiv.innerHTML = myoDirection;
        }

        if(myoLocked){
            var myoLockedDiv = document.getElementsByClassName('myo-locked-data')[0];
            myoLockedDiv.innerHTML = myoLocked;
        }

        if(poseData){
            var poseDiv = document.getElementsByClassName('pose-data')[0];
            poseDiv.innerHTML = poseData;

            var poseImage = document.getElementsByClassName('pose-image')[0];

            switch(poseData){
                case 'fist':
                    poseImage.src = "images/fist.jpg";
                    break;
                case 'wave out':
                    poseImage.src = "images/wave-out.jpg";
                    break;
                case 'wave in':
                    poseImage.src = "images/wave-in.jpg";
                    break;
                case 'double tap':
                    poseImage.src = "images/double-tap.jpg";
                    break;
                case 'fingers spread':
                    poseImage.src = "images/fingers-spread.jpg";
                    break;
            }
        }

        if(orientationData){
            var orientationXDiv = document.getElementsByClassName('orientation-x-data')[0];
            orientationXDiv.innerHTML = orientationData.x;

            var orientationYDiv = document.getElementsByClassName('orientation-y-data')[0];
            orientationYDiv.innerHTML = orientationData.y;

            var orientationZDiv = document.getElementsByClassName('orientation-z-data')[0];
            orientationZDiv.innerHTML = orientationData.z;
        }

        if(accelerometerData){
            var accelerometerXDiv = document.getElementsByClassName('accelerometer-x-data')[0];
            accelerometerXDiv.innerHTML = accelerometerData.x;

            var accelerometerYDiv = document.getElementsByClassName('accelerometer-y-data')[0];
            accelerometerYDiv.innerHTML = accelerometerData.y;

            var accelerometerZDiv = document.getElementsByClassName('accelerometer-z-data')[0];
            accelerometerZDiv.innerHTML = accelerometerData.z;
        }

        if(gyroscopeData){
            var gyroscopeXDiv = document.getElementsByClassName('gyroscope-x-data')[0];
            gyroscopeXDiv.innerHTML = gyroscopeData.x;

            var gyroscopeYDiv = document.getElementsByClassName('gyroscope-y-data')[0];
            gyroscopeYDiv.innerHTML = gyroscopeData.y;

            var gyroscopeZDiv = document.getElementsByClassName('gyroscope-z-data')[0];
            gyroscopeZDiv.innerHTML = gyroscopeData.z;
        }
    }

}

