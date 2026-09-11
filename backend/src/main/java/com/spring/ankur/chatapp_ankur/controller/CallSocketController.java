package com.spring.ankur.chatapp_ankur.controller;

import com.spring.ankur.chatapp_ankur.dto.CallSignal;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class CallSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/call.signal")
    public void handleCallSignal(
            CallSignal signal,
            Principal principal
    ) {

        System.out.println("========== CALL SIGNAL ==========");
        System.out.println("FROM USER: " + principal.getName());
        System.out.println("ROOM: " + signal.getRoomId());
        System.out.println("TYPE: " + signal.getType());

        messagingTemplate.convertAndSend(
                "/topic/call/" + signal.getRoomId(),
                signal
        );
    }
}
