// package com.spring.ankur.chatapp_ankur.controller;

// import com.spring.ankur.chatapp_ankur.dto.ChatMessageRequest;
// import com.spring.ankur.chatapp_ankur.dto.ChatMessageResponse;
// import com.spring.ankur.chatapp_ankur.service.ChatService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.messaging.handler.annotation.MessageMapping;
// import org.springframework.messaging.simp.SimpMessagingTemplate;
// import org.springframework.stereotype.Controller;

// @Controller
// @RequiredArgsConstructor
// public class ChatSocketController {

//     private final ChatService chatService;
//     private final SimpMessagingTemplate messagingTemplate;

//     @MessageMapping("/chat.send")
//     public void sendMessage(ChatMessageRequest request) {

//         // Save message in MongoDB
//         ChatMessageResponse response = chatService.sendMessage(request);

//         // Broadcast to everyone in this room
//         messagingTemplate.convertAndSend(
//                 "/topic/chat/" + response.getRoomId(),
//                 response
//         );
//     }
// }





package com.spring.ankur.chatapp_ankur.controller;

import com.spring.ankur.chatapp_ankur.dto.ChatMessageRequest;
import com.spring.ankur.chatapp_ankur.dto.ChatMessageResponse;
import com.spring.ankur.chatapp_ankur.service.ChatService;
import lombok.RequiredArgsConstructor;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatSocketController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    // @MessageMapping("/chat.send")
    // public void sendMessage(ChatMessageRequest request) {

    //     // Save message in MongoDB
    //     ChatMessageResponse response = chatService.sendMessage(request);

    //     // Broadcast to everyone in this room
    //     messagingTemplate.convertAndSend(
    //             "/topic/chat/" + response.getRoomId(),
    //             response
    //     );
    // }

   @MessageMapping("/chat.send")
public void sendMessage(
        ChatMessageRequest request,
        Principal principal
) {

    System.out.println("========== SOCKET MESSAGE RECEIVED ==========");
    System.out.println("WebSocket USER: " + principal.getName());
    System.out.println("Receiver: " + request.getReceiverUsername());
    System.out.println("Content: " + request.getContent());

    ChatMessageResponse response =
            chatService.sendMessage(
                    request,
                    principal.getName()
            );

    messagingTemplate.convertAndSend(
            "/topic/chat/" + response.getRoomId(),
            response
    );
}

}