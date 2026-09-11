package com.spring.ankur.chatapp_ankur.dto;

import lombok.Data;

@Data
public class CallSignal {

    private String roomId;

    private String type;

    private String sender;

    private String receiver;

    private Object data;
}