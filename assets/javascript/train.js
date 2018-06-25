//Script example for train HW

        // Assume the following situations.
    
        // (TEST 1)
        // First Train of the Day is 3:00 AM
        // Assume Train comes every 3 minutes.
        // Assume the current time is 3:16 AM....
        // What time would the next train be...? (Use your brain first)
        // It would be 3:18 -- 2 minutes away
    
        // (TEST 2)
        // First Train of the Day is 3:00 AM
        // Assume Train comes every 7 minutes.
        // Assume the current time is 3:16 AM....
        // What time would the next train be...? (Use your brain first)
        // It would be 3:21 -- 5 minutes away
    
    
        // ==========================================================
    
        // Solved Mathematically
        // Test case 1:
        // 16 - 00 = 16
        // 16 % 3 = 1 (Modulus is the remainder)
        // 3 - 1 = 2 minutes away
        // 2 + 3:16 = 3:18
    
        // Solved Mathematically
        // Test case 2:
        // 16 - 00 = 16
        // 16 % 7 = 2 (Modulus is the remainder)
        // 7 - 2 = 5 minutes away
        // 5 + 3:16 = 3:21
    
        // Assumptions
        // var tFrequency = 3;
    
        // // Time is 3:30 AM
        // var firstTime = "03:30";
    
        // // First Time (pushed back 1 year to make sure it comes before current time)
        // var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        // console.log(firstTimeConverted);
    
        // // Current Time
        // var currentTime = moment();
        // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    
        // // Difference between the times
        // var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // console.log("DIFFERENCE IN TIME: " + diffTime);
    
        // // Time apart (remainder)
        // var tRemainder = diffTime % tFrequency;
        // console.log(tRemainder);
    
        // // Minute Until Train
        // var tMinutesTillTrain = tFrequency - tRemainder;
        // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    
        // // Next Train
        // var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));


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

    // Capture Button Click
    $("#add-train").on("click", function(event) {
        // do not refresh the page
        event.preventDefault();

        // store and retrieve the most recent train info
        // Don't forget to provide initial data to your Firebase database.  
        //TODO id how to add data without they key being there
        trainName = $("#train-name-input").val().trim();
        destination = $("#destination-input").val().trim();
        firstTrainTime = $("#first-train-time-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        // assign the variables to Firebase db values
        // database.ref().set({
        //     trainName: trainName,
        //     destination: destination,
        //     firstTrainTime: firstTrainTime,
        //     frequency: frequency
        // });

        // OR using push
        // Code for handling the push
        //database.ref().push({
        database.push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
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
        console.log(sv.trainName);
        console.log(sv.destination);
        console.log(sv.firstTrainTime);
        console.log(sv.frequency);

        // Change the HTML to reflect       TODO update this to change the table
        $("#train-name-display").text(sv.trainName);
        $("#destination-display").text(sv.destination);
        $("#first-train-time-display").text(sv.firstTrainTime);
        $("#frequency-display").text(sv.frequency);

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