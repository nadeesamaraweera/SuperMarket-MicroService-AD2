const express = require('express');
const {Eureka} = require('eureka-js-client')


const app = express();
const port = 3000;

const router = express.Router();

router.get('/inventory', (req, res) => {
    res.json({
        items:['Milk','Bread','Eggs'],
        message:'This is inventory service'
    });
});

app.use("/inventory-service", router)


// Eureka Client Configuration
const eurekaClient = new Eureka({
    instance: {
        instanceId: "inventory-service",
        app: "INVENTORY-SERVICE",
        hostName: "localhost",
        ipAddr: "127.0.0.1",
        port: {
            $: port,
            "@enabled": true,
        },
        vipAddress: "inventory-service",
        dataCenterInfo: {
            "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
            name: "MyOwn",
        },
    },
    eureka: {
        host: "localhost",
        port: 8761,
        //servicePath: "/eureka/apps/",  //
        // or
        //servicePath: "/eureka/",
        // or
        // empty
    },
});


app.listen(port,()=>{
    console.log(`Inventory service running on port : ${port}`)
    eurekaClient.start((error) => {
        if (error) {
            console.log("Fail to connect to eureka server");
        }else {
            console.log("Successfully connected to eureka server");
        }
    });
})