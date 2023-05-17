const { createClient } = require('redis');
const dotenc = require("dotenv").config()
const port = process.env.PORT
const client = createClient(port);
client.connect();
client.on('connect', () => console.log('connect to redis server'));



//Support for creating a new key of type string in the Database.
//Provide support for, optionally, adding an expiry on the key.



async function addNewKey(options){

    try{
        const polutedKey = process.env.POLLUTANT + ":" + options.keyName
        const polluteData = await client.set(polutedKey, options.value)
        if(options.expiry){
            const data = await client.setEx(options.keyName, options.expiry , options.value)
            return {data, polluteData}
        }else{
            const data = await client.set(polutedKey, options.value)
            return {data, polluteData}
        }
        
    }catch(err){
        return err
    }

} 

// Support for removing the expiry of any existing key in the Database.

async function removeExpiry(options) {
    try{
        const value = await client.get(options.key)
        if(value){
            const ttl = await client.ttl(options.key)

            if(ttl){
                let data = await client.persist(options.key)
                return data
            }else{
                return new Error("Key already persist")
            }
        }else{
            return new Error("Key does not exist")
        }
    }catch(err){
        //console.log("error---", err)
        return err
    }
}

// Support for adding/updating the expiry on any existing key in the Database.

async function updateExpiry(options){
    try{
        const data = await client.expire(options.key,options.expiry)

        if(!data){
            console.log("error---", new Error("Key does not exist...!"))
        }

        return data

    }catch(err){
        return err
    }
}


//Support for fetching the value of any existing key in the Database.

async function getKey(options) {
    
    try{
        const data = await client.get(options.key)
        if(data){
            return data
        }
        return new Error("Key does not exist")
    }catch(err){
        return err
    }
}

// Support for logging the name & value of any key upon the keys' expiration.


async function expireLogger () {
    try{
        await client.configSet("notify-keyspace-events", "KEx");

        const subscriber=client.duplicate();
        subscriber.connect();
      
      
        await subscriber.SUBSCRIBE("__keyevent@0__:expired", async(message) => {
          const data = await client.get(`${process.env.POLLUTANT}:${message}`)
          console.log("Logger",{
              expireKey: message,
              value: data
          }) 
          
        });
    }catch(err){
        console.log("error--", err)
    }

}

async function updateValue(options) {
    
    try{
        const data = await client.GETSET(options.key,options.value)
        const polutekeyvalue = await client.GETSET(process.env.POLLUTANT + ":" + options.key,options.value)
        if(data){
            return {keyValue: data, pollutekeyValue: polutekeyvalue}
        }
        return new Error("Key does not exist")
    }catch(err){
        return err
    }
}

module.exports= {
    addNewKey,
    removeExpiry,
    updateExpiry,
    getKey,
    expireLogger,
    updateValue
}