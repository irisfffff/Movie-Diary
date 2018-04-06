/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function sendGet() {
    console.log("READY TO GET");
    listWatchingHistory();
}

function sendGetCon() {
    console.log("READY TO GET CON");
    listSpecificHistory();
}

function sendPost() {
    console.log("READY TO POST");
    insertNewWatching();
}

function sendDelete() {
    console.log("READY TO DELETE");
    deleteHistory();
}
