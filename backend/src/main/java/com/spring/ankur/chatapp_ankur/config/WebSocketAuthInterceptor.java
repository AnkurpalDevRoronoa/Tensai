// package com.spring.ankur.chatapp_ankur.config;

// import com.spring.ankur.chatapp_ankur.service.JwtService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.messaging.Message;
// import org.springframework.messaging.MessageChannel;
// import org.springframework.messaging.simp.stomp.StompCommand;
// import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
// import org.springframework.messaging.support.ChannelInterceptor;
// import org.springframework.stereotype.Component;

// import java.security.Principal;


// @Component
// @RequiredArgsConstructor
// public class WebSocketAuthInterceptor implements ChannelInterceptor {


//     private final JwtService jwtService;


//     @Override
//     public Message<?> preSend(
//             Message<?> message,
//             MessageChannel channel
//     ) {


//         StompHeaderAccessor accessor =
//                 StompHeaderAccessor.wrap(message);


//         if (StompCommand.CONNECT.equals(accessor.getCommand())) {


//             String authHeader =
//                     accessor.getFirstNativeHeader(
//                             "Authorization"
//                     );


//             System.out.println(
//                     "WS AUTH HEADER = " + authHeader
//             );


//             if (authHeader != null &&
//                     authHeader.startsWith("Bearer ")) {


//                 String token =
//                         authHeader.substring(7);


//                 try {

//                     String userId =
//                             jwtService.extractUserId(token);


//                     System.out.println(
//                             "WS USER = " + userId
//                     );


//                     accessor.setUser(
//                             new Principal() {

//                                 @Override
//                                 public String getName() {
//                                     return userId;
//                                 }

//                             }
//                     );


//                 } catch(Exception e) {

//                     System.out.println(
//                             "WS JWT ERROR = "
//                             + e.getMessage()
//                     );

//                 }

//             }

//         }


//         return message;
//     }
// }


// package com.spring.ankur.chatapp_ankur.config;

// import com.spring.ankur.chatapp_ankur.service.JwtService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.messaging.Message;
// import org.springframework.messaging.MessageChannel;
// import org.springframework.messaging.simp.stomp.StompCommand;
// import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
// import org.springframework.messaging.support.ChannelInterceptor;
// import org.springframework.stereotype.Component;

// import java.security.Principal;

// @Component
// @RequiredArgsConstructor
// public class WebSocketAuthInterceptor implements ChannelInterceptor {


//     private final JwtService jwtService;


//     @Override
//     public Message<?> preSend(
//             Message<?> message,
//             MessageChannel channel
//     ) {


//         StompHeaderAccessor accessor =
//                 StompHeaderAccessor.wrap(message);


//         if (StompCommand.CONNECT.equals(accessor.getCommand())) {


//             String authHeader =
//                     accessor.getFirstNativeHeader("Authorization");


//             System.out.println(
//                     "WS AUTH HEADER = " + authHeader
//             );


//             if (authHeader != null &&
//                     authHeader.startsWith("Bearer ")) {


//                 String token =
//                         authHeader.substring(7);


//                 try {


//                     String userId =
//                             jwtService.extractUserId(token);


//                     System.out.println(
//                             "WS USER = " + userId
//                     );


//                     Principal principal =
//                             () -> userId;


//                     accessor.setUser(principal);


//                 } catch(Exception e) {


//                     System.out.println(
//                             "WS JWT ERROR = "
//                             + e.getMessage()
//                     );

//                 }

//             }

//         }


//         if (accessor.getUser() != null) {

//             System.out.println(
//                 "WS PRINCIPAL = "
//                 + accessor.getUser().getName()
//             );

//         } else {

//             System.out.println(
//                 "WS PRINCIPAL = NULL"
//             );

//         }


//         return message;
//     }
// }








// package com.spring.ankur.chatapp_ankur.config;

// import com.spring.ankur.chatapp_ankur.service.JwtService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.messaging.Message;
// import org.springframework.messaging.MessageChannel;
// import org.springframework.messaging.simp.stomp.StompCommand;
// import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
// import org.springframework.messaging.support.ChannelInterceptor;
// import org.springframework.stereotype.Component;

// import java.security.Principal;

// @Component
// @RequiredArgsConstructor
// public class WebSocketAuthInterceptor implements ChannelInterceptor {

//     private final JwtService jwtService;

//     // @Override
//     // public Message<?> preSend(
//     //         Message<?> message,
//     //         MessageChannel channel
//     // ) {

//     //     StompHeaderAccessor accessor =
//     //             StompHeaderAccessor.wrap(message);

//     //     if (StompCommand.CONNECT.equals(accessor.getCommand())) {

//     //         String authHeader =
//     //                 accessor.getFirstNativeHeader("Authorization");

//     //         System.out.println("WS AUTH HEADER = " + authHeader);

//     //         if (authHeader != null &&
//     //                 authHeader.startsWith("Bearer ")) {

//     //             String token = authHeader.substring(7);

//     //             try {

//     //                 String userId =
//     //                         jwtService.extractUserId(token);

//     //                 System.out.println("WS USER = " + userId);

//     //                 Principal principal = () -> userId;

//     //                 accessor.setUser(principal);

//     //                 // ===== ADD THESE =====
//     //                 System.out.println("COMMAND = " + accessor.getCommand());
//     //                 System.out.println("SESSION ID = " + accessor.getSessionId());
//     //                 System.out.println("USER AFTER SET = " + accessor.getUser());
//     //                 // =====================

//     //             } catch (Exception e) {

//     //                 System.out.println(
//     //                         "WS JWT ERROR = "
//     //                                 + e.getMessage()
//     //                 );

//     //             }

//     //         }

//     //     }

//     //     // ===== ADD THESE =====
//     //     System.out.println("-------------------------");
//     //     System.out.println("FRAME = " + accessor.getCommand());
//     //     System.out.println("SESSION = " + accessor.getSessionId());

//     //     if (accessor.getUser() != null) {
//     //         System.out.println("USER = " + accessor.getUser().getName());
//     //     } else {
//     //         System.out.println("USER = NULL");
//     //     }

//     //     System.out.println("-------------------------");
//     //     // =====================

//     //     return message;
//     // }
//     @Override
// public Message<?> preSend(Message<?> message, MessageChannel channel) {

//     StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);

//     System.out.println("==============================");
//     System.out.println("FRAME = " + accessor.getCommand());
//     System.out.println("SESSION = " + accessor.getSessionId());

//     if (accessor.getUser() != null) {
//         System.out.println("BEFORE USER = " + accessor.getUser().getName());
//     } else {
//         System.out.println("BEFORE USER = NULL");
//     }

//     if (StompCommand.CONNECT.equals(accessor.getCommand())) {

//         String authHeader = accessor.getFirstNativeHeader("Authorization");

//         if (authHeader != null && authHeader.startsWith("Bearer ")) {

//             String userId = jwtService.extractUserId(authHeader.substring(7));

//             accessor.setUser(() -> userId);

//             System.out.println("SET USER = " + userId);
//         }
//     }

//     if (accessor.getUser() != null) {
//         System.out.println("AFTER USER = " + accessor.getUser().getName());
//     } else {
//         System.out.println("AFTER USER = NULL");
//     }

//     System.out.println("==============================");

//     return message;
// }
// }


// package com.spring.ankur.chatapp_ankur.config;

// import com.spring.ankur.chatapp_ankur.service.JwtService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.messaging.Message;
// import org.springframework.messaging.MessageChannel;
// import org.springframework.messaging.simp.stomp.StompCommand;
// import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
// import org.springframework.messaging.support.ChannelInterceptor;
// import org.springframework.stereotype.Component;

// import java.security.Principal;

// @Component
// @RequiredArgsConstructor
// public class WebSocketAuthInterceptor implements ChannelInterceptor {

//     private final JwtService jwtService;

//     @Override
//     public Message<?> preSend(
//             Message<?> message,
//             MessageChannel channel
//     ) {

//         StompHeaderAccessor accessor =
//                 StompHeaderAccessor.wrap(message);

//         System.out.println("==============================");
//         System.out.println("FRAME = " + accessor.getCommand());
//         System.out.println("SESSION = " + accessor.getSessionId());

//         System.out.println(
//                 "SESSION ATTRIBUTES (BEFORE) = "
//                         + accessor.getSessionAttributes()
//         );

//         if (accessor.getUser() != null) {
//             System.out.println(
//                     "BEFORE USER = "
//                             + accessor.getUser().getName()
//             );
//         } else {
//             System.out.println("BEFORE USER = NULL");
//         }

//         // if (StompCommand.CONNECT.equals(accessor.getCommand())) {

//         //     String authHeader =
//         //             accessor.getFirstNativeHeader("Authorization");

//         //     if (authHeader != null &&
//         //             authHeader.startsWith("Bearer ")) {

//         //         try {

//         //             String userId =
//         //                     jwtService.extractUserId(
//         //                             authHeader.substring(7)
//         //                     );

//         //             Principal principal = () -> userId;

//         //             accessor.setUser(principal);

//         //             accessor.getSessionAttributes()
//         //                     .put("user", principal);

//         //             System.out.println(
//         //                     "SET USER = " + userId
//         //             );

//         //         } catch (Exception e) {

//         //             System.out.println(
//         //                     "JWT ERROR = "
//         //                             + e.getMessage()
//         //             );
//         //         }
//         //     }
//         // }


//         if (StompCommand.CONNECT.equals(accessor.getCommand())) {

//     String authHeader =
//             accessor.getFirstNativeHeader("Authorization");

//     if (authHeader != null &&
//             authHeader.startsWith("Bearer ")) {

//         try {

//             String userId =
//                     jwtService.extractUserId(
//                             authHeader.substring(7)
//                     );

//             Principal principal = () -> userId;

//             accessor.setUser(principal);

//             accessor.getSessionAttributes()
//                     .put("user", principal);

//             System.out.println("SET USER = " + userId);

//         } catch (Exception e) {

//             System.out.println("JWT ERROR = " + e.getMessage());

//         }
//     }

// } else {

//     Principal principal =
//             (Principal) accessor.getSessionAttributes().get("user");

//     if (principal != null) {

//         accessor.setUser(principal);

//         System.out.println("RESTORED USER = " + principal.getName());

//     }

// }
//         System.out.println(
//                 "SESSION ATTRIBUTES (AFTER) = "
//                         + accessor.getSessionAttributes()
//         );

//         // if (accessor.getUser() != null) {
//         //     System.out.println(
//         //             "AFTER USER = "
//         //                     + accessor.getUser().getName()
//         //     );
//         // } else {
//         //     System.out.println("AFTER USER = NULL");
//         // }

//         // System.out.println("==============================");

//         // return message;



//         if (accessor.getUser() != null) {

//     System.out.println(
//         "AFTER USER = "
//         + accessor.getUser().getName()
//     );

// } else {

//     Principal principal =
//             (Principal) accessor.getSessionAttributes()
//                     .get("user");

//     if (principal != null) {

//         accessor.setUser(principal);

//         System.out.println(
//             "RESTORED USER = "
//             + principal.getName()
//         );

//     } else {

//         System.out.println("AFTER USER = NULL");

//     }
// }

// return message;
//     }
// }












// package com.spring.ankur.chatapp_ankur.config;
// import org.springframework.messaging.support.MessageHeaderAccessor;
// import com.spring.ankur.chatapp_ankur.service.JwtService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.messaging.Message;
// import org.springframework.messaging.MessageChannel;
// import org.springframework.messaging.simp.stomp.StompCommand;
// import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
// import org.springframework.messaging.support.ChannelInterceptor;
// import org.springframework.stereotype.Component;
// import org.springframework.messaging.support.MessageBuilder;
// import java.security.Principal;

// @Component
// @RequiredArgsConstructor
// public class WebSocketAuthInterceptor implements ChannelInterceptor {

//     private final JwtService jwtService;

// // @Override
// // public Message<?> preSend(
// //         Message<?> message,
// //         MessageChannel channel
// // ) {

// //     StompHeaderAccessor accessor =
// //             StompHeaderAccessor.wrap(message);


// //     if (StompCommand.CONNECT.equals(accessor.getCommand())) {

// //         String authHeader =
// //                 accessor.getFirstNativeHeader("Authorization");


// //         if (authHeader != null &&
// //             authHeader.startsWith("Bearer ")) {


// //             String userId =
// //                     jwtService.extractUserId(
// //                             authHeader.substring(7)
// //                     );


// //             Principal principal = () -> userId;


// //             accessor.setUser(principal);


// //             accessor.getSessionAttributes()
// //                     .put("user", principal);


// //             System.out.println(
// //                     "CONNECT USER = " + userId
// //             );
// //         }

// //     } 
// //     else {


// //         Principal principal =
// //                 (Principal) accessor
// //                 .getSessionAttributes()
// //                 .get("user");


// //         if (principal != null) {

// //             accessor.setUser(principal);

// //             System.out.println(
// //                 "RESTORED USER = "
// //                 + principal.getName()
// //             );

// //         }

// //     }


// //     // return message;

// //     return MessageBuilder
// //         .withPayload(message.getPayload())
// //         .copyHeaders(accessor.getMessageHeaders())
// //         .build();
// // }
// //     }

// @Override
// public Message<?> preSend(
//         Message<?> message,
//         MessageChannel channel
// ) {

//     StompHeaderAccessor accessor =
//             MessageHeaderAccessor.getAccessor(
//                     message,
//                     StompHeaderAccessor.class
//             );

//     if (accessor == null) {
//         return message;
//     }


//     if (StompCommand.CONNECT.equals(accessor.getCommand())) {

//         String authHeader =
//                 accessor.getFirstNativeHeader("Authorization");


//         if (authHeader != null &&
//             authHeader.startsWith("Bearer ")) {


//             String userId =
//                     jwtService.extractUserId(
//                             authHeader.substring(7)
//                     );


//             Principal principal = () -> userId;


//             accessor.setUser(principal);


//             accessor.getSessionAttributes()
//                     .put("user", principal);


//             System.out.println(
//                     "CONNECT USER = " + userId
//             );
//         }

//     } else {


//         Principal principal =
//                 (Principal) accessor
//                 .getSessionAttributes()
//                 .get("user");


//         if (principal != null) {

//             accessor.setUser(principal);

//             System.out.println(
//                     "RESTORED USER = "
//                     + principal.getName()
//             );

//         }

//     }


//     accessor.setLeaveMutable(true);

//     return MessageBuilder
//             .withPayload(message.getPayload())
//             .copyHeaders(accessor.getMessageHeaders())
//             .build();
// }
// }







package com.spring.ankur.chatapp_ankur.config;

import com.spring.ankur.chatapp_ankur.service.JwtService;
import lombok.RequiredArgsConstructor;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.security.Principal;


@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {


    private final JwtService jwtService;



//     @Override
//     public Message<?> preSend(
//             Message<?> message,
//             MessageChannel channel
//     ) {


//         StompHeaderAccessor accessor =
//                 MessageHeaderAccessor.getAccessor(
//                         message,
//                         StompHeaderAccessor.class
//                 );


//         if (accessor == null) {
//             return message;
//         }



//         /*
//          * First connection
//          */
//         if (StompCommand.CONNECT.equals(accessor.getCommand())) {


//             String authHeader =
//                     accessor.getFirstNativeHeader("Authorization");



//             if (authHeader != null &&
//                     authHeader.startsWith("Bearer ")) {



//                 String token =
//                         authHeader.substring(7);



//                 String userId =
//                         jwtService.extractUserId(token);



//                 Principal principal =
//                         () -> userId;



//                 accessor.setUser(principal);



//                 accessor.getSessionAttributes()
//                         .put("user", principal);



//                 System.out.println(
//                         "CONNECT USER = " + userId
//                 );


//             } else {

//                 System.out.println(
//                         "NO JWT FOUND IN WEBSOCKET CONNECT"
//                 );

//             }



//         }

//         /*
//          * Every message after CONNECT
//          */
//         else {



//             Principal principal =
//                     (Principal) accessor
//                             .getSessionAttributes()
//                             .get("user");



//             if (principal != null) {


//                 accessor.setUser(principal);



//                 System.out.println(
//                         "RESTORED USER = "
//                                 + principal.getName()
//                 );


//             } else {


//                 System.out.println(
//                         "NO USER IN WEBSOCKET SESSION"
//                 );

//             }

//         }



//         accessor.setLeaveMutable(true);



//         return MessageBuilder
//                 .withPayload(message.getPayload())
//                 .copyHeaders(accessor.getMessageHeaders())
//                 .build();

//     }

@Override
public Message<?> preSend(
        Message<?> message,
        MessageChannel channel
) {

    StompHeaderAccessor accessor =
            MessageHeaderAccessor.getAccessor(
                    message,
                    StompHeaderAccessor.class
            );

    if (accessor == null) {
        return message;
    }

    StompCommand command = accessor.getCommand();

    if (command == null) {
        return message;
    }

    /*
     * First connection
     */
    if (StompCommand.CONNECT.equals(command)) {

        String authHeader =
                accessor.getFirstNativeHeader("Authorization");

        if (authHeader != null &&
                authHeader.startsWith("Bearer ")) {

            String token = authHeader.substring(7);

            String userId = jwtService.extractUserId(token);

            Principal principal = () -> userId;

            accessor.setUser(principal);

            accessor.getSessionAttributes()
                    .put("user", principal);

            System.out.println(
                    "CONNECT USER = " + userId
            );

        } else {

            System.out.println(
                    "NO JWT FOUND IN WEBSOCKET CONNECT"
            );
        }

        return message;
    }

    /*
     * DISCONNECT
     *
     * Don't try to modify/rebuild an immutable
     * disconnect message.
     */
    if (StompCommand.DISCONNECT.equals(command)) {

        System.out.println(
                "DISCONNECT USER = " +
                (accessor.getUser() != null
                        ? accessor.getUser().getName()
                        : "unknown")
        );

        return message;
    }

    /*
     * Every message after CONNECT
     */
    Principal principal =
            (Principal) accessor
                    .getSessionAttributes()
                    .get("user");

    if (principal != null) {

        accessor.setUser(principal);

        System.out.println(
                "RESTORED USER = " +
                        principal.getName()
        );

    } else {

        System.out.println(
                "NO USER IN WEBSOCKET SESSION"
        );
    }

    return message;
}
}