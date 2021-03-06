/*****************************/
/* global firebase           */
/*****************************/

// Initialize Firebase (mine)
var config = {
    apiKey: "AIzaSyBx--VlgBtKp5yh0pFjwfF1xRq2EzEh5yk",
    authDomain: "train-scheduler-a027f.firebaseapp.com",
    databaseURL: "https://train-scheduler-a027f.firebaseio.com",
    projectId: "train-scheduler-a027f",
    storageBucket: "train-scheduler-a027f.appspot.com",
    messagingSenderId: "495145709947"
};
firebase.initializeApp(config);

// Create a variable to reference the database
//var database = firebase.database();
var database = firebase.database().ref("trains");

// variables
var trainName = "";
var destination = "";
var firstTrainTime = 0;
var frequency = "";
var trainTimer;

window.trainTimer = window.setInterval(updateRemainingTime, 1000);  // start timer

// button Click to add new train
$("#add-train").on("click", function(event) {
    //do not uncomment the below so we see the HTML5 form validation errors
    //event.preventDefault();

    // store and retrieve the most recent train info
    trainName = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrainTime = $("#first-train-time-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    console.log("format firsttrain time:" + moment(firstTrainTime,"HH:mm"));
    console.log("format frequency: " + moment(frequency,"mm"));

    if (!moment(firstTrainTime,"HH:mm").isValid()) {
        console.log("firstTrainTime invalid");
        $("#first-train-time-input").focus();
        return false;
    }
    if (!moment(frequency,"mm").isValid()) {
        $("#frequency-input").focus();
        console.log("frequency invalid.");
        return false;
    }

    // assign the variables to Firebase db values
    // database.ref().set({
    //     trainName: trainName,
    //     destination: destination,
    //     firstTrainTime: firstTrainTime,
    //     frequency: frequency
    // });

    // OR using push
    //database.ref().push({
    database.push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: moment(frequency,"mm").minute(),
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
});

///////////////////////////////////////////
// Firebase event listener for changes
///////////////////////////////////////////
// On initial load and on subsequent data value changes, get a snapshot of the current data. 
// This callback keeps the page updated when a value changes in firebase.
//database.ref().on("value", function(snapshot) {
// database.on("value", function(snapshot) {

//     // log results from snapshot
//     console.log("in value on");
//     console.log(snapshot.val());
//     console.log(snapshot.val().trainName);
//     console.log(snapshot.val().destination);
//     console.log(snapshot.val().firstTrainTime);
//     console.log(snapshot.val().frequency);

//     // Change the HTML to reflect
//     $("#train-name-display").text(snapshot.val().trainName);
//     $("#destination-display").text(snapshot.val().destination);
//     $("#first-train-time-display").text(snapshot.val().firstTrainTime);
//     $("#frequency-display").text(snapshot.val().frequency);

//     // Handle the errors
// }, function(errorObject) {
//     console.log("Errors handled: " + errorObject.code);
// });

///////////////////////////////////////////
// Firebase watcher .on "child_added"
///////////////////////////////////////////
//database.ref().on("child_added", function(snapshot) {
database.on("child_added", function(snapshot) {

    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // Console.loging the last user's data
    console.log("in child added");
    console.log("FB trainName:" + sv.trainName);
    console.log("FB destination:" + sv.destination);
    console.log("FB firstTrainTime:" + sv.firstTrainTime);
    console.log("FB frequency:" + sv.frequency);

    // Change the HTML to reflect       TODO update this to change the table
    // $("#train-name-display").text(sv.trainName);
    // $("#destination-display").text(sv.destination);
    // $("#first-train-time-display").text(sv.firstTrainTime);
    // $("#frequency-display").text(sv.frequency);
    
    // var nextArrival = moment().format("HH:mm A");
    // var minutesAway = moment().format("mm");

    //train info
    var tFrequency = sv.frequency;  

    var firstTime = moment(sv.firstTrainTime,"HH:mm");
    console.log("first time: " + firstTime);
    console.log("frequency: " + tFrequency);

    // first Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(moment(firstTimeConverted).format("HH:mm"));

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    // full list of items to the well
    $("#all-trains-list").append(
        "<tr id=" + sv.trainName + ">" +
            "<td id='train-name-display' scope='row'>"  + sv.trainName + "</td>" +
            "<td id='destination-display'>"             + sv.destination + "</td>" +
            "<td id='frequency-display'>"               + tFrequency + "</td>" +
            "<td id='next-arrival-display'>"            + moment(nextTrain).format("hh:mm A") + "</td>" +
            "<td id='minutes-away-display'>"            + tMinutesTillTrain + "</td>" +
            "<td></td>" +
        "</tr>");
//                "<td id='first-train-time-display'>"        + sv.firstTrainTime + "</td>" +          

// Handle the errors
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

//dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
database.orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
    console.log("in orderby added");

    // update the html with the values
    $("#td-train-name-display").text(snapshot.val().trainName);
    $("#td-destination-display").text(snapshot.val().destination);
    $("#td-first-train-time-display").text(snapshot.val().firstTrainTime);
    $("#td-frequency-display").text(snapshot.val().frequency);
});

///////////////////////////////////////////
// Functions
///////////////////////////////////////////
 function updateRemainingTime() {
     var timeOver = false;
     var timeLeft;

//     // countdown
//     game.timeleft--;
//     $("#train #minutes-away-display").text(game.timeleft);
    
    // if (game.timeleft <=0 && !game.answerSubmitted) {
    //     timeOver = true;
    //     clearInterval(trainTimer);
    // };
    
    //update next arrival

    //update minutes away
 };