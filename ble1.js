// let optionalServices = document.getElementById('optionalServices').value
//     .split(/, ?/).map(s => s.startsWith('0x') ? parseInt(s) : s)
//     .filter(s => s && BluetoothUUID.getService);
//

var bluetoothDevice;

function onScanButtonClick() {
    //let options = {filters: []};
    let options = {acceptAllDevices: true};

    // let filterService = document.querySelector('#service').value;
    // if (filterService.startsWith('0x')) {
    //     filterService = parseInt(filterService);
    // }
    // if (filterService) {
    //     options.filters.push({services: [filterService]});
    // }
    //
    // let filterName = document.querySelector('#name').value;
    // if (filterName) {
    //     options.filters.push({name: filterName});
    // }
    //
    // let filterNamePrefix = document.querySelector('#namePrefix').value;
    // if (filterNamePrefix) {
    //     options.filters.push({namePrefix: filterNamePrefix});
    // }
    //options.filters.push({name: "CC2650 SensorTag"});
    bluetoothDevice = null;
    console.log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice(options)
        .then(device => {
            bluetoothDevice = device;
            bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
            //return connect();
            return bluetoothDevice.gatt.connect();
        })
        .then(server => {
            console.log('Try getting humidity services')
            return server.getPrimaryServices('f000aa20-0451-4000-b000-000000000000');
        })
        .catch(error => {
            /*
            Uncaught (in promise) ReferenceError: log is not defined
    at navigator.bluetooth.requestDevice.then.catch.error (ble1_battery.js:38)
             */
            console.log('Argh! ' + error);
        });
}

function connect() {
    console.log('Connecting to Bluetooth Device...');
    return bluetoothDevice.gatt.connect()
        .then(server => {
            console.log('> Bluetooth Device connected');
        });
}

function onDisconnectButtonClick() {
    if (!bluetoothDevice) {
        return;
    }
    console.log('Disconnecting from Bluetooth Device...');
    if (bluetoothDevice.gatt.connected) {
        bluetoothDevice.gatt.disconnect();
    } else {
        console.log('> Bluetooth Device is already disconnected');
    }
}

function onDisconnected(event) {
    // Object event.target is Bluetooth Device getting disconnected.
    console.log('> Bluetooth Device disconnected');
}


function onReconnectButtonClick() {
    if (!bluetoothDevice) {
        return;
    }
    if (bluetoothDevice.gatt.connected) {
        console.log('> Bluetooth Device is already connected');
        return;
    }
    connect()
        .catch(error => {
            console.log('Argh! ' + error);
        });
}

// function onButtonClick() {
//     log('Requesting Bluetooth Device...');
//     navigator.bluetooth.requestDevice(
//       {filters: [{services: ['battery_service']}]})
//     .then(device => {
//       log('Connecting to GATT Server...');
//       return device.gatt.connect();
//     })
//     .then(server => {
//       log('Getting Battery Service...');
//       return server.getPrimaryService('battery_service');
//     })
//     .then(service => {
//       log('Getting Battery Level Characteristic...');
//       return service.getCharacteristic('battery_level');
//     })
//     .then(characteristic => {
//       log('Reading Battery Level...');
//       return characteristic.readValue();
//     })
//     .then(value => {
//       let batteryLevel = value.getUint8(0);
//       log('> Battery Level is ' + batteryLevel + '%');
//     })
//     .catch(error => {
//       log('Argh! ' + error);
//     });
//   }
