const functions = require("firebase-functions");
const admin = require('firebase-admin');

admin.initializeApp();

exports.name = functions.https.onRequest((req, res) => {
    var myJson = req.body
    res.send(myJson["name"])
  });                       

  exports.hello = functions.https.onRequest((req, res) => {
    console.log("Someone is calling me!");
    res.send("Hello from Firebase!");
  });                       

  exports.updateUser = functions.firestore
  .document('customers/Alex')
  .onUpdate((change, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = change.after.data().name;

    // ...or the previous value before this update
    const previousValue = change.before.data().name;


    // perform desired operations ...
    console.log(previousValue + "--> " + newValue)

  });

  exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    var original = req.body;
    var myname = original["name"];
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await admin.firestore().collection('customers').add({name: myname});
    // Send back a message that we've successfully written the message
    res.json({result: `Message with ID: ${writeResult.id} added.`});
  });


  exports.myquery = functions.https.onRequest(async (req,res)=>{

    var original = req.body;
    var myage = original["age"];

    var list = []


    await admin.firestore().collection("customers").where("age", ">=", myage)
                        .get()
                        .then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                // doc.data() is never undefined for query doc snapshots
                                console.log(doc.id, " => ", doc.data());
                                list.push(doc.data().name)
                            });
                        })
                        .catch((error) => {
                            console.log("Error getting documents: ", error);
                        });

     res.send(list)
  })