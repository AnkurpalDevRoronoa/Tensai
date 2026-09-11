// "use client";

// import Image from "next/image";
// import { useState } from "react";
// import { Mic, MicOff, PhoneOff, Volume2 } from "lucide-react";

// function AudioCallCard({
//   username,
//   image,
//   onEndCall,
//   onMute,
//   onHold,
// }) {
//   const [muted, setMuted] = useState(false);

//   const handleMute = () => {
//     setMuted((prev) => !prev);

//     if (onMute) {
//       onMute();
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">

//       <div className="w-[350px] rounded-3xl bg-white dark:bg-gray-900 shadow-2xl p-8 text-center">

//         {/* STATUS */}
//         <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
//           Calling...
//         </p>

//         {/* PROFILE IMAGE */}
//         <div className="flex justify-center mb-5">
//           <Image
//             src={image || "/assets/avatar.png"}
//             alt={username || "User"}
//             width={110}
//             height={110}
//             className="w-[110px] h-[110px] rounded-full object-cover border-4 border-gray-200 dark:border-gray-700"
//           />
//         </div>

//         {/* USERNAME */}
//         <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
//           {username || "Unknown User"}
//         </h2>

//         {/* CALL STATUS */}
//         <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
//           Waiting for answer
//         </p>

//         {/* CONTROLS */}
//         <div className="flex justify-center items-center gap-5 mt-10">

//           {/* MUTE */}
//           <button
//             onClick={handleMute}
//             className="
//               w-12 h-12
//               rounded-full
//               bg-gray-200 dark:bg-gray-800
//               flex items-center justify-center
//               hover:bg-gray-300 dark:hover:bg-gray-700
//               transition
//             "
//           >
//             {muted ? (
//               <MicOff size={20} />
//             ) : (
//               <Mic size={20} />
//             )}
//           </button>

//           {/* VOLUME */}
//           <button
//             onClick={onHold}
//             className="
//               w-12 h-12
//               rounded-full
//               bg-gray-200 dark:bg-gray-800
//               flex items-center justify-center
//               hover:bg-gray-300 dark:hover:bg-gray-700
//               transition
//             "
//           >
//             <Volume2 size={20} />
//           </button>

//           {/* END CALL */}
//           <button
//             onClick={onEndCall}
//             className="
//               w-14 h-14
//               rounded-full
//               bg-red-500
//               text-white
//               flex items-center justify-center
//               hover:bg-red-600
//               transition
//             "
//           >
//             <PhoneOff size={24} />
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default AudioCallCard;


// "use client";

// import Image from "next/image";
// import { useState, useRef } from "react";
// import {
//   Mic,
//   MicOff,
//   PhoneOff,
//   Volume2,
//   X,
//   PhoneCall,
// } from "lucide-react";

// function AudioCallCard({
//   username,
//   image,
//   onEndCall,
//   onMute,
//   onHold,
// }) {
//   const [muted, setMuted] = useState(false);
//   const [minimized, setMinimized] = useState(false);

//   // Position of floating PhoneCall button
//   const [position, setPosition] = useState({
//     x: typeof window !== "undefined" ? window.innerWidth - 90 : 500,
//     y: typeof window !== "undefined" ? window.innerHeight - 90 : 500,
//   });

//   const draggingRef = useRef(false);
//   const hasDraggedRef = useRef(false);

//   const offsetRef = useRef({
//     x: 0,
//     y: 0,
//   });

//   // -----------------------------
//   // MUTE
//   // -----------------------------

//   const handleMute = () => {
//     setMuted((prev) => !prev);

//     if (onMute) {
//       onMute();
//     }
//   };

//   // -----------------------------
//   // START DRAG
//   // -----------------------------

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

//   // -----------------------------
//   // DRAG
//   // -----------------------------

//   const handlePointerMove = (e) => {
//     if (!draggingRef.current) return;

//     hasDraggedRef.current = true;

//     const buttonSize = 56;

//     let newX = e.clientX - offsetRef.current.x;
//     let newY = e.clientY - offsetRef.current.y;

//     // Keep button inside screen
//     const maxX = window.innerWidth - buttonSize;
//     const maxY = window.innerHeight - buttonSize;

//     newX = Math.max(0, Math.min(newX, maxX));
//     newY = Math.max(0, Math.min(newY, maxY));

//     setPosition({
//       x: newX,
//       y: newY,
//     });
//   };

//   // -----------------------------
//   // END DRAG
//   // -----------------------------

//   const handlePointerUp = (e) => {
//     draggingRef.current = false;

//     try {
//       e.currentTarget.releasePointerCapture(e.pointerId);
//     } catch (error) {
//       // Nothing needed
//     }
//   };

//   // -----------------------------
//   // CLICK FLOATING PHONE
//   // -----------------------------

//   const handlePhoneCallClick = () => {
//     // If user dragged the button,
//     // don't open the card.
//     if (hasDraggedRef.current) {
//       hasDraggedRef.current = false;
//       return;
//     }

//     setMinimized(false);
//   };

//   // =========================================================
//   // MINIMIZED CALL
//   // =========================================================

//   if (minimized) {
//     return (
//       <button
//         onPointerDown={handlePointerDown}
//         onPointerMove={handlePointerMove}
//         onPointerUp={handlePointerUp}
//         onClick={handlePhoneCallClick}
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
//         title="Drag or click to open call"
//       >
//         <PhoneCall size={26} />
//       </button>
//     );
//   }

//   // =========================================================
//   // FULL CALL CARD
//   // =========================================================

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
//           rounded-3xl
//           bg-white
//           dark:bg-gray-900
//           shadow-2xl
//           p-8
//           text-center
//         "
//       >

//         {/* =========================
//             MINIMIZE BUTTON
//         ========================== */}

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

//         {/* =========================
//             STATUS
//         ========================== */}

//         <p className="
//           text-sm
//           text-gray-500
//           dark:text-gray-400
//           mb-6
//         ">
//           Calling...
//         </p>

//         {/* =========================
//             PROFILE IMAGE
//         ========================== */}

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

//         {/* =========================
//             USERNAME
//         ========================== */}

//         <h2 className="
//           text-xl
//           font-semibold
//           text-gray-900
//           dark:text-white
//         ">
//           {username || "Unknown User"}
//         </h2>

//         {/* =========================
//             CALL STATUS
//         ========================== */}

//         <p className="
//           text-sm
//           text-gray-500
//           dark:text-gray-400
//           mt-2
//         ">
//           Waiting for answer
//         </p>

//         {/* =========================
//             CONTROLS
//         ========================== */}

//         <div className="
//           flex
//           justify-center
//           items-center
//           gap-5
//           mt-10
//         ">

//           {/* =========================
//               MIC
//           ========================== */}

//           <button
//             onClick={handleMute}
//             className="
//               w-12
//               h-12
//               rounded-full
//               bg-gray-200
//               dark:bg-gray-800
//               flex
//               items-center
//               justify-center
//               hover:bg-gray-300
//               dark:hover:bg-gray-700
//               transition
//             "
//             title={muted ? "Unmute" : "Mute"}
//           >
//             {muted ? (
//               <MicOff size={20} />
//             ) : (
//               <Mic size={20} />
//             )}
//           </button>

//           {/* =========================
//               VOLUME
//           ========================== */}

//           <button
//             onClick={onHold}
//             className="
//               w-12
//               h-12
//               rounded-full
//               bg-gray-200
//               dark:bg-gray-800
//               flex
//               items-center
//               justify-center
//               hover:bg-gray-300
//               dark:hover:bg-gray-700
//               transition
//             "
//             title="Volume"
//           >
//             <Volume2 size={20} />
//           </button>

//           {/* =========================
//               END CALL
//           ========================== */}

//           <button
//             onClick={onEndCall}
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
//             title="End call"
//           >
//             <PhoneOff size={24} />
//           </button>

//         </div>

//       </div>
//     </div>
//   );
// }

// export default AudioCallCard;



// "use client";

// import Image from "next/image";
// import { useState, useRef } from "react";
// import {
//   Mic,
//   MicOff,
//   PhoneOff,
//   Volume2,
//   X,
//   PhoneCall,
// } from "lucide-react";



// function AudioCallCard({
//   username,
//   image,
//   incoming = false,
//   onAccept,
//   onReject,
//   onEndCall,
//   onMute,
//   onHold,
// }) {
//   const [muted, setMuted] = useState(false);
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

//   // ==============================
//   // MUTE
//   // ==============================

//   const handleMute = () => {
//     setMuted((prev) => !prev);

//     if (onMute) {
//       onMute();
//     }
//   };

//   // ==============================
//   // START DRAG
//   // ==============================

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

//   // ==============================
//   // DRAG
//   // ==============================

//   const handlePointerMove = (e) => {
//     if (!draggingRef.current) return;

//     hasDraggedRef.current = true;

//     const buttonSize = 56;

//     // Extra bottom space for mobile browser UI
//     const bottomMargin = 80;

//     let newX = e.clientX - offsetRef.current.x;
//     let newY = e.clientY - offsetRef.current.y;

//     // Keep button inside left/right boundaries
//     const maxX = window.innerWidth - buttonSize;

//     // Keep button above mobile bottom browser area
//     const maxY =
//       window.innerHeight -
//       buttonSize -
//       bottomMargin;

//     newX = Math.max(
//       0,
//       Math.min(newX, maxX)
//     );

//     newY = Math.max(
//       0,
//       Math.min(newY, maxY)
//     );

//     setPosition({
//       x: newX,
//       y: newY,
//     });
//   };

//   // ==============================
//   // END DRAG
//   // ==============================

//   const handlePointerUp = (e) => {
//     draggingRef.current = false;

//     try {
//       e.currentTarget.releasePointerCapture(
//         e.pointerId
//       );
//     } catch (error) {
//       // Nothing required
//     }
//   };

//   // ==============================
//   // PHONE ICON CLICK
//   // ==============================

//   const handlePhoneCallClick = () => {
//     // If the user dragged the icon,
//     // don't open the card.
//     if (hasDraggedRef.current) {
//       hasDraggedRef.current = false;
//       return;
//     }

//     setMinimized(false);
//   };

//   // =====================================================
//   // MINIMIZED VERSION
//   // =====================================================

//   if (minimized) {
//     return (
//       <button
//         onPointerDown={handlePointerDown}
//         onPointerMove={handlePointerMove}
//         onPointerUp={handlePointerUp}
//         onClick={handlePhoneCallClick}
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
//         title="Open call"
//       >
//         <PhoneCall size={26} />
//       </button>
//     );
//   }

//   // =====================================================
//   // FULL CALL CARD
//   // =====================================================

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

//         {/* ==============================
//             CLOSE / MINIMIZE
//         =============================== */}

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

//         {/* ==============================
//             CALL STATUS
//         =============================== */}
// {/* 
//         <p
//           className="
//             text-sm
//             text-gray-500
//             dark:text-gray-400
//             mb-6
//           "
//         >
//           Calling...
//         </p> */}
// <p
//   className="
//     text-sm
//     text-gray-500
//     dark:text-gray-400
//     mb-6
//   "
// >
//   {incoming ? "Incoming audio call" : "Calling..."}
// </p>
//         {/* ==============================
//             PROFILE IMAGE
//         =============================== */}

//         <div className="flex justify-center mb-5">
//           <Image
//             src={
//               image ||
//               "/assets/avatar.png"
//             }
//             alt={
//               username ||
//               "User"
//             }
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

//         {/* ==============================
//             USERNAME
//         =============================== */}

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

//         {/* ==============================
//             WAITING STATUS
//         =============================== */}

//         {/* <p
//           className="
//             text-sm
//             text-gray-500
//             dark:text-gray-400
//             mt-2
//           "
//         >
//           Waiting for answer
//         </p> */}

//         <p
//   className="
//     text-sm
//     text-gray-500
//     dark:text-gray-400
//     mt-2
//   "
// >
//   {incoming
//     ? `${username || "Someone"} is calling you`
//     : "Waiting for answer"}
// </p>

//         {/* ==============================
//             CONTROLS
//         =============================== */}

//         <div
//           className="
//             flex
//             justify-center
//             items-center
//             gap-5
//             mt-10
//           "
//         >

//           {/* ==============================
//               MICROPHONE
//           =============================== */}

//           <button
//             onClick={handleMute}
//             className="
//               w-12
//               h-12
//               rounded-full
//               bg-gray-200
//               dark:bg-gray-800
//               flex
//               items-center
//               justify-center
//               hover:bg-gray-300
//               dark:hover:bg-gray-700
//               transition
//             "
//             title={
//               muted
//                 ? "Unmute"
//                 : "Mute"
//             }
//           >
//             {muted ? (
//               <MicOff size={20} />
//             ) : (
//               <Mic size={20} />
//             )}
//           </button>

//           {/* ==============================
//               VOLUME
//           =============================== */}

//           <button
//             onClick={onHold}
//             className="
//               w-12
//               h-12
//               rounded-full
//               bg-gray-200
//               dark:bg-gray-800
//               flex
//               items-center
//               justify-center
//               hover:bg-gray-300
//               dark:hover:bg-gray-700
//               transition
//             "
//             title="Volume"
//           >
//             <Volume2 size={20} />
//           </button>

//           {/* ==============================
//               END CALL
//           =============================== */}
// {/* 
//           <button
//             onClick={onEndCall}
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
//             title="End call"
//           >
//             <PhoneOff size={24} />
//           </button> */}


//           {incoming ? (
//   <>
//     {/* REJECT */}
//     <button
//       onClick={onReject}
//       className="
//         w-14
//         h-14
//         rounded-full
//         bg-red-500
//         text-white
//         flex
//         items-center
//         justify-center
//         hover:bg-red-600
//         transition
//       "
//       title="Reject call"
//     >
//       <PhoneOff size={24} />
//     </button>

//     {/* ACCEPT */}
//     <button
//       onClick={onAccept}
//       className="
//         w-14
//         h-14
//         rounded-full
//         bg-green-500
//         text-white
//         flex
//         items-center
//         justify-center
//         hover:bg-green-600
//         transition
//       "
//       title="Accept call"
//     >
//       <PhoneCall size={24} />
//     </button>
//   </>
// ) : (
//   <button
//     onClick={onEndCall}
//     className="
//       w-14
//       h-14
//       rounded-full
//       bg-red-500
//       text-white
//       flex
//       items-center
//       justify-center
//       hover:bg-red-600
//       transition
//     "
//     title="End call"
//   >
//     <PhoneOff size={24} />
//   </button>
// )}

//         </div>
//       </div>
//     </div>
//   );
// }

// export default AudioCallCard;


"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  X,
  PhoneCall,
} from "lucide-react";

function AudioCallCard({
  username,
  image,
  isConnected = false,
  onEndCall,
  onMute,
  onHold,
}) {
  const [muted, setMuted] = useState(false);
  const [minimized, setMinimized] = useState(false);

  // Call duration
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // Start timer when WebRTC connection becomes connected
  useEffect(() => {
    if (!isConnected) {
      return;
    }

    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );

      setCallDuration(elapsed);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isConnected]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

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

  const handleMute = () => {
    setMuted((prev) => !prev);

    if (onMute) {
      onMute();
    }
  };

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

  const handlePhoneCallClick = () => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }

    setMinimized(false);
  };

  // Minimized call button
  if (minimized) {
    return (
      <button
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handlePhoneCallClick}
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
          touchAction: "none",
        }}
        className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-xl hover:bg-green-600 transition cursor-move select-none"
        title="Open call"
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

        {/* Status */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {isConnected ? "Audio call" : "Calling..."}
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

        {/* Connection status */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {isConnected ? "Connected" : "Waiting for answer"}
        </p>

        {/* CALL TIMER */}
        {isConnected && (
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 mt-3">
            {formatDuration(callDuration)}
          </p>
        )}

        {/* Buttons */}
        <div className="flex justify-center items-center gap-5 mt-10">

          {/* Mute */}
          <button
            onClick={handleMute}
            className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            title={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <MicOff size={20} />
            ) : (
              <Mic size={20} />
            )}
          </button>

          {/* Volume */}
          <button
            onClick={onHold}
            className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            title="Volume"
          >
            <Volume2 size={20} />
          </button>

          {/* End */}
          <button
            onClick={onEndCall}
            className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
            title="End call"
          >
            <PhoneOff size={24} />
          </button>

        </div>
      </div>
    </div>
  );
}

export default AudioCallCard;

