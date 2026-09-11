

// package com.spring.ankur.chatapp_ankur.service;

// import java.time.Instant;
// import java.util.ArrayList;
// import java.util.Comparator;
// import java.util.List;

// import org.springframework.data.domain.PageRequest;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.stereotype.Service;
// import org.springframework.transaction.annotation.Transactional;

// import com.spring.ankur.chatapp_ankur.entities.Profile;
// import com.spring.ankur.chatapp_ankur.repositories.ProfileRepository;
// import com.spring.ankur.chatapp_ankur.dto.ChatMessageRequest;
// import com.spring.ankur.chatapp_ankur.dto.ChatMessageResponse;
// import com.spring.ankur.chatapp_ankur.dto.ChatRoomResponse;
// import com.spring.ankur.chatapp_ankur.dto.ConversationResponse;
// import com.spring.ankur.chatapp_ankur.entities.ChatMessage;
// import com.spring.ankur.chatapp_ankur.entities.ChatRoom;
// import com.spring.ankur.chatapp_ankur.entities.ConnectionStatus;
// import com.spring.ankur.chatapp_ankur.entities.User;
// import com.spring.ankur.chatapp_ankur.repositories.ChatMessageRepository;
// import com.spring.ankur.chatapp_ankur.repositories.ChatRoomRepository;
// import com.spring.ankur.chatapp_ankur.repositories.ConnectionRepository;
// import com.spring.ankur.chatapp_ankur.repositories.UserRepository;

// import lombok.RequiredArgsConstructor;

// @Service
// @RequiredArgsConstructor
// public class ChatService {

// private final ChatRoomRepository chatRoomRepository;
// private final ChatMessageRepository chatMessageRepository;
// private final UserRepository userRepository;
// private final ConnectionRepository connectionRepository;
// private final ProfileRepository profileRepository;

//     @Transactional
//     public ChatMessageResponse sendMessage(ChatMessageRequest request) {

//         String senderId = SecurityContextHolder
//                 .getContext()
//                 .getAuthentication()
//                 .getName();

//         User sender = userRepository.findById(senderId)
//                 .orElseThrow(() -> new RuntimeException("Sender not found"));

//         User receiver = userRepository.findByUsername(request.getReceiverUsername())
//                 .orElseThrow(() -> new RuntimeException("Receiver not found"));

//         if (sender.getId().equals(receiver.getId())) {
//             throw new RuntimeException("You cannot message yourself.");
//         }

//         if (!isConnected(sender, receiver)) {
//             throw new RuntimeException("Users are not connected.");
//         }

//         if (request.getContent() == null) {
//             throw new RuntimeException("Message cannot be null.");
//         }

//         String content = request.getContent().trim();

//         if (content.isEmpty()) {
//             throw new RuntimeException("Message cannot be empty.");
//         }

//         if (content.length() > 1000) {
//             throw new RuntimeException("Message cannot exceed 1000 characters.");
//         }

//         ChatRoom room = getOrCreateRoom(sender, receiver);

//         ChatMessage message = ChatMessage.builder()
//                 .roomId(room.getId())
//                 .senderUsername(sender.getUsername())
//                 .receiverUsername(receiver.getUsername())
//                 .content(content)
//                 .createdAt(Instant.now())
//                 .read(false)
//                 .build();

//         ChatMessage saved = chatMessageRepository.save(message);

//         return mapToResponse(saved);
//     }

//     private boolean isConnected(User sender, User receiver) {

//         return connectionRepository
//                 .findBySenderIdAndReceiverIdAndStatus(
//                         sender.getId(),
//                         receiver.getId(),
//                         ConnectionStatus.CONNECTED
//                 )
//                 .isPresent()

//                 ||

//                 connectionRepository
//                         .findByReceiverIdAndSenderIdAndStatus(
//                                 sender.getId(),
//                                 receiver.getId(),
//                                 ConnectionStatus.CONNECTED
//                         )
//                         .isPresent();
//     }

//     private ChatRoom getOrCreateRoom(User user1, User user2) {

//         String first = user1.getUsername().compareToIgnoreCase(user2.getUsername()) < 0
//                 ? user1.getUsername()
//                 : user2.getUsername();

//         String second = user1.getUsername().compareToIgnoreCase(user2.getUsername()) < 0
//                 ? user2.getUsername()
//                 : user1.getUsername();

//         return chatRoomRepository
//                 .findByUser1AndUser2(first, second)
//                 .orElseGet(() -> {

//                     ChatRoom room = ChatRoom.builder()
//                             .user1(first)
//                             .user2(second)
//                             .createdAt(Instant.now())
//                             .build();

//                     return chatRoomRepository.save(room);
//                 });
//     }

//     private ChatMessageResponse mapToResponse(ChatMessage message) {

//         return ChatMessageResponse.builder()
//                 .id(message.getId())
//                 .roomId(message.getRoomId())
//                 .senderUsername(message.getSenderUsername())
//                 .receiverUsername(message.getReceiverUsername())
//                 .content(message.getContent())
//                 .createdAt(message.getCreatedAt())
//                 .read(message.isRead())
//                 .build();
//     }

//     public List<ConversationResponse> getConversations() {

//     String currentUserId = SecurityContextHolder
//             .getContext()
//             .getAuthentication()
//             .getName();

//     User currentUser = userRepository.findById(currentUserId)
//             .orElseThrow(() -> new RuntimeException("User not found"));

//     List<ChatRoom> rooms = chatRoomRepository.findByUser1OrUser2(
//             currentUser.getUsername(),
//             currentUser.getUsername()
//     );

//     List<ConversationResponse> conversations = new ArrayList<>();

//     for (ChatRoom room : rooms) {

//         String otherUsername = room.getUser1().equals(currentUser.getUsername())
//                 ? room.getUser2()
//                 : room.getUser1();

//         User otherUser = userRepository.findByUsername(otherUsername)
//                 .orElseThrow(() -> new RuntimeException("User not found"));
// Profile profile = profileRepository
//         .findByUserId(otherUser.getId())
//         .orElse(null);

// String profileImage = "";

// if (profile != null) {
//     profileImage = profile.getProfileImage();
// }
//         List<ChatMessage> latestMessages =
//                 chatMessageRepository.findByRoomIdOrderByCreatedAtDesc(
//                         room.getId(),
//                         PageRequest.of(0, 1)
//                 );

//         String lastMessage = "";
//         Instant lastMessageTime = room.getCreatedAt();

//         if (!latestMessages.isEmpty()) {
//             ChatMessage latest = latestMessages.get(0);
//             lastMessage = latest.getContent();
//             lastMessageTime = latest.getCreatedAt();
//         }



//                 conversations.add(
//                 ConversationResponse.builder()
//                         .roomId(room.getId())
//                         .username(otherUser.getUsername())
//                         .profileImage(profileImage)
//                         .lastMessage(lastMessage)
//                         .lastMessageTime(lastMessageTime)
//                         .build()
                        
//         );
//     }

//     conversations.sort(
//             Comparator.comparing(ConversationResponse::getLastMessageTime)
//                     .reversed()
//     );

//     return conversations;
// }

// public List<ChatMessageResponse> getChatHistory(String roomId) {

//     String currentUserId = SecurityContextHolder
//             .getContext()
//             .getAuthentication()
//             .getName();

//     User currentUser = userRepository.findById(currentUserId)
//             .orElseThrow(() -> new RuntimeException("User not found"));

//     ChatRoom room = chatRoomRepository.findById(roomId)
//             .orElseThrow(() -> new RuntimeException("Chat room not found"));

//     if (!room.getUser1().equals(currentUser.getUsername())
//             && !room.getUser2().equals(currentUser.getUsername())) {
//         throw new RuntimeException("Access denied.");
//     }

//     return chatMessageRepository
//             .findByRoomIdOrderByCreatedAtAsc(roomId)
//             .stream()
//             .map(this::mapToResponse)
//             .toList();
// }

// public ChatRoomResponse getRoomWithUser(String username) {

//     String currentUserId = SecurityContextHolder
//             .getContext()
//             .getAuthentication()
//             .getName();

//     User currentUser = userRepository.findById(currentUserId)
//             .orElseThrow(() -> new RuntimeException("User not found"));

//     User otherUser = userRepository.findByUsername(username)
//             .orElseThrow(() -> new RuntimeException("User not found"));

//     if (!isConnected(currentUser, otherUser)) {
//         throw new RuntimeException("Users are not connected.");
//     }

//     ChatRoom room = getOrCreateRoom(currentUser, otherUser);

//     return ChatRoomResponse.builder()
//             .roomId(room.getId())
//             .user1(room.getUser1())
//             .user2(room.getUser2())
//             .build();
// }
// }



package com.spring.ankur.chatapp_ankur.service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spring.ankur.chatapp_ankur.entities.Profile;
import com.spring.ankur.chatapp_ankur.repositories.ProfileRepository;
import com.spring.ankur.chatapp_ankur.dto.ChatMessageRequest;
import com.spring.ankur.chatapp_ankur.dto.ChatMessageResponse;
import com.spring.ankur.chatapp_ankur.dto.ChatRoomResponse;
import com.spring.ankur.chatapp_ankur.dto.ConversationResponse;
import com.spring.ankur.chatapp_ankur.entities.ChatMessage;
import com.spring.ankur.chatapp_ankur.entities.ChatRoom;
import com.spring.ankur.chatapp_ankur.entities.ConnectionStatus;
import com.spring.ankur.chatapp_ankur.entities.User;
import com.spring.ankur.chatapp_ankur.repositories.ChatMessageRepository;
import com.spring.ankur.chatapp_ankur.repositories.ChatRoomRepository;
import com.spring.ankur.chatapp_ankur.repositories.ConnectionRepository;
import com.spring.ankur.chatapp_ankur.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ConnectionRepository connectionRepository;
    private final ProfileRepository profileRepository;


    // =========================================================
    // SEND MESSAGE - REST
    // =========================================================

    @Transactional
    public ChatMessageResponse sendMessage(ChatMessageRequest request) {

        String senderId = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        return sendMessage(request, senderId);
    }


    // =========================================================
    // SEND MESSAGE - COMMON LOGIC
    // Used by REST + WebSocket
    // =========================================================

    @Transactional
    public ChatMessageResponse sendMessage(
            ChatMessageRequest request,
            String senderId
    ) {

        User sender = userRepository.findById(senderId)
                .orElseThrow(() ->
                        new RuntimeException("Sender not found")
                );

        User receiver = userRepository.findByUsername(
                request.getReceiverUsername()
        ).orElseThrow(() ->
                new RuntimeException("Receiver not found")
        );


        if (sender.getId().equals(receiver.getId())) {
            throw new RuntimeException(
                    "You cannot message yourself."
            );
        }


        if (!isConnected(sender, receiver)) {
            throw new RuntimeException(
                    "Users are not connected."
            );
        }


        if (request.getContent() == null) {
            throw new RuntimeException(
                    "Message cannot be null."
            );
        }


        String content = request.getContent().trim();


        if (content.isEmpty()) {
            throw new RuntimeException(
                    "Message cannot be empty."
            );
        }


        if (content.length() > 1000) {
            throw new RuntimeException(
                    "Message cannot exceed 1000 characters."
            );
        }


        ChatRoom room = getOrCreateRoom(
                sender,
                receiver
        );


        ChatMessage message = ChatMessage.builder()
                .roomId(room.getId())
                .senderUsername(sender.getUsername())
                .receiverUsername(receiver.getUsername())
                .content(content)
                .createdAt(Instant.now())
                .read(false)
                .build();


        ChatMessage saved =
                chatMessageRepository.save(message);


        return mapToResponse(saved);
    }


    // =========================================================
    // CHECK CONNECTION
    // =========================================================

    private boolean isConnected(
            User sender,
            User receiver
    ) {

        return connectionRepository
                .findBySenderIdAndReceiverIdAndStatus(
                        sender.getId(),
                        receiver.getId(),
                        ConnectionStatus.CONNECTED
                )
                .isPresent()

                ||

                connectionRepository
                        .findByReceiverIdAndSenderIdAndStatus(
                                sender.getId(),
                                receiver.getId(),
                                ConnectionStatus.CONNECTED
                        )
                        .isPresent();
    }


    // =========================================================
    // GET OR CREATE CHAT ROOM
    // =========================================================

    private ChatRoom getOrCreateRoom(
            User user1,
            User user2
    ) {

        String first =
                user1.getUsername()
                        .compareToIgnoreCase(
                                user2.getUsername()
                        ) < 0
                        ? user1.getUsername()
                        : user2.getUsername();


        String second =
                user1.getUsername()
                        .compareToIgnoreCase(
                                user2.getUsername()
                        ) < 0
                        ? user2.getUsername()
                        : user1.getUsername();


        return chatRoomRepository
                .findByUser1AndUser2(first, second)
                .orElseGet(() -> {

                    ChatRoom room = ChatRoom.builder()
                            .user1(first)
                            .user2(second)
                            .createdAt(Instant.now())
                            .build();

                    return chatRoomRepository.save(room);
                });
    }


    // =========================================================
    // MAP MESSAGE
    // =========================================================

    private ChatMessageResponse mapToResponse(
            ChatMessage message
    ) {

        return ChatMessageResponse.builder()
                .id(message.getId())
                .roomId(message.getRoomId())
                .senderUsername(message.getSenderUsername())
                .receiverUsername(message.getReceiverUsername())
                .content(message.getContent())
                .createdAt(message.getCreatedAt())
                .read(message.isRead())
                .build();
    }


    // =========================================================
    // GET ALL CONVERSATIONS
    // =========================================================

    public List<ConversationResponse> getConversations() {

        String currentUserId =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();


        User currentUser =
                userRepository.findById(currentUserId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        List<ChatRoom> rooms =
                chatRoomRepository.findByUser1OrUser2(
                        currentUser.getUsername(),
                        currentUser.getUsername()
                );


        List<ConversationResponse> conversations =
                new ArrayList<>();


        for (ChatRoom room : rooms) {

            String otherUsername =
                    room.getUser1()
                            .equals(currentUser.getUsername())
                            ? room.getUser2()
                            : room.getUser1();


            User otherUser =
                    userRepository
                            .findByUsername(otherUsername)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );


            Profile profile =
                    profileRepository
                            .findByUserId(otherUser.getId())
                            .orElse(null);


            String profileImage = "";


            if (profile != null) {
                profileImage = profile.getProfileImage();
            }


            List<ChatMessage> latestMessages =
                    chatMessageRepository
                            .findByRoomIdOrderByCreatedAtDesc(
                                    room.getId(),
                                    PageRequest.of(0, 1)
                            );


            String lastMessage = "";

            Instant lastMessageTime =
                    room.getCreatedAt();


            if (!latestMessages.isEmpty()) {

                ChatMessage latest =
                        latestMessages.get(0);

                lastMessage =
                        latest.getContent();

                lastMessageTime =
                        latest.getCreatedAt();
            }


            conversations.add(
                    ConversationResponse.builder()
                            .roomId(room.getId())
                            .username(
                                    otherUser.getUsername()
                            )
                            .profileImage(profileImage)
                            .lastMessage(lastMessage)
                            .lastMessageTime(
                                    lastMessageTime
                            )
                            .build()
            );
        }


        conversations.sort(
                Comparator
                        .comparing(
                                ConversationResponse
                                        ::getLastMessageTime
                        )
                        .reversed()
        );


        return conversations;
    }


    // =========================================================
    // GET CHAT HISTORY
    // =========================================================

    public List<ChatMessageResponse> getChatHistory(
            String roomId
    ) {

        String currentUserId =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();


        User currentUser =
                userRepository.findById(currentUserId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        ChatRoom room =
                chatRoomRepository.findById(roomId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Chat room not found"
                                )
                        );


        if (!room.getUser1()
                    .equals(currentUser.getUsername())

                &&

                !room.getUser2()
                    .equals(currentUser.getUsername())) {

            throw new RuntimeException(
                    "Access denied."
            );
        }


        return chatMessageRepository
                .findByRoomIdOrderByCreatedAtAsc(roomId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =========================================================
    // GET ROOM WITH USER
    // =========================================================

    public ChatRoomResponse getRoomWithUser(
            String username
    ) {

        String currentUserId =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();


        User currentUser =
                userRepository.findById(currentUserId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        User otherUser =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        if (!isConnected(
                currentUser,
                otherUser
        )) {

            throw new RuntimeException(
                    "Users are not connected."
            );
        }


        ChatRoom room =
                getOrCreateRoom(
                        currentUser,
                        otherUser
                );


        return ChatRoomResponse.builder()
                .roomId(room.getId())
                .user1(room.getUser1())
                .user2(room.getUser2())
                .build();
    }
}