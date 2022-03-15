# Project : qr-entrance-control
- Project for QR code entrance control
  - QR code reader on mobile(android) : controlled by web interface.(especially socket.io)
  - web interface : developed by react as a prototype => No UI/UX considered
  - socket.io server : developed by Node.js -> No data validation is done

# Source Code Structure Overview
- QR Code Reader
  - QREntranceReader
  - execution : with AndroidStudio
- QR entrance monitor/control web interface
  - qr-entrance-control-prototype/app
  - execution : move to above path, and execute `npm start`
  - Reference to detach module to extend the feature from the source code
    - Control UI : qr-entrance-control-prototype/app/src/ControlPage
    - socket handlers : qr-entracne-control-prototype/app/src/utils
- QR entrance control server
  - qr-entrance-control-prototype/server
  - execution : move to above path, and execute `npm start`
  - Reference to detach module to extend the feature from the source code
    - socket handlers : qr-entrance-control-prototype/server/channelHandler.js
