## Project : qr-entrance-control
- Project for QR code entrance control
  - QR code reader on mobile(android) <- MAIN : controlled by web interface.(socket.io)
  - web interface : developed by react as a prototype -> No UI/UX considered
  - socket.io server : developed by Node.js -> No data validation is done

## Source Code Structure Overview
- QR Code Reader
  - QREntranceReader
  - execution : with AndroidStudio
- QR entrance monitor/control web interface
  - qr-entrance-control-prototype/app
  - execution : move to above path, and execute `npm start`
  - Reference to detach module to extend the feature from the source code
    - Control UI : [qr-entrance-control-prototype/app/src/ControlPage](https://github.com/withel21/qr-entrance-control/tree/main/qr-entrance-control-prototpye/app/src/ControlPage)
    - socket handlers : [qr-entracne-control-prototype/app/src/utils](https://github.com/withel21/qr-entrance-control/tree/main/qr-entrance-control-prototpye/app/src/utils)
- QR entrance control server
  - qr-entrance-control-prototype/server
  - execution : move to above path, and execute `npm start`
  - Reference to detach module to extend the feature from the source code
    - socket handlers : [qr-entrance-control-prototype/server/channelHandler.js](https://github.com/withel21/qr-entrance-control/blob/main/qr-entrance-control-prototpye/server/channelHandler.js)

## Use Flow
### 1. Execute the prototype of QR entrace server
### 2. Execute the prototype of QR entrance monitor/control web-app
### 3. Set information on web-app with below items and then click `Next` 
  - Event ID : the identification string for one event to need QR entrance control
  - app ID : QR entrance/control web-app's identity(string)
  - server address : `http://(prototypeserveraddress):5002`
### 4. Execute QR Code Reader on android mobile phone
### 5. Input information with below items and then click `START`
  - Event ID : the identification string of one event to need QR entrance - same one of web-app's event ID
  - Event App ID : QR entrance/control web-app's identity(string) - same one of web-app's app ID
  - QR App ID : QR Code Reader's identity
  - socket.io server address : `http://(prototypeserveraddress):5002`
### 6. After success of connection between QR App & web app
  - On web-app, qr app ID is presented and shows *QR_READ_WAIT* mode
  - QR Code Reader waits the QR code input
  - There are four modes
    - *QR_READ_WAIT*
      - QR code reader : wait QR code input
      - web app : just wait QR code result from QR code reader
    - *QR_READ_INFO*
      - QR code reader : read QR code, present admission waiting message, transfer the decoded result to web-app via socket-io server and stop reading QR code
      - web app : QR result is presented and control QR code reader to go to *QR_ENTRANCE_ADMIT* by clicking "Admit Entrance" or *QR_READ_WAIT* by clicking "Drop"
        - On clicking "Drop", it emulates *invalid QR code* concept -> therefore, this should be processed on server side in real application
    - *QR_ENTRANCE_ADMIT*
      - QR code reader : on keeping stopping QR code reading, present admission allowed message
      - web app : control QR code reader to go to *QR_READ_BLOCK* by clicking "On Shooting" or *QR_READ_WAIT* by clicking "DROP"
    - *QR_READ_BLOCK*
      - QR code reader : on keeping stopping QR code reading, present occupied booth message
      - web app : control QR code reader to go to *QR_READ_WAIT* by clicking "Next Fan Wait"
    ```
    QR_READ_WAIT ---> QR_READ_INFO ---> QR_ENTRANCE_ADMIT ---> QR_READ_BLOCK
         ^                |                     |                    |
         +----------------+---------------------+--------------------+                
    ```
