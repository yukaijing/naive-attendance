const crypto = require('crypto');
const {public_key, private_key} = require("./studentlogin"); // retreive user's key pairs from the assumption file "studntlogin.js", can be modified

function create_attendance_cert(studentID, eventID, timestamp, private_key){
    //create a messge as required "(including student ID, event ID, and timestamp)"
    const message_to_be_signed = `${studentID},${eventID},${timestamp}`; 
    // adding sign message to the object 
    const sign_message = crypto.createSign('SHA256').update(message_to_be_signed); 
    sign_message.end() // end adding 
    return sign_message.sign(private_key,'base64'); // sign the message using base64 for web applciation, can be changed
}

//verification process for studnets
function signature_verification(signature_from_transacrtion, wallet_address){
    // retrieve the signature from transacrion and identify each infomation accordingly
    const [attendance_cert, studentID, eventID, timestamp] = signature_from_transacrtion.split('|');
    // reconstruct the message before signing 
    const message_before_signing = `${studentID},${eventID},${timestamp}`;
    // adding the message to the object 
    const message_to_be_verify = crypto.createVerify('SHA256').update(message_before_signing);
    message_to_be_verify.end(); // end adding
    return message_to_be_verify.verify(wallet_address, attendance_cert, 'base64'); // verify the message using base64 for web applciation, can be changed

}

// get last transaction id from last block
async function get_last_transaction(){
  //access to naviecoin via api 
  return(fetch('http://localhost:3001/blockchain/blocks/latest', {method: 'GET',headers: {'Accept': 'application/json'}})
  .then(response => response.json())
  .then(data => {
    //check if there are any transaction, the block should contain at least one transaction as a reward for miner
    if (data.transactions.length != 0){
      // fetch the last transaction from block
      const get_last_transaction_from_block = data.transactions[data.transactions.length - 1];
      console.log('Last transactionid:', get_last_transaction_from_block.id);
      //return id as string to fit the syntax
      return get_last_transaction_from_block.id.toString();
    }
    //execption handling for safty
    return null;
  })
  .catch(error => {
    //if the naivecoin has no response
    console.error('Error:', error);
    return null;
  }));
}

//generate hash id while hash(transaction id + data)
function generate_hashID(simple_transcation){
  const stringify_simple_transcation = JSON.stringify(simple_transcation.data)
  const hashid = crypto.createHash('sha256').update(simple_transcation.id + stringify_simple_transcation).digest('hex');
  console.log(hashid);
  console.log(`hash length: ${hashid.length} bytes`);
  return hashid;
}

// attendence_cert refers to the result from "cerate_attence_cert"
// studentID, eventID and timestamp in this function should be same as "cerate_attence_cert"
async function create_transaction(student_wallet_address, attendence_wallet_address, attendance_cert, last_transcationID,studentID, eventID, timestamp){
    console.log('last trans:')
    console.log(last_transcationID);
    const transactionID = crypto.randomUUID(); 
    // studentID, eventID and timestamp will be added to form a complete signature message  
    const signature_with_cert_info = `${attendance_cert}|${studentID}|${eventID}|${timestamp}`;
    // transcation template by Naivecoin API_docs "post /blockchain/transactions" 
    const transcation = {
        "id": transactionID,
        "hash": null,
        "type": "regular",
        "data": {
          "inputs": [
            {
              "transaction": last_transcationID,
              "index": 0,
              "address": student_wallet_address,
              "signature": signature_with_cert_info
            }
          ],
          "outputs": [
            {
              "amount": 0, // set to zero ans this is for the attdence only.
              "address": attendence_wallet_address
            }
          ]
        }
      }
    const hashID =  generate_hashID(transcation);
    transcation.hash = hashID;

    return transcation;
}

/*Following is the create transcation example which should not include in this file, 
Example usage by AI
const studentID = '12345';
const eventID = '67890';
const timestamp = Date.now();
const attendanceCert = create_attendance_cert(studentID, eventID, timestamp, private_key);
console.log(attendanceCert)
// Decode the base64 string
const signatureBuffer = Buffer.from(attendanceCert, 'base64');
console.log(`Signature length: ${signatureBuffer.length} bytes`);
const studentWalletAddress = public_key; // Replace with actual student's public key
const attendanceWalletAddress = 'teacherPublicKey'; // Replace with actual attendance wallet's public key
(async () => {
  const lastTransactionID = await get_last_transaction();
  console.log(lastTransactionID);

  const newTransaction = await create_transaction(studentWalletAddress, attendanceWalletAddress, attendanceCert, lastTransactionID, studentID, eventID, timestamp);
  console.log(JSON.stringify(newTransaction, null, 2));
})();
*/
/*
Following is the POST method which should not include in this file
Post example by AI 
const axios = require('axios');
axios.post('http://localhost:3001/blockchain/transactions', newTransaction)
   .then(response => {
       console.log('Transaction posted successfully:', response.data);
    })
    .catch(error => {
        console.error('Error posting transaction:', error);
    });
*/