const fs = require('fs');
const reduce = require('lodash.reduce');

const FILE = 'src/telegram/subscriptions/subscriptions.json';
let timer;
let subscriptionsSkipped = 0;
const onSubscriptionUpdateHandler = {
    set: (obj, prop, value) => {
        obj[prop] = value;
        if(subscriptionsSkipped <= 10) {
            clearTimeout(timer);
            subscriptionsSkipped++;
        }
        timer = setTimeout(() => {
            dumpToFile();
            subscriptionsSkipped = 0;
        }, 1000);
        return true;
    }
};
const helpers = new Proxy(JSON.parse(fs.readFileSync(FILE, 'utf-8')), onSubscriptionUpdateHandler);

const dumpToFile = () => {
    return new Promise((resolve, reject) => {
        fs.writeFile(FILE, JSON.stringify(helpers), (writeError) => {
            if (writeError) {
                console.error('error while saving helpers', writeError);
                reject(writeError);
            } else {
                resolve(helpers);
            }
        });
    });
};

const subscribe = (chatID) => {
    helpers[chatID] = true;
};

const unsubscribe = (chatID) => {
    helpers[chatID] = false;
};

const getSubscriptions = () => {
    return reduce(helpers, (result, value, key) => {
        if(value) {
            result.push(key);
        }
        return result;
    }, []);

};


module.exports = {
    subscribe,
    unsubscribe,
    getSubscriptions,
};



