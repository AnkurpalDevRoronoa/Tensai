

import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { API_URL, SOCKET_URL } from "./api";

const CHAT_API_URL = `${API_URL}/chat`;

let stompClient = null;

// =======================
// HELPERS
// =======================

const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// =======================
// GET ALL CONVERSATIONS
// =======================

export const getConversations = async () => {
  const response = await fetch(`${CHAT_API_URL}/conversations`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load conversations");
  }

  return response.json();
};

// =======================
// GET ROOM
// =======================

export const getRoom = async (username) => {
  const response = await fetch(
    `${CHAT_API_URL}/room/${username}`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load room");
  }

  return response.json();
};

// =======================
// GET CHAT HISTORY
// =======================

export const getChatHistory = async (roomId) => {
  const response = await fetch(
    `${CHAT_API_URL}/history/${roomId}`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load chat history");
  }

  return response.json();
};

// =======================
// SEND MESSAGE (REST)
// =======================

export const sendMessage = async (
  receiverUsername,
  content
) => {
  const response = await fetch(
    `${CHAT_API_URL}/send`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        receiverUsername,
        content,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
};

// =======================
// CONNECT SOCKET
// =======================

// export const connectSocket = (callback) => {

//   if (stompClient?.active) {
//     callback?.();
//     return;
//   }

//   const socket = new SockJS(`${SOCKET_URL}/chat`);

//   stompClient = new Client({

//     webSocketFactory: () => socket,

//     reconnectDelay: 5000,

//     connectHeaders: {
//       Authorization: `Bearer ${getToken()}`,
//     },

//     debug: (str) => {
//       console.log(str);
//     },

//     onConnect: () => {
//       console.log("✅ WebSocket Connected");
//       callback?.();
//     },

//     onDisconnect: () => {
//       console.log("❌ WebSocket Disconnected");
//     },

//     onStompError: (frame) => {
//       console.error("STOMP Error:", frame.headers.message);
//       console.error(frame.body);
//     },

//     onWebSocketError: (error) => {
//       console.error("WebSocket Error:", error);
//     },

//   });

//   stompClient.activate();
// };


export const connectSocket = (callback) => {
  // Already connected
  if (stompClient?.connected) {
    callback?.();
    return;
  }

  // Connection is currently being established
  if (stompClient?.active) {
    return;
  }

  stompClient = new Client({
    webSocketFactory: () => {
      return new SockJS(`${SOCKET_URL}/chat`);
    },

    reconnectDelay: 5000,

    connectHeaders: {
      Authorization: `Bearer ${getToken()}`,
    },

    debug: (str) => {
      console.log(str);
    },

    onConnect: () => {
      console.log("✅ WebSocket Connected");
      callback?.();
    },

    onDisconnect: () => {
      console.log("❌ WebSocket Disconnected");
    },

    onStompError: (frame) => {
      console.error(
        "STOMP Error:",
        frame.headers.message
      );

      console.error("STOMP Body:", frame.body);
    },

    onWebSocketError: (error) => {
      console.error("WebSocket Error:", error);
    },
  });

  stompClient.activate();
};

// =======================
// SUBSCRIBE TO ROOM
// =======================

export const subscribeRoom = (
  roomId,
  callback
) => {

  if (!stompClient || !stompClient.connected) {
    console.error("Socket not connected");
    return null;
  }

  
// return stompClient.subscribe(
//   `/topic/${roomId}`,
return stompClient.subscribe(
  `/topic/chat/${roomId}`,
    (message) => {
      callback(JSON.parse(message.body));
    }
  );
};


export const sendMessageSocket = (
  receiverUsername,
  content
) => {

  if (!stompClient || !stompClient.connected) {
    console.error("Socket not connected");
    return;
  }

  stompClient.publish({
    destination: "/app/chat.send",

    body: JSON.stringify({
      receiverUsername,
      content,
    }),
  });
};

// =======================
// DISCONNECT SOCKET
// =======================

export const disconnectSocket = () => {

  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }

};

// =======================
// SOCKET STATUS
// =======================

export const isSocketConnected = () => {
  return !!stompClient?.connected;
};

// =======================
// NETWORK USERS
// =======================

export const getNetworkUsers = async () => {

  const response = await fetch(
    `${API_URL}/profile/network`,
    {
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load network users");
  }

  return response.json();
};

// =======================
// CALL SIGNALING
// =======================

// export const subscribeCall = (userId, callback) => {
//   if (!stompClient || !stompClient.connected) {
//     console.error("Socket not connected");
//     return null;
//   }

//   return stompClient.subscribe(
//     `/topic/call/${userId}`,
//     (message) => {
//       callback(JSON.parse(message.body));
//     }
//   );
// };

// export const sendCallSignal = (signal) => {
//   if (!stompClient || !stompClient.connected) {
//     console.error("Socket not connected");
//     return;
//   }

//   stompClient.publish({
//     destination: "/app/call.signal",
//     body: JSON.stringify(signal),
//   });
// };



// =======================
// CALL SOCKET
// =======================

// export const subscribeCall = (callback) => {

//   if (!stompClient || !stompClient.connected) {
//     console.error("Socket not connected");
//     return null;
//   }

//   return stompClient.subscribe(
//     "/user/queue/call",
//     (message) => {
//       try {
//         const data = JSON.parse(message.body);

//         console.log("📞 CALL MESSAGE RECEIVED:", data);

//         callback(data);

//       } catch (error) {
//         console.error("Invalid call message:", error);
//       }
//     }
//   );
// };

export const subscribeCall = (callback) => {
  if (!stompClient || !stompClient.connected) {
    console.error("❌ Socket not connected - cannot subscribe to calls");
    return null;
  }

  console.log("📞 Subscribing to /user/queue/call");

  const subscription = stompClient.subscribe(
    "/user/queue/call",
    (message) => {
      console.log("📞 RAW CALL MESSAGE RECEIVED:", message);

      try {
        const data = JSON.parse(message.body);

        console.log("📞 CALL DATA:", data);

        callback(data);
      } catch (error) {
        console.error("❌ Invalid call message:", error);
      }
    }
  );

  console.log("✅ Call subscription created:", subscription.id);

  return subscription;
};


// =======================
// SEND CALL OFFER
// =======================

export const sendCallOffer = (
  receiverUsername,
  roomId,
  offer
) => {

  if (!stompClient || !stompClient.connected) {
    console.error("Socket not connected");
    return;
  }

  stompClient.publish({
    destination: "/app/call.offer",

    body: JSON.stringify({
      type: "offer",
      receiverUsername,
      roomId,
      offer: JSON.stringify(offer)
    })
  });
};


// =======================
// SEND CALL ANSWER
// =======================

export const sendCallAnswer = (
  receiverUsername,
  roomId,
  answer
) => {

  if (!stompClient || !stompClient.connected) {
    console.error("Socket not connected");
    return;
  }

  stompClient.publish({
    destination: "/app/call.answer",

    body: JSON.stringify({
      type: "answer",
      receiverUsername,
      roomId,
      answer: JSON.stringify(answer)
    })
  });
};


// =======================
// SEND ICE CANDIDATE
// =======================

export const sendIceCandidate = (
  receiverUsername,
  roomId,
  candidate
) => {

  if (!stompClient || !stompClient.connected) {
    console.error("Socket not connected");
    return;
  }

  stompClient.publish({
    destination: "/app/call.ice",

    body: JSON.stringify({
      type: "ice",
      receiverUsername,
      roomId,
      candidate: JSON.stringify(candidate)
    })
  });
};


// =======================
// REJECT CALL
// =======================

export const rejectCall = (
  receiverUsername,
  roomId
) => {

  if (!stompClient || !stompClient.connected) {
    console.error("Socket not connected");
    return;
  }

  stompClient.publish({
    destination: "/app/call.reject",

    body: JSON.stringify({
      type: "reject",
      receiverUsername,
      roomId
    })
  });
};


// =======================
// END CALL
// =======================

export const endCall = (
  receiverUsername,
  roomId
) => {

  if (!stompClient || !stompClient.connected) {
    console.error("Socket not connected");
    return;
  }

  stompClient.publish({
    destination: "/app/call.end",

    body: JSON.stringify({
      type: "end",
      receiverUsername,
      roomId
    })
  });
};