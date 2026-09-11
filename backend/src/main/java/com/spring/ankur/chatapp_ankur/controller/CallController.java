// package com.spring.ankur.chatapp_ankur.controller;

// import com.spring.ankur.chatapp_ankur.dto.CallMessage;
// import lombok.RequiredArgsConstructor;

// import org.springframework.messaging.handler.annotation.MessageMapping;
// import org.springframework.messaging.simp.SimpMessagingTemplate;
// import org.springframework.stereotype.Controller;

// import java.security.Principal;

// @Controller
// @RequiredArgsConstructor
// public class CallController {

//     private final SimpMessagingTemplate messagingTemplate;

//     // =========================
//     // CALL OFFER
//     // =========================

//     @MessageMapping("/call.offer")
//     public void sendOffer(
//             CallMessage message,
//             Principal principal
//     ) {

//         message.setSenderUsername(principal.getName());

//         System.out.println("========== CALL OFFER ==========");
//         System.out.println("Caller: " + principal.getName());
//         System.out.println("Receiver: " + message.getReceiverUsername());

//         messagingTemplate.convertAndSendToUser(
//                 message.getReceiverUsername(),
//                 "/queue/call",
//                 message
//         );
//     }


//     // =========================
//     // CALL ANSWER
//     // =========================

//     @MessageMapping("/call.answer")
//     public void sendAnswer(
//             CallMessage message,
//             Principal principal
//     ) {

//         message.setSenderUsername(principal.getName());

//         System.out.println("========== CALL ANSWER ==========");
//         System.out.println("From: " + principal.getName());
//         System.out.println("To: " + message.getReceiverUsername());

//         messagingTemplate.convertAndSendToUser(
//                 message.getReceiverUsername(),
//                 "/queue/call",
//                 message
//         );
//     }


//     // =========================
//     // ICE CANDIDATE
//     // =========================

//     @MessageMapping("/call.ice")
//     public void sendIceCandidate(
//             CallMessage message,
//             Principal principal
//     ) {

//         message.setSenderUsername(principal.getName());

//         System.out.println("========== ICE CANDIDATE ==========");
//         System.out.println("From: " + principal.getName());
//         System.out.println("To: " + message.getReceiverUsername());

//         messagingTemplate.convertAndSendToUser(
//                 message.getReceiverUsername(),
//                 "/queue/call",
//                 message
//         );
//     }


//     // =========================
//     // REJECT CALL
//     // =========================

//     @MessageMapping("/call.reject")
//     public void rejectCall(
//             CallMessage message,
//             Principal principal
//     ) {

//         message.setSenderUsername(principal.getName());

//         System.out.println("========== CALL REJECT ==========");

//         messagingTemplate.convertAndSendToUser(
//                 message.getReceiverUsername(),
//                 "/queue/call",
//                 message
//         );
//     }


//     // =========================
//     // END CALL
//     // =========================

//     @MessageMapping("/call.end")
//     public void endCall(
//             CallMessage message,
//             Principal principal
//     ) {

//         message.setSenderUsername(principal.getName());

//         System.out.println("========== CALL END ==========");

//         messagingTemplate.convertAndSendToUser(
//                 message.getReceiverUsername(),
//                 "/queue/call",
//                 message
//         );
//     }
// }




// package com.spring.ankur.chatapp_ankur.controller;

// import lombok.RequiredArgsConstructor;

// import org.springframework.messaging.handler.annotation.MessageMapping;
// import org.springframework.messaging.simp.SimpMessagingTemplate;
// import org.springframework.stereotype.Controller;

// import com.spring.ankur.chatapp_ankur.dto.CallMessage;
// import com.spring.ankur.chatapp_ankur.entities.User;
// import com.spring.ankur.chatapp_ankur.repositories.UserRepository;

// import java.security.Principal;

// @Controller
// @RequiredArgsConstructor
// public class CallController {

//     private final SimpMessagingTemplate messagingTemplate;
//     private final UserRepository userRepository;


//     // =========================
//     // CALL OFFER
//     // =========================

//     @MessageMapping("/call.offer")
//     public void sendOffer(
//             CallMessage message,
//             Principal principal
//     ) {

//         System.out.println("========== CALL OFFER ==========");
//         System.out.println("Caller ID: " + principal.getName());
//         System.out.println("Receiver: " + message.getReceiverUsername());

//         message.setSenderUsername(principal.getName());

//         User receiver = userRepository
//                 .findByUsername(message.getReceiverUsername())
//                 .orElse(null);

//         if (receiver == null) {
//             System.out.println("❌ Receiver not found: "
//                     + message.getReceiverUsername());
//             return;
//         }

//         System.out.println("✅ Receiver ID: " + receiver.getId());

//         messagingTemplate.convertAndSendToUser(
//                 receiver.getId(),
//                 "/queue/call",
//                 message
//         );
//     }


//     // =========================
//     // CALL ANSWER
//     // =========================

//     @MessageMapping("/call.answer")
//     public void sendAnswer(
//             CallMessage message,
//             Principal principal
//     ) {

//         System.out.println("========== CALL ANSWER ==========");
//         System.out.println("User ID: " + principal.getName());
//         System.out.println("Receiver: " + message.getReceiverUsername());

//         message.setSenderUsername(principal.getName());

//         User receiver = userRepository
//                 .findByUsername(message.getReceiverUsername())
//                 .orElse(null);

//         if (receiver == null) {
//             System.out.println("❌ Receiver not found");
//             return;
//         }

//         messagingTemplate.convertAndSendToUser(
//                 receiver.getId(),
//                 "/queue/call",
//                 message
//         );
//     }


//     // =========================
//     // ICE CANDIDATE
//     // =========================

//     @MessageMapping("/call.ice")
//     public void sendIceCandidate(
//             CallMessage message,
//             Principal principal
//     ) {

//         System.out.println("========== ICE CANDIDATE ==========");
//         System.out.println("User ID: " + principal.getName());
//         System.out.println("Receiver: " + message.getReceiverUsername());

//         message.setSenderUsername(principal.getName());

//         User receiver = userRepository
//                 .findByUsername(message.getReceiverUsername())
//                 .orElse(null);

//         if (receiver == null) {
//             System.out.println("❌ Receiver not found");
//             return;
//         }

//         messagingTemplate.convertAndSendToUser(
//                 receiver.getId(),
//                 "/queue/call",
//                 message
//         );
//     }


//     // =========================
//     // REJECT CALL
//     // =========================

//     @MessageMapping("/call.reject")
//     public void rejectCall(
//             CallMessage message,
//             Principal principal
//     ) {

//         System.out.println("========== CALL REJECT ==========");
//         System.out.println("User ID: " + principal.getName());
//         System.out.println("Receiver: " + message.getReceiverUsername());

//         message.setSenderUsername(principal.getName());

//         User receiver = userRepository
//                 .findByUsername(message.getReceiverUsername())
//                 .orElse(null);

//         if (receiver == null) {
//             System.out.println("❌ Receiver not found");
//             return;
//         }

//         messagingTemplate.convertAndSendToUser(
//                 receiver.getId(),
//                 "/queue/call",
//                 message
//         );
//     }


//     // =========================
//     // END CALL
//     // =========================

//     @MessageMapping("/call.end")
//     public void endCall(
//             CallMessage message,
//             Principal principal
//     ) {

//         System.out.println("========== CALL END ==========");
//         System.out.println("User ID: " + principal.getName());
//         System.out.println("Receiver: " + message.getReceiverUsername());

//         message.setSenderUsername(principal.getName());

//         User receiver = userRepository
//                 .findByUsername(message.getReceiverUsername())
//                 .orElse(null);

//         if (receiver == null) {
//             System.out.println("❌ Receiver not found");
//             return;
//         }

//         messagingTemplate.convertAndSendToUser(
//                 receiver.getId(),
//                 "/queue/call",
//                 message
//         );
//     }
// }




package com.spring.ankur.chatapp_ankur.controller;

import lombok.RequiredArgsConstructor;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.spring.ankur.chatapp_ankur.dto.CallMessage;
import com.spring.ankur.chatapp_ankur.entities.User;
import com.spring.ankur.chatapp_ankur.repositories.UserRepository;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class CallController {

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;


    // =========================
    // CALL OFFER
    // =========================

    @MessageMapping("/call.offer")
    public void sendOffer(
            CallMessage message,
            Principal principal
    ) {

        System.out.println("========== CALL OFFER ==========");
        System.out.println("Caller ID: " + principal.getName());
        System.out.println("Receiver: " + message.getReceiverUsername());

        // Get caller using authenticated user ID
        User caller = userRepository
                .findById(principal.getName())
                .orElse(null);

        if (caller == null) {
            System.out.println("❌ Caller not found: " + principal.getName());
            return;
        }

        // Send actual username instead of user ID
        message.setSenderUsername(caller.getUsername());
       

        User receiver = userRepository
                .findByUsername(message.getReceiverUsername())
                .orElse(null);

        if (receiver == null) {
            System.out.println("❌ Receiver not found: "
                    + message.getReceiverUsername());
            return;
        }

        System.out.println("✅ Receiver ID: " + receiver.getId());

        messagingTemplate.convertAndSendToUser(
                receiver.getId(),
                "/queue/call",
                message
        );
    }


    // =========================
    // CALL ANSWER
    // =========================

    @MessageMapping("/call.answer")
    public void sendAnswer(
            CallMessage message,
            Principal principal
    ) {

        System.out.println("========== CALL ANSWER ==========");
        System.out.println("User ID: " + principal.getName());
        System.out.println("Receiver: " + message.getReceiverUsername());

        // Get answering user using authenticated user ID
        User caller = userRepository
                .findById(principal.getName())
                .orElse(null);

        if (caller == null) {
            System.out.println("❌ User not found: " + principal.getName());
            return;
        }

        message.setSenderUsername(caller.getUsername());

        User receiver = userRepository
                .findByUsername(message.getReceiverUsername())
                .orElse(null);

        if (receiver == null) {
            System.out.println("❌ Receiver not found: "
                    + message.getReceiverUsername());
            return;
        }

        System.out.println("✅ Receiver ID: " + receiver.getId());

        messagingTemplate.convertAndSendToUser(
                receiver.getId(),
                "/queue/call",
                message
        );
    }


    // =========================
    // ICE CANDIDATE
    // =========================

    @MessageMapping("/call.ice")
    public void sendIceCandidate(
            CallMessage message,
            Principal principal
    ) {

        System.out.println("========== ICE CANDIDATE ==========");
        System.out.println("User ID: " + principal.getName());
        System.out.println("Receiver: " + message.getReceiverUsername());

        User caller = userRepository
                .findById(principal.getName())
                .orElse(null);

        if (caller == null) {
            System.out.println("❌ User not found: " + principal.getName());
            return;
        }

        message.setSenderUsername(caller.getUsername());

        User receiver = userRepository
                .findByUsername(message.getReceiverUsername())
                .orElse(null);

        if (receiver == null) {
            System.out.println("❌ Receiver not found: "
                    + message.getReceiverUsername());
            return;
        }

        System.out.println("✅ Receiver ID: " + receiver.getId());

        messagingTemplate.convertAndSendToUser(
                receiver.getId(),
                "/queue/call",
                message
        );
    }


    // =========================
    // REJECT CALL
    // =========================

    @MessageMapping("/call.reject")
    public void rejectCall(
            CallMessage message,
            Principal principal
    ) {

        System.out.println("========== CALL REJECT ==========");
        System.out.println("User ID: " + principal.getName());
        System.out.println("Receiver: " + message.getReceiverUsername());

        User caller = userRepository
                .findById(principal.getName())
                .orElse(null);

        if (caller == null) {
            System.out.println("❌ User not found: " + principal.getName());
            return;
        }

        message.setSenderUsername(caller.getUsername());

        User receiver = userRepository
                .findByUsername(message.getReceiverUsername())
                .orElse(null);

        if (receiver == null) {
            System.out.println("❌ Receiver not found: "
                    + message.getReceiverUsername());
            return;
        }

        System.out.println("✅ Receiver ID: " + receiver.getId());

        messagingTemplate.convertAndSendToUser(
                receiver.getId(),
                "/queue/call",
                message
        );
    }


    // =========================
    // END CALL
    // =========================

    @MessageMapping("/call.end")
    public void endCall(
            CallMessage message,
            Principal principal
    ) {

        System.out.println("========== CALL END ==========");
        System.out.println("User ID: " + principal.getName());
        System.out.println("Receiver: " + message.getReceiverUsername());

        User caller = userRepository
                .findById(principal.getName())
                .orElse(null);

        if (caller == null) {
            System.out.println("❌ User not found: " + principal.getName());
            return;
        }

        message.setSenderUsername(caller.getUsername());

        User receiver = userRepository
                .findByUsername(message.getReceiverUsername())
                .orElse(null);

        if (receiver == null) {
            System.out.println("❌ Receiver not found: "
                    + message.getReceiverUsername());
            return;
        }

        System.out.println("✅ Receiver ID: " + receiver.getId());

        messagingTemplate.convertAndSendToUser(
                receiver.getId(),
                "/queue/call",
                message
        );
    }
}

