const { admin, db } = require("../../config/firebase");
const { catchAsync } = require("../helpers/catchAysnc");


const setMessagesDelivered = catchAsync(async (userId) => {
  const messagesRef = await db.ref("messages");
    messagesRef
    .orderByChild("to")
    .equalTo(userId)
    .once("value")
    .then(async (snapshots) => {
        const updates = {};
        snapshots.forEach(snapshot=>{
            const msg = snapshot.val();
            if(msg.status=="Sent"){
                updates[`${snapshot.key}/status`] = "Delivered";
            }
        })
        await messagesRef.update(updates);
    });
});

const setMessageSeen = catchAsync(async (data) => {
    const messagesRef = await db.ref("messages");
      messagesRef
      .orderByChild("id")
      .equalTo(data.id)
      .once("value")
      .then(async (snapshots) => {
          const updates = {};
          updates[data.id+"/status"]="Seen";
          await messagesRef.update(updates);
      });
  });

module.exports = { setMessagesDelivered , setMessageSeen}