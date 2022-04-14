## Abstract
  Explain the protocol which is used in the communication for QR reader control  
  QR 리더 컨트롤을 위한 통신에서 사용된 프로토몰을 설명합니다.

## Advance in Knowledge

### Entities
  The system consists of three entities(시스템은 세 개의 엔터티로 구성되어 있습니다.)
  1. QR Reader(QRA)  
    - Reading QR and presenting message for entrance control(QR을 읽고, 입구 제어를 위한 메시지를 보여줍니다.)
  2. Entrance Control WebApp(ECA)  
    - As an operation tool, control the entrance based on QR info and the site situation.(운영 툴로써, QR 정보와 현장 상황에 따라 입구를 제어합니다.)
  3. Server(SIS)  
    - Mediator of communication between QR Reader and Entrance Control WebaApp(QR Reader와 Entrance Control WebApp의 중개자)

### Terminology
  - Socket.io : protocol is implemented on socket.io.(그리고 protocol은 socket.io 위에 구현되어 있습니다.)
  - Channel : The mapping of QRA and ECA is managed as the concept of channel in SIS.(QRA와 ECA의 mapping은 채널의 개념으로 SIS에서 관리합니다.)
    * There is ONLY 1 channel for 1 ECA.(하나의 ECA에 대하여 하나의 채널만 생성합니다.)
  - App ID : In a channel, to identify each entity, text-base app id is used.(채널 내에서 각 엔터티를 식별하기 위해 택스트 기반의 id를 사용합니다.)
  - Event ID : event id indicates conceptually the event that use this system.(event id는 개념적으로 이 시스템을 이용하는 이벤트를 가리킵니다.)
  - token : As the id of the transaction, requester issues to identify the transaction on both of requester and responser(트랜잭션의 ID로 requester가 발급하며, requester와 responser 둘 다 해당 트랜잭션을 구별하기 위해 사용됩니다.)

## Protocol Specification

### Commands - events of socket.io
  - Generally, the response of an event, the same event is used, but the response can be identified by a token.(일반적으로 이벤트에 대한 응답은 같은 이벤트로 응답됩니다만, 응답은 token에 의해 식별가능합니다)
  - Usually, requested information is sent to target app and the response is not from target app but from SIS.(보통, 요청된 정보는 타겟 앱으로 전송되지만, 응답은 SIS가 줍니다.)
  - That is, response with same command and token means that the request is successfully handed to target app.(즉, 동일한 커맨드와 token에 대한 응답은 성공적으로 요청 정보가 target app에 전달되었음을 의미합니다.)
  - Otherwise, error command is sent as the response from SIS, generally.(그렇지 않다면 error 커맨드가 일반적으로 SIS로 부터 전달됩니다.)
  - Command List
    * **CREATE_CHANNEL**('create-channel') : ECA requests to make a channel to SIS(ECA가 SIS에 채널 생성을 요청합니다.)
      - request
      ```javascript
      {
        token: string,
        eventId: string,
        appId: string,      // ECA's id
      }      
      ```
      - response
      ```javascript
      {
        token: string,      // the same one of request
        eventId: string,  
        appId: string,      // ECA's id
        channelId: string,  // channel id to be created
      }
      ```
    * **JOIN_CHANNEL**('join-channel') : QRA reqeusts to join in the channel which the designated ECA made.(QRA가 지정된 ECA가 만든 채널 조인을 요청합니다.)
      - request
      ```javascript
      {
        token: string,
        eventId: string,
        appId: string,      // QRA's id
        eventAppId: string, // target ECA's id
      }
      ```
      - response
      ```javascript
      {
        token: string,      // the same one of request
        eventId: string,
        appId: string,      // QRA's id
        eventAppId: string, // ECA's id
        channelId: string,
      }
      ```
    * **CONTROL_QR_READER**('control-qr-reader') : ECA requests to control the QRA to change status and show message.(ECA가 QRA에 상태를 바꾸거나, 메시지를 보여주는 제어를 요청합니다.)
      - request
      ```javascript
      {
        token: string,
        eventId: string,
        appId: string,            // ECA's id
        targetQrStatus: string,   // QR_READ_WAIT, QR_READ_INFO, QR_READ_BLOCK, QR_ENTRANCE_ADMIT
        message: {
          type: "text",
          value: string,          // the message to be presented on QR Reader for the status
        },
      }
      ```
      - response
      ```javascript
      {
        token: string,            // the same one of request
        eventId: string,
        appId: string,            // ECA's id
        targetQrStatus: string,   // sent status
      }
      ```
    * **QR_STATUS_UPDATE**('qr-status-update') : QRA requests to notify the status change to ECA.(QRA가 상태변경을 ECA에 알리기 위해 요청합니다.)
      - request
      ```javascript
      {
        token: string,
        eventId: string,
        appId: string,          // QRA's id
        state: string,          // current QRA's state : QR_READ_WAIT, QR_READ_INFO, QR_READ_BLOCK, QR_ENTRANCE_ADMIT
        qrInfo: string,         // optional when state === QR_READ_INFO, scanned qr info
      }
      ```
      - response
      ```javascript
      {
        token: string,          // the same one of request
        eventId: string,
        appId: string,          // QRA's id
        state: string,          // sent status
      }
      ```
    * **LEAVE_CHANNEL**('leave-channel') : QRA requests to leave the channel.(QRA가 채널에서 나오기 위해 요청합니다.)
      - request
      ```javascript
      {
        token: string,
        eventId: string,
        appId: string,          // QRA's id
      }
      ```
      - response
      ```javascript
      {
        token: string,          // the same one of request
        eventId: string,
        appId: string,          // QRA's id
      }
      ```
    * **DESTROY_CHANNEL**('destroy-channel' : ECA requests to destroy the channel.(ECA가 채널의 파괴를 위해 요청합니다.)
      - request
      ```javascript
      {
        token: string,
        eventId: string,
        appId: string,          // ECA's id
      }      
      ```
      - response
      ```javascript
      {
        token: string,          // the same one of request
        eventId: string,  
        appId: string,          // ECA's id
      }
      ```
    * **ERROR**('error') 
      - if there is an error for any command, error command is sent to requester.(어떤 커맨드던지 에러가 있으면, 에러 커맨드가 requester에 보내집니다.)
      - When ECA/QRA wants to send its error to peer, this command can be used.(ECA/QRA가 발생한 에러를 상대방에게 보내고 싶을 때 보낼 수 있다)
      - request & response
      ```javascript
      {
        token: string,      // the same one of request
        eventId: string,
        appId: string,      // requester's id
        command: string,    // command for this error
        message: string,    // error message
      }
      ```
