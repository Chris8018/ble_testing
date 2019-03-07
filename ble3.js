function onScanButtonClick() {
    let options = {
        acceptAllDevices: true,
        optionalServices: ['f000aa00-0451-4000-b000-000000000000']
    };

    navigator.bluetooth.requestDevice(options)
        .then(device => {
            return device.gatt.connect();
        })
        .then(server => {
            console.log('Try to get services')
            return server.getPrimaryService('f000aa00-0451-4000-b000-000000000000');
        })
        .then(service => {
            console.log('Enable Temperature scanning');
            service.getCharacteristic('f000aa02-0451-4000-b000-000000000000').then(charConfig => {
                var value = new Uint8Array([0x01]);
                charConfig.writeValue(value);
            })
            .catch(error => {
                console.log('Error: ' + error)
            });

            console.log('Retrieve Temperature Data');
            service.getCharacteristic('f000aa01-0451-4000-b000-000000000000')
            .then(charData => {
                charData.startNotifications().then(_ => {
                    charData.addEventListener('characteristicvaluechanged', handleTempChange);
                })
                .catch(error => {
                    console.log('Error: ' + error)
                });
            })
            .catch(error => {
                console.log('Error: ' + error)
            });
        })
        .catch(error => {
            console.log('Error: ' + error);
        });

        function handleTempChange(event) {
            let raw_data = event.target.value;
            //console.log(raw_data);
    
            let temp1 = raw_data.getUint8(3).toString(16);
            temp1 = temp1.length < 2 ? '0' + temp1 : temp1;
    
            let temp2 = raw_data.getUint8(2).toString(16);
            temp2 = temp2.length < 2 ? '0' + temp2 : temp2;
    
            let raw_ambient_temp = parseInt('0x' + temp1 + temp2, 16);
            let ambient_temp_int = raw_ambient_temp >> 2 & 0x3FFF;
            let resultC = ambient_temp_int * 0.03125;

            console.log('Temperature: ' + resultC);
        }
}