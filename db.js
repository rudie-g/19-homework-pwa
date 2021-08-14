const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
let db;
const request = indexedDB.open("budget-app", 1);

request.onupgradeneeded = ({target}) => {
    let db = target.result;
    db.createObjectStore("pending", {
        autoIncrement: true
    })
}

request.onsuccess = ({target}) => {
    db = target.result;

    if (navigator.onLine) {
        checkDatabase();
    }
}