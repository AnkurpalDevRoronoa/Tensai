// package com.spring.ankur.chatapp_ankur.config;

// import org.springframework.context.annotation.Configuration;
// import org.springframework.messaging.simp.config.MessageBrokerRegistry;
// import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
// import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
// import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

// @Configuration
// @EnableWebSocketMessageBroker
// public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

//     @Override
//     public void registerStompEndpoints(StompEndpointRegistry registry) {

//        registry.addEndpoint("/chat")
//         .setAllowedOriginPatterns(
//                 "http://localhost:3000",
//                 "http://10.219.226.120:3000"
//         )
//         .withSockJS();
//     }

//     @Override
//     public void configureMessageBroker(MessageBrokerRegistry registry) {

//         // Client sends messages here
//         registry.setApplicationDestinationPrefixes("/app");

//         // Server broadcasts messages here
//         registry.enableSimpleBroker("/topic");
//     }
// }

// package com.spring.ankur.chatapp_ankur.config;

// import org.springframework.context.annotation.Configuration;
// import org.springframework.messaging.simp.config.MessageBrokerRegistry;
// import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
// import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
// import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

// @Configuration
// @EnableWebSocketMessageBroker
// public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
//     private final WebSocketAuthInterceptor webSocketAuthInterceptor;
//     @Override
//     public void registerStompEndpoints(StompEndpointRegistry registry) {

//         // registry.addEndpoint("/chat")
//         //         .setAllowedOriginPatterns("http://localhost:3000")
//         //         .withSockJS();

//         registry.addEndpoint("/chat")
//         .setAllowedOriginPatterns("*")
//         .withSockJS();
//     }

//     @Override
//     public void configureMessageBroker(MessageBrokerRegistry registry) {

//         // Client sends messages here
//         registry.setApplicationDestinationPrefixes("/app");

//         // Server broadcasts messages here
//         registry.enableSimpleBroker("/topic");
//     }
// }









// package com.spring.ankur.chatapp_ankur.config;
// import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
// import lombok.RequiredArgsConstructor;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.messaging.simp.config.ChannelRegistration;
// import org.springframework.messaging.simp.config.MessageBrokerRegistry;
// import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
// import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
// import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;


// @Configuration
// @EnableWebSocketMessageBroker
// @RequiredArgsConstructor
// public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {


//     private final WebSocketAuthInterceptor webSocketAuthInterceptor;


//     @Override
//     public void registerStompEndpoints(
//             StompEndpointRegistry registry
//     ) {

//         registry.addEndpoint("/chat")
//                 .setAllowedOriginPatterns("*")
//                 .withSockJS();

//     }


//     @Override
//     public void configureMessageBroker(
//             MessageBrokerRegistry registry
//     ) {

//         // Client sends message here
//         registry.setApplicationDestinationPrefixes("/app");


//         // Server broadcasts message here
//         registry.enableSimpleBroker("/topic");
        

//         registry.setUserDestinationPrefix("/user");
//     }


//     @Override
//     public void configureClientInboundChannel(
//             ChannelRegistration registration
//     ) {

//         registration.interceptors(
//                 webSocketAuthInterceptor
//         );

//     }

//     @Override
// public void configureWebSocketTransport(
//         WebSocketTransportRegistration registry
// ) {
//     registry.setMessageSizeLimit(1024 * 1024);
// }

// }



package com.spring.ankur.chatapp_ankur.config;

import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    @Override
    public void registerStompEndpoints(
            StompEndpointRegistry registry
    ) {

        registry.addEndpoint("/chat")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(
            MessageBrokerRegistry registry
    ) {

        // Client sends messages to the server through /app
        registry.setApplicationDestinationPrefixes("/app");

        // Server broadcasts:
        // /topic -> normal chat/topic messages
        // /queue -> user-specific messages
        registry.enableSimpleBroker("/topic", "/queue");

        // User-specific destinations use /user
        registry.setUserDestinationPrefix("/user");
    }

    @Override
    public void configureClientInboundChannel(
            ChannelRegistration registration
    ) {

        registration.interceptors(
                webSocketAuthInterceptor
        );
    }

    @Override
    public void configureWebSocketTransport(
            WebSocketTransportRegistration registry
    ) {

        registry.setMessageSizeLimit(1024 * 1024);
    }
}