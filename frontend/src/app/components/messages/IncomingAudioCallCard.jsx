// "use client";

// import Image from "next/image";
// import { Phone, PhoneOff } from "lucide-react";

// function IncomingAudioCallCard({
//   username,
//   image,
//   onAccept,
//   onReject,
// }) {
//   return (
//     <div
//       className="
//         fixed
//         inset-0
//         z-[9999]
//         flex
//         items-center
//         justify-center
//         bg-black/60
//         backdrop-blur-sm
//       "
//     >
//       <div
//         className="
//           relative
//           w-[350px]
//           max-w-[90vw]
//           rounded-3xl
//           bg-white
//           dark:bg-gray-900
//           shadow-2xl
//           p-8
//           text-center
//         "
//       >
//         {/* CALL STATUS */}

//         <p
//           className="
//             text-sm
//             text-gray-500
//             dark:text-gray-400
//             mb-6
//           "
//         >
//           Incoming audio call
//         </p>

//         {/* PROFILE IMAGE */}

//         <div className="flex justify-center mb-5">
//           <Image
//             src={image || "/assets/avatar.png"}
//             alt={username || "User"}
//             width={110}
//             height={110}
//             className="
//               w-[110px]
//               h-[110px]
//               rounded-full
//               object-cover
//               border-4
//               border-gray-200
//               dark:border-gray-700
//             "
//           />
//         </div>

//         {/* USERNAME */}

//         <h2
//           className="
//             text-xl
//             font-semibold
//             text-gray-900
//             dark:text-white
//           "
//         >
//           {username || "Unknown User"}
//         </h2>

//         {/* CALLING TEXT */}

//         <p
//           className="
//             text-sm
//             text-gray-500
//             dark:text-gray-400
//             mt-2
//           "
//         >
//           is calling you...
//         </p>

//         {/* BUTTONS */}

//         <div
//           className="
//             flex
//             justify-center
//             items-center
//             gap-8
//             mt-10
//           "
//         >
//           {/* REJECT */}

//           <button
//             onClick={onReject}
//             className="
//               w-14
//               h-14
//               rounded-full
//               bg-red-500
//               text-white
//               flex
//               items-center
//               justify-center
//               hover:bg-red-600
//               transition
//             "
//             title="Decline call"
//           >
//             <PhoneOff size={24} />
//           </button>

//           {/* ACCEPT */}

//           <button
//             onClick={onAccept}
//             className="
//               w-14
//               h-14
//               rounded-full
//               bg-green-500
//               text-white
//               flex
//               items-center
//               justify-center
//               hover:bg-green-600
//               transition
//             "
//             title="Accept call"
//           >
//             <Phone size={24} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default IncomingAudioCallCard;




// "use client";

// import Image from "next/image";
// import { Phone, PhoneOff, PhoneCall, X } from "lucide-react";
// import { useState, useRef } from "react";

// function IncomingAudioCallCard({
//   username,
//   image,
//   onAccept,
//   onReject,
// }) {
//   const [minimized, setMinimized] = useState(false);

//   const [position, setPosition] = useState({
//     x:
//       typeof window !== "undefined"
//         ? Math.max(10, window.innerWidth - 80)
//         : 300,

//     y:
//       typeof window !== "undefined"
//         ? Math.max(10, window.innerHeight - 150)
//         : 500,
//   });

//   const draggingRef = useRef(false);
//   const hasDraggedRef = useRef(false);

//   const offsetRef = useRef({
//     x: 0,
//     y: 0,
//   });

//   const handlePointerDown = (e) => {
//     e.preventDefault();

//     draggingRef.current = true;
//     hasDraggedRef.current = false;

//     offsetRef.current = {
//       x: e.clientX - position.x,
//       y: e.clientY - position.y,
//     };

//     e.currentTarget.setPointerCapture(e.pointerId);
//   };

//   const handlePointerMove = (e) => {
//     if (!draggingRef.current) return;

//     hasDraggedRef.current = true;

//     const buttonSize = 56;
//     const bottomMargin = 80;

//     let newX = e.clientX - offsetRef.current.x;
//     let newY = e.clientY - offsetRef.current.y;

//     const maxX = window.innerWidth - buttonSize;

//     const maxY =
//       window.innerHeight -
//       buttonSize -
//       bottomMargin;

//     newX = Math.max(0, Math.min(newX, maxX));
//     newY = Math.max(0, Math.min(newY, maxY));

//     setPosition({
//       x: newX,
//       y: newY,
//     });
//   };

//   const handlePointerUp = (e) => {
//     draggingRef.current = false;

//     try {
//       e.currentTarget.releasePointerCapture(e.pointerId);
//     } catch (error) {
//       // Nothing required
//     }
//   };

//   const handlePhoneClick = () => {
//     if (hasDraggedRef.current) {
//       hasDraggedRef.current = false;
//       return;
//     }

//     setMinimized(false);
//   };

//   // MINIMIZED INCOMING CALL
//   if (minimized) {
//     return (
//       <button
//         onPointerDown={handlePointerDown}
//         onPointerMove={handlePointerMove}
//         onPointerUp={handlePointerUp}
//         onClick={handlePhoneClick}
//         style={{
//           position: "fixed",
//           left: `${position.x}px`,
//           top: `${position.y}px`,
//           zIndex: 9999,
//           touchAction: "none",
//         }}
//         className="
//           w-14
//           h-14
//           rounded-full
//           bg-green-500
//           text-white
//           flex
//           items-center
//           justify-center
//           shadow-xl
//           hover:bg-green-600
//           transition
//           cursor-move
//           select-none
//         "
//         title="Open incoming call"
//       >
//         <PhoneCall size={26} />
//       </button>
//     );
//   }

//   // FULL INCOMING CALL CARD
//   return (
//     <div
//       className="
//         fixed
//         inset-0
//         z-[9999]
//         flex
//         items-center
//         justify-center
//         bg-black/60
//         backdrop-blur-sm
//       "
//     >
//       <div
//         className="
//           relative
//           w-[350px]
//           max-w-[90vw]
//           rounded-3xl
//           bg-white
//           dark:bg-gray-900
//           shadow-2xl
//           p-8
//           text-center
//         "
//       >
//         {/* MINIMIZE BUTTON */}

//         <button
//           onClick={() => setMinimized(true)}
//           className="
//             absolute
//             top-4
//             right-4
//             w-9
//             h-9
//             rounded-full
//             flex
//             items-center
//             justify-center
//             text-gray-500
//             hover:bg-gray-200
//             dark:hover:bg-gray-800
//             transition
//           "
//           title="Minimize call"
//         >
//           <X size={20} />
//         </button>

//         {/* CALL STATUS */}

//         <p
//           className="
//             text-sm
//             text-gray-500
//             dark:text-gray-400
//             mb-6
//           "
//         >
//           Incoming audio call
//         </p>

//         {/* PROFILE IMAGE */}

//         <div className="flex justify-center mb-5">
//           <Image
//             src={image || "/assets/avatar.png"}
//             alt={username || "User"}
//             width={110}
//             height={110}
//             className="
//               w-[110px]
//               h-[110px]
//               rounded-full
//               object-cover
//               border-4
//               border-gray-200
//               dark:border-gray-700
//             "
//           />
//         </div>

//         {/* USERNAME */}

//         <h2
//           className="
//             text-xl
//             font-semibold
//             text-gray-900
//             dark:text-white
//           "
//         >
//           {username || "Unknown User"}
//         </h2>

//         {/* CALLING TEXT */}

//         <p
//           className="
//             text-sm
//             text-gray-500
//             dark:text-gray-400
//             mt-2
//           "
//         >
//           is calling you...
//         </p>

//         {/* BUTTONS */}

//         <div
//           className="
//             flex
//             justify-center
//             items-center
//             gap-8
//             mt-10
//           "
//         >
//           {/* REJECT */}

//           <button
//             onClick={onReject}
//             className="
//               w-14
//               h-14
//               rounded-full
//               bg-red-500
//               text-white
//               flex
//               items-center
//               justify-center
//               hover:bg-red-600
//               transition
//             "
//             title="Decline call"
//           >
//             <PhoneOff size={24} />
//           </button>

//           {/* ACCEPT */}

//           <button
//             onClick={onAccept}
//             className="
//               w-14
//               h-14
//               rounded-full
//               bg-green-500
//               text-white
//               flex
//               items-center
//               justify-center
//               hover:bg-green-600
//               transition
//             "
//             title="Accept call"
//           >
//             <Phone size={24} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default IncomingAudioCallCard;




"use client";

import Image from "next/image";
import { Phone, PhoneOff, PhoneCall, X } from "lucide-react";
import { useState, useRef } from "react";

function IncomingAudioCallCard({
  username,
  image,
  onAccept,
  onReject,
}) {
  const [minimized, setMinimized] = useState(false);

  const [position, setPosition] = useState({
    x:
      typeof window !== "undefined"
        ? Math.max(10, window.innerWidth - 80)
        : 300,

    y:
      typeof window !== "undefined"
        ? Math.max(10, window.innerHeight - 150)
        : 500,
  });

  const draggingRef = useRef(false);
  const hasDraggedRef = useRef(false);

  const offsetRef = useRef({
    x: 0,
    y: 0,
  });

  const handlePointerDown = (e) => {
    e.preventDefault();

    draggingRef.current = true;
    hasDraggedRef.current = false;

    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return;

    hasDraggedRef.current = true;

    const buttonSize = 56;
    const bottomMargin = 80;

    let newX = e.clientX - offsetRef.current.x;
    let newY = e.clientY - offsetRef.current.y;

    const maxX = window.innerWidth - buttonSize;
    const maxY =
      window.innerHeight - buttonSize - bottomMargin;

    newX = Math.max(0, Math.min(newX, maxX));
    newY = Math.max(0, Math.min(newY, maxY));

    setPosition({
      x: newX,
      y: newY,
    });
  };

  const handlePointerUp = (e) => {
    draggingRef.current = false;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (error) {
      // Nothing required
    }
  };

  const handlePhoneClick = () => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }

    setMinimized(false);
  };

  // Minimized incoming call
  if (minimized) {
    return (
      <button
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handlePhoneClick}
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
          touchAction: "none",
        }}
        className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-xl hover:bg-green-600 transition cursor-move select-none"
        title="Open incoming call"
      >
        <PhoneCall size={26} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">

      <div className="relative w-[350px] max-w-[90vw] rounded-3xl bg-white dark:bg-gray-900 shadow-2xl p-8 text-center">

        {/* Minimize */}
        <button
          onClick={() => setMinimized(true)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
          title="Minimize call"
        >
          <X size={20} />
        </button>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Incoming audio call
        </p>

        {/* Profile image */}
        <div className="flex justify-center mb-5">
          <Image
            src={image || "/assets/avatar.png"}
            alt={username || "User"}
            width={110}
            height={110}
            className="w-[110px] h-[110px] rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Username */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {username || "Unknown User"}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          is calling you...
        </p>

        {/* Accept / Reject */}
        <div className="flex justify-center items-center gap-8 mt-10">

          {/* Reject */}
          <button
            onClick={onReject}
            className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
            title="Decline call"
          >
            <PhoneOff size={24} />
          </button>

          {/* Accept */}
          <button
            onClick={onAccept}
            className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition"
            title="Accept call"
          >
            <Phone size={24} />
          </button>

        </div>
      </div>
    </div>
  );
}

export default IncomingAudioCallCard;

