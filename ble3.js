var bDevice;
var vServer;
var bService;

function onScanButtonClick() {
    let options = {
        filters: [
            {name: 'CC2650 SensorTag'}
        ],
        optionalServices: ['f000aa00-0451-4000-b000-000000000000', '0000180a-0000-1000-8000-00805f9b34fb']
    };

    navigator.bluetooth.requestDevice(options)
        .then(device => {
            bDevice = device;
            return device.gatt.connect();
        })
        .then(server => {
            bService = server;
            console.log('Try to get services')
            // return server.getPrimaryService('0000180a-0000-1000-8000-00805f9b34fb');
            return server.getPrimaryService('f000aa00-0451-4000-b000-000000000000');
            
        })
        .then(service => {
            bService = service;
            // service.getCharacteristic('00002a24-0000-1000-8000-00805f9b34fb')
            // .then(char => {
            //     return char.readValue();
            // })
            // .then(values => {
            //     let temp = '';
            //     for (var i = 0; i < 16; i++) {
            //         temp += String.fromCharCode(values.getUint8(i));
            //     }
            //     console.log(temp);
            // })

            // console.log('Enable Temperature scanning');
            // service.getCharacteristic('f000aa02-0451-4000-b000-000000000000')
            // .then(charConfig => {
            //     var value = new Uint8Array([0x01]);
            //     charConfig.writeValue(value);
            // });

            // console.log('Retrieve Temperature Data');
            // service.getCharacteristic('f000aa01-0451-4000-b000-000000000000')
            // .then(charData => {
            //     charData.startNotifications().then(_ => {
            //         charData.addEventListener('characteristicvaluechanged', self.handleTempChange);
            //     });
            // });
            return bService.getCharacteristic('f000aa02-0451-4000-b000-000000000000');
        })
        .then(charConfig => {
            var value = new Uint8Array([0x01]);
            return charConfig.writeValue(value);
        })
        .then(_ => {
            return bService.getCharacteristic('f000aa01-0451-4000-b000-000000000000');
        })
        .then(charData => {
            charData.startNotifications().then(_ => {
                charData.addEventListener('characteristicvaluechanged', self.handleTempChange);
            });
        })
        // .then(char => {
        //     return char.readValue();
        // })
        // .then(values => {
        //     let temp = '';
        //     for (var i = 0; i < 16; i++) {
        //         temp += String.fromCharCode(values.getUint8(i));
        //     }
        //     console.log(temp);
        // })
        .catch(error => {
            console.trace('Error: ' + error);
        });

}

function handleTempChange(event) {
    let raw_data = event.target.value;

    let temp1 = raw_data.getUint8(3).toString(16);
    temp1 = temp1.length < 2 ? '0' + temp1 : temp1;

    let temp2 = raw_data.getUint8(2).toString(16);
    temp2 = temp2.length < 2 ? '0' + temp2 : temp2;

    let raw_ambient_temp = parseInt('0x' + temp1 + temp2, 16);
    let ambient_temp_int = raw_ambient_temp >> 2 & 0x3FFF;
    let resultC = ambient_temp_int * 0.03125;

    console.log('Temperature: ' + resultC);
}