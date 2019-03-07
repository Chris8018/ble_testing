async function onScanButtonClick() {
    // let serviceUuid = document.querySelector('#service').value;
    // if (serviceUuid.startsWith('0x')) {
    //   serviceUuid = parseInt(serviceUuid);
    // }

    // let characteristicUuid = document.querySelector('#characteristic').value;
    // if (characteristicUuid.startsWith('0x')) {
    //   characteristicUuid = parseInt(characteristicUuid);
    // }

    try {
        //let serviceUuid = 0x180a;
        console.log('Requesting Bluetooth Device...');
        const device = await navigator.bluetooth.requestDevice({
            // filters: [
            //     //{name: 'CC2650 SensorTag'},
            //     {services: ['f000aa00-0451-4000-b000-000000000000']}
            // ]
            acceptAllDevices: true,
            //optionalServices: [0x180a]
        });

        let dName = await device.name;
        let dID = await device.id;
        let dGATT = await device.gatt;
        //let dUUIDs = await device.uuids;
        console.log(device);
        console.log('Name: ' + dName);
        console.log('ID: ' + dID);
        console.log('GATT: ' + dGATT);
        const server = await device.gatt.connect();
        console.log("Connected! " + server.connected);
        //const s1 = await server.getPrimaryServices(0x180a);
        let s1 = await server.getPrimaryServices();
        console.log("Got service!");
        console.log(s1)
        // const name = await service.getCharacteristic(0x2a24);
        //console.log('Got characteristic Device_modelNum')
        //console.log(name.properties.read);
        //console.log(server.getPrimaryServices());
        //console.log(device.uuids);
        // console.log('UUIDs');
        //let arr[];
        // device.uuids.then(arr =>{
        //     array.forEach(element => {
        //         console.log('something');
        //     });
        // });

        //console.log(uuids);

        // console.log('Disconnect');
        // device.disconnect();
        
        // console.log('Connecting to GATT Server...');
        // const server = await device.gatt.connect();

        //console.log('Getting Service...');
        //const service = await server.getPrimaryService(serviceUuid);

        // console.log('Getting Characteristic...');
        // const characteristic = await service.getCharacteristic(characteristicUuid);

        // console.log('> Characteristic UUID:  ' + characteristic.uuid);
        // console.log('> Broadcast:            ' + characteristic.properties.broadcast);
        // console.log('> Read:                 ' + characteristic.properties.read);
        // console.log('> Write w/o response:   ' +
        //     characteristic.properties.writeWithoutResponse);
        // console.log('> Write:                ' + characteristic.properties.write);
        // console.log('> Notify:               ' + characteristic.properties.notify);
        // console.log('> Indicate:             ' + characteristic.properties.indicate);
        // console.log('> Signed Write:         ' +
        //     characteristic.properties.authenticatedSignedWrites);
        // console.log('> Queued Write:         ' + characteristic.properties.reliableWrite);
        // console.log('> Writable Auxiliaries: ' +
        //     characteristic.properties.writableAuxiliaries);
    } catch (error) {
        console.log('Error: ' + error);
    }
}