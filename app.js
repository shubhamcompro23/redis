const redisController = require("./redis")


async function data() {

    //Expiry Logger 
    await redisController.expireLogger()

    // ADD NEW KEY
    let addkeyoptions = {
        keyName: "newkey",
        expiry: 60,
        value: "This is value of new key"
    }
    const addkey = await redisController.addNewKey(addkeyoptions)

    console.log("addnewkey--", addkey)

    //REMOVE EXPIRY

    let removeexpiryoptions= {
        key : "newkey"
    }

    const removeExpiry = await redisController.removeExpiry(removeexpiryoptions)

    console.log("removeExpiry--", removeExpiry)

    //updatevalue

    const updatevalueoptions = {
        key: "newkey",
        value: "This is updated value of new key"
    }

    const updatedValue = await redisController.updateValue(updatevalueoptions)

    console.log("updatedValue",updatedValue)

    //updateExpiry

    let updateExpiryoptions = {
        key: "newkey",
        expiry: 5
    }
    const updateExpiry = await redisController.updateExpiry(updateExpiryoptions)

    console.log("updateExpiry--", updateExpiry)

    //getKey

    let getoptions = {
        key: "newkey"
    }

    const getKey = await redisController.getKey(getoptions)

    console.log("getKey--", getKey)


}

data()