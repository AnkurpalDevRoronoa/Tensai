


// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { Search } from "lucide-react";

// import {
//   getConversations,
//   getNetworkUsers,
//   getRoom,
// } from "@/services/chatService";

// function ChatList({ selectedChat, setSelectedChat }) {
//   const [chats, setChats] = useState([]);
//   const [networkUsers, setNetworkUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     loadChats();
//     loadNetworkUsers();
//   }, []);

//   const loadChats = async () => {
//     try {
//       const data = await getConversations();
//        console.log("CONVERSATIONS:", data);
     




//       const formatted = data.map((chat) => ({
//   roomId: chat.roomId,
//   name: chat.username,
//   image:
//     chat.profileImage && chat.profileImage !== ""
//       ? chat.profileImage
//       : "/assets/default-avatar.png",
//   lastMessage: chat.lastMessage,
// }));

//       setChats(formatted);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadNetworkUsers = async () => {
//     try {
//       const data = await getNetworkUsers();
//       setNetworkUsers(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const openChat = async (user) => {
//     try {
//       const room = await getRoom(user.username);


//       const selected = {
//   roomId: room.roomId,
//   name: user.username,
//   image:
//     user.profileImage && user.profileImage !== ""
//       ? user.profileImage
//       : "/assets/default-avatar.png",
//   lastMessage: "",
// };

//       setSelectedChat(selected);

//       setSearch("");

//       await loadChats();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const filteredUsers = networkUsers.filter((user) =>
//     user.username.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="w-full h-full flex flex-col border-r dark:border-gray-800">

//       {/* SEARCH */}
//       <div className="relative p-3 border-b dark:border-gray-800">

//         <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">

//           <Search size={18} />

//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search people..."
//             className="bg-transparent flex-1 outline-none text-sm"
//           />

//         </div>

//         {search.trim() !== "" && (

//           <div className="absolute left-3 right-3 mt-2 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">

//             {filteredUsers.length === 0 && (
//               <div className="p-3 text-sm text-gray-500">
//                 No user found
//               </div>
//             )}

//             {filteredUsers.map((user) => (
//               <div
//                 key={user.username}
//                 onClick={() => openChat(user)}
//                 className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
//               >
//                 <Image
//                   src={
//                     user.profileImage && user.profileImage !== ""
//                       ? user.profileImage
//                       : "/assets/default-avatar.png"
//                   }
//                   alt={user.username}
//                   width={40}
//                   height={40}
//                   className="rounded-full object-cover"
//                 />

//                 <span className="font-medium">
//                   {user.username}
//                 </span>
//               </div>
//             ))}

//           </div>

//         )}

//       </div>

//       {/* CONVERSATIONS */}

//       <div className="flex-1 overflow-y-auto">

//         {loading && (
//           <div className="p-4 text-center text-gray-500">
//             Loading...
//           </div>
//         )}

//         {!loading && chats.length === 0 && (
//           <div className="p-4 text-center text-gray-500">
//             No conversations yet.
//           </div>
//         )}

//         {chats.map((chat) => {

//           const isActive =
//             selectedChat?.roomId === chat.roomId;

//           return (

//             <div
//               key={chat.roomId}
//               onClick={() => setSelectedChat(chat)}
//               className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
//                 isActive
//                   ? "bg-gray-200 dark:bg-gray-700"
//                   : ""
//               }`}
//             >

//               <Image
//                 src={chat.image}
//                 alt={chat.name}
//                 width={45}
//                 height={45}
//                 className="rounded-full object-cover"
//               />

//               <div className="flex-1 overflow-hidden">

//                 <p className="font-semibold text-sm">
//                   {chat.name}
//                 </p>

//                 <p className="text-xs text-gray-500 truncate">
//                   {chat.lastMessage}
//                 </p>

//               </div>

//               {/* {chat.unreadCount > 0 && (
//                 <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
//                   {chat.unreadCount}
//                 </div>
//               )} */}

//             </div>

//           );
//         })}

//       </div>

//     </div>
//   );
// }

// export default ChatList;















"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";

import {
  getConversations,
  getNetworkUsers,
  getRoom,
} from "@/services/chatService";

function ChatList({ selectedChat, setSelectedChat }) {
  const [chats, setChats] = useState([]);
  const [networkUsers, setNetworkUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadChats();
    loadNetworkUsers();
  }, []);

  const loadChats = async () => {
    try {
      const data = await getConversations();
       console.log("CONVERSATIONS:", data);
     




      const formatted = data.map((chat) => ({
  roomId: chat.roomId,
  name: chat.username,
  image:
    chat.profileImage && chat.profileImage !== ""
      ? chat.profileImage
      : "/assets/default-avatar.png",
  lastMessage: chat.lastMessage,
}));

      setChats(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadNetworkUsers = async () => {
    try {
      const data = await getNetworkUsers();
      setNetworkUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

//   const openChat = async (user) => {
//     try {
//       const room = await getRoom(user.username);


//       const selected = {
//   roomId: room.roomId,
//   name: user.username,
//   image:
//     user.profileImage && user.profileImage !== ""
//       ? user.profileImage
//       : "/assets/default-avatar.png",
//   lastMessage: "",
// };

//       setSelectedChat(selected);

//       setSearch("");

//       await loadChats();
//     } catch (err) {
//       console.error(err);
//     }
//   };

const openChat = async (user) => {
  try {
    const room = await getRoom(user.username);

    console.log("ROOM RESPONSE:", room);

    const selected = {
      roomId: room.roomId,
      name: user.username,
      image:
        user.profileImage && user.profileImage !== ""
          ? user.profileImage
          : "/assets/default-avatar.png",
      lastMessage: "",
    };

    setSelectedChat(selected);

    setSearch("");

    await loadChats();
  } catch (err) {
    console.error(err);
  }
};

  const filteredUsers = networkUsers.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col border-r dark:border-gray-800">

      {/* SEARCH */}
      <div className="relative p-3 border-b dark:border-gray-800">

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">

          <Search size={18} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search people..."
            className="bg-transparent flex-1 outline-none text-sm"
          />

        </div>

        {search.trim() !== "" && (

          <div className="absolute left-3 right-3 mt-2 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">

            {filteredUsers.length === 0 && (
              <div className="p-3 text-sm text-gray-500">
                No user found
              </div>
            )}

            {filteredUsers.map((user) => (
              <div
                key={user.username}
                onClick={() => openChat(user)}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Image
                  src={
                    user.profileImage && user.profileImage !== ""
                      ? user.profileImage
                      : "/assets/default-avatar.png"
                  }
                  alt={user.username}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />

                <span className="font-medium">
                  {user.username}
                </span>
              </div>
            ))}

          </div>

        )}

      </div>

      {/* CONVERSATIONS */}

      <div className="flex-1 overflow-y-auto">

        {loading && (
          <div className="p-4 text-center text-gray-500">
            Loading...
          </div>
        )}

        {!loading && chats.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No conversations yet.
          </div>
        )}

        {chats.map((chat) => {

          const isActive =
            selectedChat?.roomId === chat.roomId;

          return (

            <div
              key={chat.roomId}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                isActive
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }`}
            >

              <Image
                src={chat.image}
                alt={chat.name}
                width={45}
                height={45}
                className="rounded-full object-cover"
              />

              <div className="flex-1 overflow-hidden">

                <p className="font-semibold text-sm">
                  {chat.name}
                </p>

                <p className="text-xs text-gray-500 truncate">
                  {chat.lastMessage}
                </p>

              </div>

              {/* {chat.unreadCount > 0 && (
                <div className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                  {chat.unreadCount}
                </div>
              )} */}

            </div>

          );
        })}

      </div>

    </div>
  );
}

export default ChatList;