package com.spring.ankur.chatapp_ankur.dto;

import lombok.Data;

@Data
public class CallMessage {

    private String type;
    private String receiverUsername;
    private String senderUsername;
    private String roomId;
    private String offer;
    private String answer;
    private String candidate;
}