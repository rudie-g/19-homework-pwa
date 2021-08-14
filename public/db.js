const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
let db;
const request = indexedDB.open("budget-app", 1);

request.onupgradeneeded = ({target}) => {
    let db = target.result;
    db.createObjectStore("pending", {
        autoIncrement: true
    })
};

request.onsuccess = ({target}) => {
    db = target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    console.log("something went wrong", event.target.errorCode)
};

function saveRecord(record) {
    const transaction = db.transaction(["pending"], 'readwrite');
    const store = transaction.createObjectStore("pending")

    store.add(record)
}

function checkDatabase() {
    const transaction = db.transaction(["pending"], 'readwrite')
    const store = transaction.createObjectStore("pending")

    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                }
            })
            .then(response => {
                return response.json()
            })
            .then(() => {
                const transaction = db.transaction(["pending"], 'readwrite');
                const store = transaction.createObjectStore("pending");
                store.clear();
            })
        }
    }
}

window.addEventListener("online", checkDatabase);