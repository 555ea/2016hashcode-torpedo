const fs = require('fs'),
    path = require('path');

function readInputFile(name, callback) {
    fs.readFile(`./${name}`, 'utf8', function (err, data) {
        const fileRows = data.toString().split('\n');
        const file = {
            rows: 0,
            columns: 0,
            droneCount: 0,
            turnsCount: 0,
            maxPayload: 0,
            productTypesCount: 0,
            weights: [],
            warehouseCount: 0,
            warehouses: [],
            ordersCount: 0,
            orders: []
        };
        let warehouseCurrentCount = 0;
        let orderStepIndex = 0;
        fileRows.forEach((row, index) => {
            if (row.length > 0) {
                const cells = row.split(' ').map((cell) => parseInt(cell));
                if (index === 0) {
                    const [rows, columns, droneCount, turnsCount, maxPayload] = cells;
                    Object.assign(file, {rows, columns, droneCount, turnsCount, maxPayload});
                } else if (index === 1) {
                    const [productTypesCount] = cells;
                    Object.assign(file, {productTypesCount});
                } else if (index === 2) {
                    const weights = cells;
                    Object.assign(file, {weights});
                } else if (index === 3) {
                    const [warehouseCount] = cells;
                    Object.assign(file, {warehouseCount});
                } else {
                    if (warehouseCurrentCount < file.warehouseCount) {
                        if (cells.length === 2) {
                            file.warehouses.push({location: cells, productTypes:[]});
                        } else {
                            file.warehouses[file.warehouses.length - 1].productTypes = cells
                                .map((cell, index) => ({type: index, count: cell}))
                                .filter((cell) => cell.count > 0);
                            warehouseCurrentCount++;
                        }
                    } else {
                        if (!file.ordersCount){
                            const [ordersCount] = cells;
                            Object.assign(file, {ordersCount});
                        } else {
                            if(orderStepIndex === 0){
                                file.orders.push({destination: cells, types: [], itemsCount: 0})
                                orderStepIndex++;
                            } else if (orderStepIndex === 1){
                                const [itemsCount] = cells;
                                file.orders[file.orders.length - 1].itemsCount = itemsCount;
                                orderStepIndex++;
                            } else if (orderStepIndex === 2){
                                file.orders[file.orders.length - 1].types = cells;
                                orderStepIndex = 0;
                            }
                        }
                    }
                }

            }
        });
        callback(file);
    });
}

function writeOutputFile(name, vehicleRides, rides, callback) {
    if (!callback) {
        callback = rides;
    }
    const vehicleRideIndexArrays = [];
    vehicleRides.forEach((vehicleRide) => {
        vehicleRideIndexArrays[vehicleRide.vehicle] = vehicleRideIndexArrays[vehicleRide.vehicle] || [];
        vehicleRideIndexArrays[vehicleRide.vehicle].push(vehicleRide.rideIndex);
    });
    let resultString = '';
    vehicleRideIndexArrays.map((vehicleRideIndexArray, vehicleIndex) => {
        resultString += `${vehicleRideIndexArray.length} ${vehicleRideIndexArray.join(' ')}\n`
    })
    fs.writeFile(`./files/output/${name}`, resultString, function (err, data) {
        callback('success!');
    });
}


module.exports = {readInputFile, writeOutputFile};



