

// "use client";

// import EmojiPicker from "emoji-picker-react";
// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";

// import AudioCallCard from "./AudioCallCard";
// import IncomingAudioCallCard from "./IncomingAudioCallCard";

// import {
//   Smile,
//   Mic,
//   Phone,
//   Video,
//   Send,
//   ImageDown,
//   Paperclip,
//   FileText,
// } from "lucide-react";

// import {
//   getChatHistory,
//   connectSocket,
//   subscribeRoom,
//   subscribeCall,
//   sendMessageSocket,
//   sendCallOffer,
//   sendCallAnswer,
//   sendIceCandidate,
//   rejectCall,
//   endCall,
// } from "@/services/chatService";


// function ChatWindow({ selectedChat }) {

//   // =====================================================
//   // CHAT STATE
//   // =====================================================

//   const [incomingCall, setIncomingCall] = useState(null);
// const [callConnected, setCallConnected] = useState(false);
//   const [showCallCard, setShowCallCard] =
//     useState(false);

//   const [showAttachMenu, setShowAttachMenu] =
//     useState(false);

//   const [messages, setMessages] =
//     useState([]);

//   const [message, setMessage] =
//     useState("");

//   const [currentUsername, setCurrentUsername] =
//     useState("");

//   const [showEmojiPicker, setShowEmojiPicker] =
//     useState(false);


//   // =====================================================
//   // WEBRTC REFS
//   // =====================================================

//   const peerConnectionRef =
//     useRef(null);

//   const localStreamRef =
//     useRef(null);

//   const pendingIceCandidatesRef =
//     useRef([]);

//   // Persistent remote audio element
//   const remoteAudioRef =
//     useRef(null);


//   // =====================================================
//   // GET CURRENT USERNAME
//   // =====================================================

//   useEffect(() => {

//     const username =
//       localStorage.getItem("username");

//     setCurrentUsername(
//       username || ""
//     );

//   }, []);


//   // =====================================================
//   // LOAD CHAT HISTORY
//   // =====================================================

//   useEffect(() => {

//     if (!selectedChat) return;

//     const loadHistory = async () => {

//       try {

//         const data =
//           await getChatHistory(
//             selectedChat.roomId
//           );

//         setMessages(data);

//       } catch (error) {

//         console.error(
//           "❌ Failed to load chat history:",
//           error
//         );

//       }

//     };

//     loadHistory();

//   }, [selectedChat]);


//   // =====================================================
//   // CLEANUP WEBRTC CALL
//   // =====================================================

//   const cleanupCall = () => {

//     console.log(
//       "🧹 Cleaning WebRTC call"
//     );


//     // =================================================
//     // STOP MICROPHONE
//     // =================================================

//     if (localStreamRef.current) {

//       localStreamRef.current
//         .getTracks()
//         .forEach((track) => {

//           track.stop();

//         });

//     }


//     // =================================================
//     // STOP REMOTE AUDIO
//     // =================================================

//     if (remoteAudioRef.current) {

//       remoteAudioRef.current.pause();

//       remoteAudioRef.current.srcObject =
//         null;

//     }


//     // =================================================
//     // CLOSE PEER CONNECTION
//     // =================================================

//     if (peerConnectionRef.current) {

//       peerConnectionRef.current.close();

//     }


//     // =================================================
//     // RESET REFS
//     // =================================================

//     peerConnectionRef.current =
//       null;

//     localStreamRef.current =
//       null;

//     pendingIceCandidatesRef.current =
//       [];


//     // =================================================
//     // RESET UI
//     // =================================================

//     setShowCallCard(false);

//     setIncomingCall(null);

//   };


//   // =====================================================
//   // CHAT + CALL SOCKET
//   // =====================================================

//   useEffect(() => {

//     if (!selectedChat) return;

//     let chatSubscription = null;
//     let callSubscription = null;


//     connectSocket(() => {

//       console.log(
//         "🔌 Socket ready - subscribing to chat + calls"
//       );


//       // =================================================
//       // CHAT SUBSCRIPTION
//       // =================================================

//       chatSubscription =
//         subscribeRoom(
//           selectedChat.roomId,
//           (newMessage) => {

//             console.log(
//               "💬 CHAT MESSAGE RECEIVED:",
//               newMessage
//             );

//             setMessages((prev) => [
//               ...prev,
//               newMessage,
//             ]);

//           }
//         );


//       // =================================================
//       // CALL SUBSCRIPTION
//       // =================================================

//       callSubscription =
//         subscribeCall(
//           async (callData) => {

//             console.log(
//               "📞 CALL EVENT RECEIVED:",
//               callData
//             );


//             // =============================================
//             // INCOMING CALL OFFER
//             // =============================================

//             if (callData.type === "offer") {

//               console.log(
//                 "📞 Incoming audio call"
//               );

//               setIncomingCall(
//                 callData
//               );

//               return;
//             }


//             // =============================================
//             // CALLER RECEIVES ANSWER
//             // =============================================

//             if (callData.type === "answer") {

//               console.log(
//                 "📞 Answer received"
//               );

//               try {

//                 if (
//                   !peerConnectionRef.current
//                 ) {

//                   console.error(
//                     "❌ PeerConnection does not exist"
//                   );

//                   return;
//                 }


//                 const answer =
//                   JSON.parse(
//                     callData.answer
//                   );


//                 await peerConnectionRef.current
//                   .setRemoteDescription(
//                     new RTCSessionDescription(
//                       answer
//                     )
//                   );


//                 console.log(
//                   "✅ Remote answer set"
//                 );


//                 // =========================================
//                 // ADD QUEUED ICE CANDIDATES
//                 // =========================================

//                 for (
//                   const candidate
//                   of pendingIceCandidatesRef.current
//                 ) {

//                   try {

//                     await peerConnectionRef.current
//                       .addIceCandidate(
//                         new RTCIceCandidate(
//                           candidate
//                         )
//                       );

//                     console.log(
//                       "✅ Queued ICE candidate added"
//                     );

//                   } catch (error) {

//                     console.error(
//                       "❌ Failed queued ICE candidate:",
//                       error
//                     );

//                   }

//                 }


//                 pendingIceCandidatesRef.current =
//                   [];

//               } catch (error) {

//                 console.error(
//                   "❌ Error handling answer:",
//                   error
//                 );

//               }

//               return;
//             }


//             // =============================================
//             // ICE CANDIDATE
//             // =============================================

//             if (callData.type === "ice") {

//               console.log(
//                 "🧊 ICE candidate received"
//               );

//               try {

//                 const candidate =
//                   JSON.parse(
//                     callData.candidate
//                   );


//                 // =========================================
//                 // PEER CONNECTION NOT READY
//                 // =========================================

//                 if (
//                   !peerConnectionRef.current
//                 ) {

//                   pendingIceCandidatesRef.current
//                     .push(candidate);

//                   console.log(
//                     "🧊 ICE candidate queued - no peer connection"
//                   );

//                   return;
//                 }


//                 // =========================================
//                 // REMOTE DESCRIPTION NOT READY
//                 // =========================================

//                 if (
//                   !peerConnectionRef.current
//                     .remoteDescription
//                 ) {

//                   pendingIceCandidatesRef.current
//                     .push(candidate);

//                   console.log(
//                     "🧊 ICE candidate queued - remote description not ready"
//                   );

//                   return;
//                 }


//                 // =========================================
//                 // ADD ICE
//                 // =========================================

//                 await peerConnectionRef.current
//                   .addIceCandidate(
//                     new RTCIceCandidate(
//                       candidate
//                     )
//                   );


//                 console.log(
//                   "✅ ICE candidate added"
//                 );

//               } catch (error) {

//                 console.error(
//                   "❌ Error handling ICE:",
//                   error
//                 );

//               }

//               return;
//             }


//             // =============================================
//             // CALL REJECTED
//             // =============================================

//             if (callData.type === "reject") {

//               console.log(
//                 "📞 Call rejected"
//               );

//               cleanupCall();

//               return;
//             }


//             // =============================================
//             // CALL ENDED
//             // =============================================

//             if (callData.type === "end") {

//               console.log(
//                 "📞 Remote user ended the call"
//               );

//               cleanupCall();

//               return;
//             }

//           }
//         );

//     });


//     // =====================================================
//     // CLEANUP SOCKET SUBSCRIPTIONS
//     // =====================================================

//     return () => {

//       console.log(
//         "🧹 Cleaning chat/call subscriptions"
//       );

//       chatSubscription?.unsubscribe();

//       callSubscription?.unsubscribe();

//     };

//   }, [selectedChat]);


//   // =====================================================
//   // EMOJI
//   // =====================================================

//   const handleEmojiClick = (emojiData) => {

//     setMessage(
//       (prev) =>
//         prev + emojiData.emoji
//     );

//     setShowEmojiPicker(false);

//   };


//   // =====================================================
//   // SEND MESSAGE
//   // =====================================================

//   const handleSend = async () => {

//     if (!message.trim()) return;

//     if (!selectedChat) return;

//     try {

//       sendMessageSocket(
//         selectedChat.name,
//         message
//       );

//       setMessage("");

//     } catch (error) {

//       console.error(
//         "❌ Failed to send message:",
//         error
//       );

//     }

//   };


//   // =====================================================
//   // START AUDIO CALL — USER A
//   // =====================================================

//   const handleStartCall = async () => {

//     if (!selectedChat) return;


//     try {

//       console.log(
//         "📞 Starting audio call..."
//       );


//       // ===============================================
//       // GET CALLER MICROPHONE
//       // ===============================================

//       const stream =
//         await navigator.mediaDevices
//           .getUserMedia({
//             audio: true,
//           });

// localStreamRef.current = stream;

// const audioTrack = stream.getAudioTracks()[0];

// console.log("🎤 MY MICROPHONE:", {
//   enabled: audioTrack.enabled,
//   muted: audioTrack.muted,
//   readyState: audioTrack.readyState,
//   label: audioTrack.label,
// });
      


//       // ===============================================
//       // SHOW CALL CARD
//       // ===============================================

//       setShowCallCard(true);


//       // ===============================================
//       // CREATE PEER CONNECTION
//       // ===============================================

//       const peerConnection =
//         new RTCPeerConnection({
//           iceServers: [
//             {
//               urls:
//                 "stun:stun.l.google.com:19302",
//             },
//           ],
//         });


//       peerConnectionRef.current =
//         peerConnection;


//       // ===============================================
//       // ADD CALLER AUDIO
//       // ===============================================

//       stream
//         .getTracks()
//         .forEach((track) => {

//           peerConnection.addTrack(
//             track,
//             stream
//           );

//         });


//       // ===============================================
//       // ICE CANDIDATE
//       // ===============================================

//       peerConnection.onicecandidate =
//         (event) => {

//           if (event.candidate) {

//             console.log(
//               "🧊 Sending caller ICE candidate"
//             );

//             sendIceCandidate(
//               selectedChat.name,
//               selectedChat.roomId,
//               event.candidate
//             );

//           }

//         };


//       // ===============================================
//       // REMOTE AUDIO
//       // ===============================================

//       // peerConnection.ontrack =
//       //   async (event) => {

//       //     console.log(
//       //       "🎙️ Remote audio received"
//       //     );


//       //     if (!remoteAudioRef.current) {

//       //       console.error(
//       //         "❌ Remote audio element does not exist"
//       //       );

//       //       return;
//       //     }


//       //     remoteAudioRef.current.srcObject =
//       //       event.streams[0];


//       //     try {

//       //       await remoteAudioRef.current.play();

//       //       console.log(
//       //         "🔊 Remote audio playback started"
//       //       );

//       //     } catch (error) {

//       //       console.error(
//       //         "❌ Audio playback failed:",
//       //         error
//       //       );

//       //     }

//       //   };


//       peerConnection.ontrack = async (event) => {
//   console.log("🎙️ REMOTE TRACK RECEIVED:", {
//     kind: event.track.kind,
//     enabled: event.track.enabled,
//     muted: event.track.muted,
//     readyState: event.track.readyState,
//     streams: event.streams.length,
//   });

//   const audio = remoteAudioRef.current;

//   if (!audio) {
//     console.error("❌ Remote audio element does not exist");
//     return;
//   }

//   const stream =
//     event.streams[0] || new MediaStream([event.track]);

//   audio.srcObject = stream;
//   audio.muted = false;
//   audio.volume = 1;

//   try {
//     await audio.play();
//     console.log("🔊 REMOTE AUDIO PLAYING");
//   } catch (error) {
//     console.error("❌ AUDIO PLAY FAILED:", error);
//   }
// };   


//       // ===============================================
//       // CONNECTION STATE
//       // ===============================================

//       peerConnection.onconnectionstatechange =
//         () => {

//           console.log(
//             "🔗 Connection state:",
//             peerConnection.connectionState
//           );


//           if (
//             peerConnection.connectionState ===
//             "failed"
//           ) {

//             console.error(
//               "❌ WebRTC connection failed"
//             );

//             cleanupCall();

//           }


//           if (
//             peerConnection.connectionState ===
//             "closed"
//           ) {

//             cleanupCall();

//           }

//         };


//       // ===============================================
//       // ICE CONNECTION STATE
//       // ===============================================

//       peerConnection.oniceconnectionstatechange =
//         () => {

//           console.log(
//             "🧊 ICE connection state:",
//             peerConnection.iceConnectionState
//           );

//         };


//       // ===============================================
//       // CREATE OFFER
//       // ===============================================

//       const offer =
//         await peerConnection
//           .createOffer();


//       await peerConnection
//         .setLocalDescription(
//           offer
//         );


//       console.log(
//         "📄 Caller local description set"
//       );


//       // ===============================================
//       // SEND OFFER
//       // ===============================================

//       sendCallOffer(
//         selectedChat.name,
//         selectedChat.roomId,
//         offer
//       );


//       console.log(
//         "📞 Audio offer sent"
//       );


//     } catch (error) {

//       console.error(
//         "❌ Audio call failed:",
//         error
//       );

//       cleanupCall();

//     }

//   };


//   // =====================================================
//   // ACCEPT INCOMING AUDIO CALL — USER B
//   // =====================================================

//   const handleAcceptCall = async () => {

//     if (!incomingCall) return;


//     try {

//       console.log(
//         "📞 Accepting incoming audio call..."
//       );


//       // ===============================================
//       // GET RECEIVER MICROPHONE
//       // ===============================================

//       const stream =
//         await navigator.mediaDevices
//           .getUserMedia({
//             audio: true,
//           });


//       localStreamRef.current =
//         stream;


//       console.log(
//         "🎤 RECEIVER MICROPHONE:",
//         stream.getAudioTracks().map((track) => ({
//           enabled: track.enabled,
//           readyState: track.readyState,
//           muted: track.muted,
//           label: track.label,
//         }))
//       );


//       // ===============================================
//       // CREATE PEER CONNECTION
//       // ===============================================

//       const peerConnection =
//         new RTCPeerConnection({
//           iceServers: [
//             {
//               urls:
//                 "stun:stun.l.google.com:19302",
//             },
//           ],
//         });


//       peerConnectionRef.current =
//         peerConnection;


//       // ===============================================
//       // ADD RECEIVER AUDIO
//       // ===============================================

//       stream
//         .getTracks()
//         .forEach((track) => {

//           peerConnection.addTrack(
//             track,
//             stream
//           );

//         });


//       // ===============================================
//       // ICE CANDIDATE
//       // ===============================================

//       peerConnection.onicecandidate =
//         (event) => {

//           if (event.candidate) {

//             console.log(
//               "🧊 Sending receiver ICE candidate"
//             );

//             sendIceCandidate(
//               incomingCall.senderUsername,
//               incomingCall.roomId,
//               event.candidate
//             );

//           }

//         };


//       // ===============================================
//       // REMOTE AUDIO
//       // ===============================================

//       peerConnection.ontrack =
//         async (event) => {

//           console.log(
//             "🎙️ Remote audio received"
//           );


//           if (!remoteAudioRef.current) {

//             console.error(
//               "❌ Remote audio element does not exist"
//             );

//             return;
//           }


//           remoteAudioRef.current.srcObject =
//             event.streams[0];


//           try {

//             await remoteAudioRef.current.play();

//             console.log(
//               "🔊 Remote audio playback started"
//             );

//           } catch (error) {

//             console.error(
//               "❌ Audio playback failed:",
//               error
//             );

//           }

//         };


//       // ===============================================
//       // CONNECTION STATE
//       // ===============================================

//       peerConnection.onconnectionstatechange =
//         () => {

//           console.log(
//             "🔗 Connection state:",
//             peerConnection.connectionState
//           );


//           if (
//             peerConnection.connectionState ===
//             "failed"
//           ) {

//             console.error(
//               "❌ WebRTC connection failed"
//             );

//             cleanupCall();

//           }


//           if (
//             peerConnection.connectionState ===
//             "closed"
//           ) {

//             cleanupCall();

//           }

//         };


//       // ===============================================
//       // ICE CONNECTION STATE
//       // ===============================================

//       peerConnection.oniceconnectionstatechange =
//         () => {

//           console.log(
//             "🧊 ICE connection state:",
//             peerConnection.iceConnectionState
//           );

//         };


//       // ===============================================
//       // SET REMOTE OFFER
//       // ===============================================

//       const remoteOffer =
//         JSON.parse(
//           incomingCall.offer
//         );


//       await peerConnection
//         .setRemoteDescription(
//           new RTCSessionDescription(
//             remoteOffer
//           )
//         );


//       console.log(
//         "✅ Remote offer set"
//       );


//       // ===============================================
//       // ADD QUEUED ICE CANDIDATES
//       // ===============================================

//       for (
//         const candidate
//         of pendingIceCandidatesRef.current
//       ) {

//         try {

//           await peerConnection
//             .addIceCandidate(
//               new RTCIceCandidate(
//                 candidate
//               )
//             );

//           console.log(
//             "✅ Queued receiver ICE candidate added"
//           );

//         } catch (error) {

//           console.error(
//             "❌ Failed queued ICE candidate:",
//             error
//           );

//         }

//       }


//       pendingIceCandidatesRef.current =
//         [];


//       // ===============================================
//       // CREATE ANSWER
//       // ===============================================

//       const answer =
//         await peerConnection
//           .createAnswer();


//       await peerConnection
//         .setLocalDescription(
//           answer
//         );


//       console.log(
//         "📄 Receiver local description set"
//       );


//       // ===============================================
//       // SEND ANSWER
//       // ===============================================

//       sendCallAnswer(
//         incomingCall.senderUsername,
//         incomingCall.roomId,
//         answer
//       );


//       console.log(
//         "📞 Answer sent"
//       );


//       // ===============================================
//       // CLOSE INCOMING CARD
//       // ===============================================

//       setIncomingCall(null);


//       // ===============================================
//       // SHOW CALL CARD
//       // ===============================================

//       setShowCallCard(true);


//     } catch (error) {

//       console.error(
//         "❌ Failed to accept audio call:",
//         error
//       );

//       cleanupCall();

//     }

//   };


//   // =====================================================
//   // REJECT INCOMING AUDIO CALL — USER B
//   // =====================================================

//   const handleRejectCall = () => {

//     if (!incomingCall) return;


//     console.log(
//       "📞 Rejecting incoming audio call"
//     );


//     try {

//       rejectCall(
//         incomingCall.senderUsername,
//         incomingCall.roomId
//       );

//     } catch (error) {

//       console.error(
//         "❌ Failed to reject call:",
//         error
//       );

//     }


//     setIncomingCall(null);

//   };


//   // =====================================================
//   // END AUDIO CALL
//   // =====================================================

//   const handleEndCall = () => {

//     console.log(
//       "📞 Ending call"
//     );


//     if (
//       showCallCard &&
//       selectedChat
//     ) {

//       try {

//         endCall(
//           selectedChat.name,
//           selectedChat.roomId
//         );

//       } catch (error) {

//         console.error(
//           "❌ Failed to notify remote user:",
//           error
//         );

//       }

//     }


//     cleanupCall();

//   };


//   // =====================================================
//   // UI
//   // =====================================================

//   return (

//     <div className="relative flex flex-col h-full w-full overflow-hidden">

//       {/* =================================================
//           PERSISTENT REMOTE AUDIO
//       ================================================= */}

//         {/* <audio
//         ref={remoteAudioRef}
//         autoPlay
//         playsInline
//         className="hidden"
//       /> */}


// <audio
//   ref={remoteAudioRef}
//   autoPlay
//   playsInline
// />

//       {/* =================================================
//           INCOMING AUDIO CALL CARD — USER B
//       ================================================= */}

//       {incomingCall && (

//         <IncomingAudioCallCard

//           username={
//             incomingCall.senderUsername
//           }

//           image={
//             incomingCall.senderImage
//           }

//           onAccept={
//             handleAcceptCall
//           }

//           onReject={
//             handleRejectCall
//           }

//         />

//       )}


//       {/* =================================================
//           AUDIO CALL CARD — ACTIVE CALL
//       ================================================= */}

//       {showCallCard && (

//         // <AudioCallCard

//         //   username={
//         //     selectedChat?.name
//         //   }

//         //   image={
//         //     selectedChat?.image
//         //   }

//         //   onEndCall={
//         //     handleEndCall
//         //   }

//         //   onMute={() => {

//         //     console.log(
//         //       "🎙️ Mute clicked"
//         //     );

//         //   }}

//         //   onHold={() => {

//         //     console.log(
//         //       "🔊 Hold clicked"
//         //     );

//         //   }}

//         // />

//         <AudioCallCard
//   username={selectedChat?.name}
//   image={selectedChat?.image}
//   onEndCall={handleEndCall}
//   onMute={() => {
//     localStreamRef.current?.getAudioTracks().forEach((track) => {
//       track.enabled = !track.enabled;
//     });

//     console.log("🎙️ Microphone toggled");
//   }}
//   onHold={() => {
//     console.log("🔊 Hold clicked");
//   }}
// />

//       )}


//       {/* =================================================
//           MAIN CHAT
//       ================================================= */}

//       <div className="flex flex-col h-full w-full overflow-hidden">


//         {/* =================================================
//             HEADER
//         ================================================= */}

//         <div
//           className="
//             flex
//             items-center
//             justify-between
//             p-3
//             h-[64px]
//             border-b
//             dark:border-gray-800
//           "
//         >

//           {/* USER */}

//           <div
//             className="
//               flex
//               items-center
//               gap-3
//             "
//           >

//             <Image

//               src={
//                 selectedChat?.image ||
//                 "/assets/avatar.png"
//               }

//               alt="user"

//               width={40}

//               height={40}

//               className="
//                 rounded-full
//                 object-cover
//               "

//             />

//             <p
//               className="
//                 font-semibold
//               "
//             >

//               {
//                 selectedChat?.name ||
//                 "Unknown"
//               }

//             </p>

//           </div>


//           {/* CALL BUTTONS */}

//           <div
//             className="
//               flex
//               items-center
//               gap-3
//             "
//           >

//             <Phone

//               className="
//                 cursor-pointer
//               "

//               onClick={
//                 handleStartCall
//               }

//             />

//             <Video

//               className="
//                 cursor-pointer
//               "

//             />

//           </div>

//         </div>


//         {/* =================================================
//             MESSAGES
//         ================================================= */}

//         <div
//           className="
//             flex-1
//             overflow-y-auto
//             p-4
//             space-y-3
//           "
//         >

//           {messages.map((msg) => {

//             const mine =
//               msg.senderUsername ===
//               currentUsername;


//             return (

//               <div

//                 key={
//                   msg.id
//                 }

//                 className={`
//                   flex
//                   ${
//                     mine
//                       ? "justify-end"
//                       : "justify-start"
//                   }
//                 `}

//               >

//                 <div

//                   className={`
//                     max-w-[70%]
//                     p-2
//                     rounded-lg
//                     ${
//                       mine
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-200 dark:bg-gray-800"
//                     }
//                   `}

//                 >

//                   <p>
//                     {msg.content}
//                   </p>


//                   <p
//                     className="
//                       text-[10px]
//                       opacity-70
//                       mt-1
//                       text-right
//                     "
//                   >

//                     {
//                       new Date(
//                         msg.createdAt
//                       ).toLocaleTimeString(
//                         [],
//                         {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         }
//                       )
//                     }

//                   </p>

//                 </div>

//               </div>

//             );

//           })}

//         </div>


//         {/* =================================================
//             INPUT
//         ================================================= */}

//         <div
//           className="
//             shrink-0
//             p-3
//             border-t
//             dark:border-gray-800
//             flex
//             items-center
//             gap-2
//           "
//         >

//           {/* =================================================
//               EMOJI
//           ================================================= */}

//           <div
//             className="
//               relative
//             "
//           >

//             <button

//               onClick={() =>
//                 setShowEmojiPicker(
//                   !showEmojiPicker
//                 )
//               }

//               className="
//                 p-2
//                 rounded-lg
//                 hover:bg-gray-200
//                 dark:hover:bg-gray-800
//               "

//             >

//               <Smile
//                 size={20}
//               />

//             </button>


//             {showEmojiPicker && (

//               <div
//                 className="
//                   absolute
//                   bottom-12
//                   left-0
//                   z-50
//                 "
//               >

//                 <EmojiPicker

//                   onEmojiClick={
//                     handleEmojiClick
//                   }

//                 />

//               </div>

//             )}

//           </div>


//           {/* =================================================
//               MESSAGE INPUT
//           ================================================= */}

//           <input

//             value={
//               message
//             }

//             onChange={(e) =>
//               setMessage(
//                 e.target.value
//               )
//             }

//             onKeyDown={(e) => {

//               if (
//                 e.key === "Enter"
//               ) {

//                 handleSend();

//               }

//             }}

//             placeholder="
//               Type a message...
//             "

//             className="
//               flex-1
//               p-2
//               rounded-lg
//               bg-gray-100
//               dark:bg-gray-800
//               outline-none
//             "

//           />


//           {/* =================================================
//               ATTACHMENT
//           ================================================= */}

//           <div
//             className="
//               relative
//             "
//           >

//             <button

//               onClick={() =>
//                 setShowAttachMenu(
//                   !showAttachMenu
//                 )
//               }

//               className="
//                 p-2
//                 rounded-lg
//                 hover:bg-gray-200
//                 dark:hover:bg-gray-800
//               "

//             >

//               <Paperclip
//                 size={20}
//               />

//             </button>


//             {showAttachMenu && (

//               <div
//                 className="
//                   absolute
//                   bottom-12
//                   left-1/2
//                   -translate-x-1/2
//                   w-44
//                   bg-white
//                   dark:bg-gray-900
//                   border
//                   border-gray-200
//                   dark:border-gray-700
//                   rounded-xl
//                   shadow-lg
//                   p-2
//                 "
//               >

//                 {/* IMAGE */}

//                 <button
//                   className="
//                     flex
//                     items-center
//                     gap-3
//                     w-full
//                     p-2
//                     rounded-lg
//                     hover:bg-gray-100
//                     dark:hover:bg-gray-800
//                   "
//                 >

//                   <ImageDown
//                     size={20}
//                   />

//                   <span>
//                     Image
//                   </span>

//                 </button>


//                 {/* VIDEO */}

//                 <button
//                   className="
//                     flex
//                     items-center
//                     gap-3
//                     w-full
//                     p-2
//                     rounded-lg
//                     hover:bg-gray-100
//                     dark:hover:bg-gray-800
//                   "
//                 >

//                   <Video
//                     size={20}
//                   />

//                   <span>
//                     Video
//                   </span>

//                 </button>


//                 {/* DOCUMENT */}

//                 <button
//                   className="
//                     flex
//                     items-center
//                     gap-3
//                     w-full
//                     p-2
//                     rounded-lg
//                     hover:bg-gray-100
//                     dark:hover:bg-gray-800
//                   "
//                 >

//                   <FileText
//                     size={20}
//                   />

//                   <span>
//                     Document
//                   </span>

//                 </button>


//                 {/* AUDIO */}

//                 <button
//                   className="
//                     flex
//                     items-center
//                     gap-3
//                     w-full
//                     p-2
//                     rounded-lg
//                     hover:bg-gray-100
//                     dark:hover:bg-gray-800
//                   "
//                 >

//                   <Mic
//                     size={20}
//                   />

//                   <span>
//                     Audio
//                   </span>

//                 </button>

//               </div>

//             )}

//           </div>


//           {/* =================================================
//               MIC
//           ================================================= */}

//           <button
//             className="
//               p-2
//               rounded-lg
//               hover:bg-gray-200
//               dark:hover:bg-gray-800
//             "
//           >

//             <Mic
//               size={20}
//             />

//           </button>


//           {/* =================================================
//               SEND
//           ================================================= */}

//           <button

//             onClick={
//               handleSend
//             }

//             className="
//               bg-blue-500
//               text-white
//               p-2
//               rounded-lg
//               hover:bg-blue-600
//             "

//           >

//             <Send
//               size={18}
//             />

//           </button>


//         </div>

//       </div>

//     </div>

//   );

// }


// export default ChatWindow;


"use client";

import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import AudioCallCard from "./AudioCallCard";
import IncomingAudioCallCard from "./IncomingAudioCallCard";

import {
  Smile,
  Mic,
  Phone,
  Video,
  Send,
  ImageDown,
  Paperclip,
  FileText,
} from "lucide-react";

import {
  getChatHistory,
  connectSocket,
  subscribeRoom,
  subscribeCall,
  sendMessageSocket,
  sendCallOffer,
  sendCallAnswer,
  sendIceCandidate,
  rejectCall,
  endCall,
} from "@/services/chatService";


function ChatWindow({ selectedChat }) {

  // =====================================================
  // CHAT STATE
  // =====================================================

  const [incomingCall, setIncomingCall] = useState(null);

  const [callConnected, setCallConnected] =
    useState(false);

  const [showCallCard, setShowCallCard] =
    useState(false);

  const [showAttachMenu, setShowAttachMenu] =
    useState(false);

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [currentUsername, setCurrentUsername] =
    useState("");

  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);


  // =====================================================
  // WEBRTC REFS
  // =====================================================

  const peerConnectionRef =
    useRef(null);

  const localStreamRef =
    useRef(null);

  const pendingIceCandidatesRef =
    useRef([]);

  const remoteAudioRef =
    useRef(null);


  // =====================================================
  // GET CURRENT USERNAME
  // =====================================================

  useEffect(() => {

    const username =
      localStorage.getItem("username");

    setCurrentUsername(
      username || ""
    );

  }, []);


  // =====================================================
  // LOAD CHAT HISTORY
  // =====================================================

  useEffect(() => {

    if (!selectedChat) return;

    const loadHistory = async () => {

      try {

        const data =
          await getChatHistory(
            selectedChat.roomId
          );

        setMessages(data);

      } catch (error) {

        console.error(
          "❌ Failed to load chat history:",
          error
        );

      }

    };

    loadHistory();

  }, [selectedChat]);


  // =====================================================
  // CLEANUP WEBRTC CALL
  // =====================================================

  const cleanupCall = () => {

    console.log(
      "🧹 Cleaning WebRTC call"
    );


    // =================================================
    // STOP MICROPHONE
    // =================================================

    if (localStreamRef.current) {

      localStreamRef.current
        .getTracks()
        .forEach((track) => {

          track.stop();

        });

    }


    // =================================================
    // STOP REMOTE AUDIO
    // =================================================

    if (remoteAudioRef.current) {

      remoteAudioRef.current.pause();

      remoteAudioRef.current.srcObject =
        null;

    }


    // =================================================
    // CLOSE PEER CONNECTION
    // =================================================

    if (peerConnectionRef.current) {

      peerConnectionRef.current.close();

    }


    // =================================================
    // RESET REFS
    // =================================================

    peerConnectionRef.current =
      null;

    localStreamRef.current =
      null;

    pendingIceCandidatesRef.current =
      [];


    // =================================================
    // RESET UI
    // =================================================

    setShowCallCard(false);

    setIncomingCall(null);

    setCallConnected(false);

  };


  // =====================================================
  // CHAT + CALL SOCKET
  // =====================================================

  useEffect(() => {

    if (!selectedChat) return;

    let chatSubscription = null;
    let callSubscription = null;


    connectSocket(() => {

      console.log(
        "🔌 Socket ready - subscribing to chat + calls"
      );


      // =================================================
      // CHAT SUBSCRIPTION
      // =================================================

      chatSubscription =
        subscribeRoom(
          selectedChat.roomId,
          (newMessage) => {

            console.log(
              "💬 CHAT MESSAGE RECEIVED:",
              newMessage
            );

            setMessages((prev) => [
              ...prev,
              newMessage,
            ]);

          }
        );


      // =================================================
      // CALL SUBSCRIPTION
      // =================================================

      callSubscription =
        subscribeCall(
          async (callData) => {

            console.log(
              "📞 CALL EVENT RECEIVED:",
              callData
            );


            // =============================================
            // INCOMING CALL OFFER
            // =============================================

            if (callData.type === "offer") {

              console.log(
                "📞 Incoming audio call"
              );

              setIncomingCall(
                callData
              );

              return;
            }


            // =============================================
            // CALLER RECEIVES ANSWER
            // =============================================

            if (callData.type === "answer") {

              console.log(
                "📞 Answer received"
              );

              try {

                if (
                  !peerConnectionRef.current
                ) {

                  console.error(
                    "❌ PeerConnection does not exist"
                  );

                  return;
                }


                const answer =
                  JSON.parse(
                    callData.answer
                  );


                await peerConnectionRef.current
                  .setRemoteDescription(
                    new RTCSessionDescription(
                      answer
                    )
                  );


                console.log(
                  "✅ Remote answer set"
                );


                // =========================================
                // ADD QUEUED ICE CANDIDATES
                // =========================================

                for (
                  const candidate
                  of pendingIceCandidatesRef.current
                ) {

                  try {

                    await peerConnectionRef.current
                      .addIceCandidate(
                        new RTCIceCandidate(
                          candidate
                        )
                      );

                    console.log(
                      "✅ Queued ICE candidate added"
                    );

                  } catch (error) {

                    console.error(
                      "❌ Failed queued ICE candidate:",
                      error
                    );

                  }

                }


                pendingIceCandidatesRef.current =
                  [];

              } catch (error) {

                console.error(
                  "❌ Error handling answer:",
                  error
                );

              }

              return;
            }


            // =============================================
            // ICE CANDIDATE
            // =============================================

            if (callData.type === "ice") {

              console.log(
                "🧊 ICE candidate received"
              );

              try {

                const candidate =
                  JSON.parse(
                    callData.candidate
                  );


                // =========================================
                // PEER CONNECTION NOT READY
                // =========================================

                if (
                  !peerConnectionRef.current
                ) {

                  pendingIceCandidatesRef.current
                    .push(candidate);

                  console.log(
                    "🧊 ICE candidate queued - no peer connection"
                  );

                  return;
                }


                // =========================================
                // REMOTE DESCRIPTION NOT READY
                // =========================================

                if (
                  !peerConnectionRef.current
                    .remoteDescription
                ) {

                  pendingIceCandidatesRef.current
                    .push(candidate);

                  console.log(
                    "🧊 ICE candidate queued - remote description not ready"
                  );

                  return;
                }


                // =========================================
                // ADD ICE
                // =========================================

                await peerConnectionRef.current
                  .addIceCandidate(
                    new RTCIceCandidate(
                      candidate
                    )
                  );


                console.log(
                  "✅ ICE candidate added"
                );

              } catch (error) {

                console.error(
                  "❌ Error handling ICE:",
                  error
                );

              }

              return;
            }


            // =============================================
            // CALL REJECTED
            // =============================================

            if (callData.type === "reject") {

              console.log(
                "📞 Call rejected"
              );

              cleanupCall();

              return;
            }


            // =============================================
            // CALL ENDED
            // =============================================

            if (callData.type === "end") {

              console.log(
                "📞 Remote user ended the call"
              );

              cleanupCall();

              return;
            }

          }
        );

    });


    // =====================================================
    // CLEANUP SOCKET SUBSCRIPTIONS
    // =====================================================

    return () => {

      console.log(
        "🧹 Cleaning chat/call subscriptions"
      );

      chatSubscription?.unsubscribe();

      callSubscription?.unsubscribe();

    };

  }, [selectedChat]);


  // =====================================================
  // EMOJI
  // =====================================================

  const handleEmojiClick = (emojiData) => {

    setMessage(
      (prev) =>
        prev + emojiData.emoji
    );

    setShowEmojiPicker(false);

  };


  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const handleSend = async () => {

    if (!message.trim()) return;

    if (!selectedChat) return;

    try {

      sendMessageSocket(
        selectedChat.name,
        message
      );

      setMessage("");

    } catch (error) {

      console.error(
        "❌ Failed to send message:",
        error
      );

    }

  };


  // =====================================================
  // START AUDIO CALL — USER A
  // =====================================================

  const handleStartCall = async () => {

    if (!selectedChat) return;


    try {

      console.log(
        "📞 Starting audio call..."
      );


      // ===============================================
      // GET CALLER MICROPHONE
      // ===============================================

      const stream =
        await navigator.mediaDevices
          .getUserMedia({
            audio: true,
          });


      localStreamRef.current =
        stream;


      const audioTrack =
        stream.getAudioTracks()[0];


      console.log(
        "🎤 MY MICROPHONE:",
        {
          enabled: audioTrack.enabled,
          muted: audioTrack.muted,
          readyState: audioTrack.readyState,
          label: audioTrack.label,
        }
      );


      // ===============================================
      // RESET CONNECTION STATUS
      // ===============================================

      setCallConnected(false);


      // ===============================================
      // SHOW CALL CARD
      // ===============================================

      setShowCallCard(true);


      // ===============================================
      // CREATE PEER CONNECTION
      // ===============================================

      const peerConnection =
        new RTCPeerConnection({
          iceServers: [
            {
              urls:
                "stun:stun.l.google.com:19302",
            },
          ],
        });


      peerConnectionRef.current =
        peerConnection;


      // ===============================================
      // ADD CALLER AUDIO
      // ===============================================

      stream
        .getTracks()
        .forEach((track) => {

          peerConnection.addTrack(
            track,
            stream
          );

        });


      // ===============================================
      // ICE CANDIDATE
      // ===============================================

      peerConnection.onicecandidate =
        (event) => {

          if (event.candidate) {

            console.log(
              "🧊 Sending caller ICE candidate"
            );

            sendIceCandidate(
              selectedChat.name,
              selectedChat.roomId,
              event.candidate
            );

          }

        };


      // ===============================================
      // REMOTE AUDIO
      // ===============================================

      peerConnection.ontrack =
        async (event) => {

          console.log(
            "🎙️ REMOTE TRACK RECEIVED:",
            {
              kind: event.track.kind,
              enabled: event.track.enabled,
              muted: event.track.muted,
              readyState: event.track.readyState,
              streams: event.streams.length,
            }
          );


          const audio =
            remoteAudioRef.current;


          if (!audio) {

            console.error(
              "❌ Remote audio element does not exist"
            );

            return;
          }


          const remoteStream =
            event.streams[0] ||
            new MediaStream([
              event.track,
            ]);


          audio.srcObject =
            remoteStream;

          audio.muted =
            false;

          audio.volume =
            1;


          try {

            await audio.play();

            console.log(
              "🔊 REMOTE AUDIO PLAYING"
            );

          } catch (error) {

            console.error(
              "❌ AUDIO PLAY FAILED:",
              error
            );

          }

        };


      // ===============================================
      // CONNECTION STATE
      // ===============================================

      peerConnection.onconnectionstatechange =
        () => {

          console.log(
            "🔗 Connection state:",
            peerConnection.connectionState
          );


          // CALL CONNECTED
          if (
            peerConnection.connectionState ===
            "connected"
          ) {

            setCallConnected(true);

          }


          // CALL FAILED
          if (
            peerConnection.connectionState ===
            "failed"
          ) {

            console.error(
              "❌ WebRTC connection failed"
            );

            cleanupCall();

          }


          // CALL CLOSED
          if (
            peerConnection.connectionState ===
            "closed"
          ) {

            cleanupCall();

          }

        };


      // ===============================================
      // ICE CONNECTION STATE
      // ===============================================

      peerConnection.oniceconnectionstatechange =
        () => {

          console.log(
            "🧊 ICE connection state:",
            peerConnection.iceConnectionState
          );

        };


      // ===============================================
      // CREATE OFFER
      // ===============================================

      const offer =
        await peerConnection
          .createOffer();


      await peerConnection
        .setLocalDescription(
          offer
        );


      console.log(
        "📄 Caller local description set"
      );


      // ===============================================
      // SEND OFFER
      // ===============================================

      sendCallOffer(
        selectedChat.name,
        selectedChat.roomId,
        offer
      );


      console.log(
        "📞 Audio offer sent"
      );


    } catch (error) {

      console.error(
        "❌ Audio call failed:",
        error
      );

      cleanupCall();

    }

  };


  // =====================================================
  // ACCEPT INCOMING AUDIO CALL — USER B
  // =====================================================

  const handleAcceptCall = async () => {

    if (!incomingCall) return;


    try {

      console.log(
        "📞 Accepting incoming audio call..."
      );


      // ===============================================
      // GET RECEIVER MICROPHONE
      // ===============================================

      const stream =
        await navigator.mediaDevices
          .getUserMedia({
            audio: true,
          });


      localStreamRef.current =
        stream;


      console.log(
        "🎤 RECEIVER MICROPHONE:",
        stream.getAudioTracks().map(
          (track) => ({
            enabled: track.enabled,
            readyState: track.readyState,
            muted: track.muted,
            label: track.label,
          })
        )
      );


      // ===============================================
      // RESET CONNECTION STATUS
      // ===============================================

      setCallConnected(false);


      // ===============================================
      // CREATE PEER CONNECTION
      // ===============================================

      const peerConnection =
        new RTCPeerConnection({
          iceServers: [
            {
              urls:
                "stun:stun.l.google.com:19302",
            },
          ],
        });


      peerConnectionRef.current =
        peerConnection;


      // ===============================================
      // ADD RECEIVER AUDIO
      // ===============================================

      stream
        .getTracks()
        .forEach((track) => {

          peerConnection.addTrack(
            track,
            stream
          );

        });


      // ===============================================
      // ICE CANDIDATE
      // ===============================================

      peerConnection.onicecandidate =
        (event) => {

          if (event.candidate) {

            console.log(
              "🧊 Sending receiver ICE candidate"
            );

            sendIceCandidate(
              incomingCall.senderUsername,
              incomingCall.roomId,
              event.candidate
            );

          }

        };


      // ===============================================
      // REMOTE AUDIO
      // ===============================================

      peerConnection.ontrack =
        async (event) => {

          console.log(
            "🎙️ REMOTE TRACK RECEIVED:",
            {
              kind: event.track.kind,
              enabled: event.track.enabled,
              muted: event.track.muted,
              readyState: event.track.readyState,
              streams: event.streams.length,
            }
          );


          const audio =
            remoteAudioRef.current;


          if (!audio) {

            console.error(
              "❌ Remote audio element does not exist"
            );

            return;
          }


          const remoteStream =
            event.streams[0] ||
            new MediaStream([
              event.track,
            ]);


          audio.srcObject =
            remoteStream;

          audio.muted =
            false;

          audio.volume =
            1;


          try {

            await audio.play();

            console.log(
              "🔊 REMOTE AUDIO PLAYING"
            );

          } catch (error) {

            console.error(
              "❌ AUDIO PLAY FAILED:",
              error
            );

          }

        };


      // ===============================================
      // CONNECTION STATE
      // ===============================================

      peerConnection.onconnectionstatechange =
        () => {

          console.log(
            "🔗 Connection state:",
            peerConnection.connectionState
          );


          // CALL CONNECTED
          if (
            peerConnection.connectionState ===
            "connected"
          ) {

            setCallConnected(true);

          }


          // CALL FAILED
          if (
            peerConnection.connectionState ===
            "failed"
          ) {

            console.error(
              "❌ WebRTC connection failed"
            );

            cleanupCall();

          }


          // CALL CLOSED
          if (
            peerConnection.connectionState ===
            "closed"
          ) {

            cleanupCall();

          }

        };


      // ===============================================
      // ICE CONNECTION STATE
      // ===============================================

      peerConnection.oniceconnectionstatechange =
        () => {

          console.log(
            "🧊 ICE connection state:",
            peerConnection.iceConnectionState
          );

        };


      // ===============================================
      // SET REMOTE OFFER
      // ===============================================

      const remoteOffer =
        JSON.parse(
          incomingCall.offer
        );


      await peerConnection
        .setRemoteDescription(
          new RTCSessionDescription(
            remoteOffer
          )
        );


      console.log(
        "✅ Remote offer set"
      );


      // ===============================================
      // ADD QUEUED ICE CANDIDATES
      // ===============================================

      for (
        const candidate
        of pendingIceCandidatesRef.current
      ) {

        try {

          await peerConnection
            .addIceCandidate(
              new RTCIceCandidate(
                candidate
              )
            );

          console.log(
            "✅ Queued receiver ICE candidate added"
          );

        } catch (error) {

          console.error(
            "❌ Failed queued receiver ICE candidate:",
            error
          );

        }

      }


      pendingIceCandidatesRef.current =
        [];


      // ===============================================
      // CREATE ANSWER
      // ===============================================

      const answer =
        await peerConnection
          .createAnswer();


      await peerConnection
        .setLocalDescription(
          answer
        );


      console.log(
        "📄 Receiver local description set"
      );


      // ===============================================
      // SEND ANSWER
      // ===============================================

      sendCallAnswer(
        incomingCall.senderUsername,
        incomingCall.roomId,
        answer
      );


      console.log(
        "📞 Answer sent"
      );


      // ===============================================
      // CLOSE INCOMING CARD
      // ===============================================

      setIncomingCall(null);


      // ===============================================
      // SHOW CALL CARD
      // ===============================================

      setShowCallCard(true);

    } catch (error) {

      console.error(
        "❌ Failed to accept audio call:",
        error
      );

      cleanupCall();

    }

  };


  // =====================================================
  // REJECT INCOMING AUDIO CALL — USER B
  // =====================================================

  const handleRejectCall = () => {

    if (!incomingCall) return;


    console.log(
      "📞 Rejecting incoming audio call"
    );


    try {

      rejectCall(
        incomingCall.senderUsername,
        incomingCall.roomId
      );

    } catch (error) {

      console.error(
        "❌ Failed to reject call:",
        error
      );

    }


    setIncomingCall(null);

  };

    // =====================================================
  // END AUDIO CALL
  // =====================================================

  const handleEndCall = () => {

    console.log(
      "📞 Ending call"
    );


    if (
      showCallCard &&
      selectedChat
    ) {

      try {

        endCall(
          selectedChat.name,
          selectedChat.roomId
        );

      } catch (error) {

        console.error(
          "❌ Failed to notify remote user:",
          error
        );

      }

    }


    cleanupCall();

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="relative flex flex-col h-full w-full overflow-hidden">

      {/* =================================================
          PERSISTENT REMOTE AUDIO
      ================================================= */}

      <audio
        ref={remoteAudioRef}
        autoPlay
        playsInline
        className="hidden"
      />


      {/* =================================================
          INCOMING AUDIO CALL CARD — USER B
      ================================================= */}

      {/* {incomingCall && (

        <IncomingAudioCallCard

          username={
            incomingCall.senderUsername
          }

          image={
            incomingCall.senderImage
          }

          onAccept={
            handleAcceptCall
          }

          onReject={
            handleRejectCall
          }

        />

      )} */}


      {incomingCall && (
  <IncomingAudioCallCard
    username={incomingCall.senderUsername}
    image={selectedChat?.image || "/assets/avatar.png"}
    onAccept={handleAcceptCall}
    onReject={handleRejectCall}
  />
)}


      {/* =================================================
          AUDIO CALL CARD — ACTIVE CALL
      ================================================= */}

      {showCallCard && (

        <AudioCallCard
          username={
            selectedChat?.name
          }

          image={
            selectedChat?.image
          }

          isConnected={
            callConnected
          }

          onEndCall={
            handleEndCall
          }

          onMute={() => {

            localStreamRef.current
              ?.getAudioTracks()
              .forEach((track) => {

                track.enabled =
                  !track.enabled;

              });

            console.log(
              "🎙️ Microphone toggled"
            );

          }}

          onHold={() => {

            console.log(
              "🔊 Hold clicked"
            );

          }}

        />

      )}


      {/* =================================================
          MAIN CHAT
      ================================================= */}

      <div className="flex flex-col h-full w-full overflow-hidden">


        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between
            p-3
            h-[64px]
            border-b
            dark:border-gray-800
          "
        >

          {/* USER */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <Image

              src={
                selectedChat?.image ||
                "/assets/avatar.png"
              }

              alt="user"

              width={40}

              height={40}

              className="
                rounded-full
                object-cover
              "

            />

            <p
              className="
                font-semibold
              "
            >

              {
                selectedChat?.name ||
                "Unknown"
              }

            </p>

          </div>


          {/* CALL BUTTONS */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <Phone

              className="
                cursor-pointer
              "

              onClick={
                handleStartCall
              }

            />

            <Video

              className="
                cursor-pointer
              "

            />

          </div>

        </div>


        {/* =================================================
            MESSAGES
        ================================================= */}

        <div
          className="
            flex-1
            overflow-y-auto
            p-4
            space-y-3
          "
        >

          {messages.map((msg) => {

            const mine =
              msg.senderUsername ===
              currentUsername;


            return (

              <div

                key={
                  msg.id
                }

                className={`
                  flex
                  ${
                    mine
                      ? "justify-end"
                      : "justify-start"
                  }
                `}

              >

                <div

                  className={`
                    max-w-[70%]
                    p-2
                    rounded-lg
                    ${
                      mine
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 dark:bg-gray-800"
                    }
                  `}

                >

                  <p>
                    {msg.content}
                  </p>


                  <p
                    className="
                      text-[10px]
                      opacity-70
                      mt-1
                      text-right
                    "
                  >

                    {
                      new Date(
                        msg.createdAt
                      ).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    }

                  </p>

                </div>

              </div>

            );

          })}

        </div>


        {/* =================================================
            INPUT
        ================================================= */}

        <div
          className="
            shrink-0
            p-3
            border-t
            dark:border-gray-800
            flex
            items-center
            gap-2
          "
        >

          {/* =================================================
              EMOJI
          ================================================= */}

          <div
            className="
              relative
            "
          >

            <button

              onClick={() =>
                setShowEmojiPicker(
                  !showEmojiPicker
                )
              }

              className="
                p-2
                rounded-lg
                hover:bg-gray-200
                dark:hover:bg-gray-800
              "

            >

              <Smile
                size={20}
              />

            </button>


            {showEmojiPicker && (

              <div
                className="
                  absolute
                  bottom-12
                  left-0
                  z-50
                "
              >

                <EmojiPicker

                  onEmojiClick={
                    handleEmojiClick
                  }

                />

              </div>

            )}

          </div>


          {/* =================================================
              MESSAGE INPUT
          ================================================= */}

          <input

            value={
              message
            }

            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }

            onKeyDown={(e) => {

              if (
                e.key === "Enter"
              ) {

                handleSend();

              }

            }}

            placeholder="
              Type a message...
            "

            className="
              flex-1
              p-2
              rounded-lg
              bg-gray-100
              dark:bg-gray-800
              outline-none
            "

          />


          {/* =================================================
              ATTACHMENT
          ================================================= */}

          <div
            className="
              relative
            "
          >

            <button

              onClick={() =>
                setShowAttachMenu(
                  !showAttachMenu
                )
              }

              className="
                p-2
                rounded-lg
                hover:bg-gray-200
                dark:hover:bg-gray-800
              "

            >

              <Paperclip
                size={20}
              />

            </button>


            {showAttachMenu && (

              <div
                className="
                  absolute
                  bottom-12
                  left-1/2
                  -translate-x-1/2
                  w-44
                  bg-white
                  dark:bg-gray-900
                  border
                  border-gray-200
                  dark:border-gray-700
                  rounded-xl
                  shadow-lg
                  p-2
                "
              >

                {/* IMAGE */}

                <button
                  className="
                    flex
                    items-center
                    gap-3
                    w-full
                    p-2
                    rounded-lg
                    hover:bg-gray-100
                    dark:hover:bg-gray-800
                  "
                >

                  <ImageDown
                    size={20}
                  />

                  <span>
                    Image
                  </span>

                </button>


                {/* VIDEO */}

                <button
                  className="
                    flex
                    items-center
                    gap-3
                    w-full
                    p-2
                    rounded-lg
                    hover:bg-gray-100
                    dark:hover:bg-gray-800
                  "
                >

                  <Video
                    size={20}
                  />

                  <span>
                    Video
                  </span>

                </button>


                {/* DOCUMENT */}

                <button
                  className="
                    flex
                    items-center
                    gap-3
                    w-full
                    p-2
                    rounded-lg
                    hover:bg-gray-100
                    dark:hover:bg-gray-800
                  "
                >

                  <FileText
                    size={20}
                  />

                  <span>
                    Document
                  </span>

                </button>


                {/* AUDIO */}

                <button
                  className="
                    flex
                    items-center
                    gap-3
                    w-full
                    p-2
                    rounded-lg
                    hover:bg-gray-100
                    dark:hover:bg-gray-800
                  "
                >

                  <Mic
                    size={20}
                  />

                  <span>
                    Audio
                  </span>

                </button>

              </div>

            )}

          </div>


          {/* =================================================
              MIC
          ================================================= */}

          <button
            className="
              p-2
              rounded-lg
              hover:bg-gray-200
              dark:hover:bg-gray-800
            "
          >

            <Mic
              size={20}
            />

          </button>


          {/* =================================================
              SEND
          ================================================= */}

          <button

            onClick={
              handleSend
            }

            className="
              bg-blue-500
              text-white
              p-2
              rounded-lg
              hover:bg-blue-600
            "

          >

            <Send
              size={18}
            />

          </button>


        </div>

      </div>

    </div>

  );

}


export default ChatWindow;