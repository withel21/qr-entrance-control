package com.example.qrentrancereader.utils

object Constants {
    object QRCntlCommand {
        const val CREATE_CHANNEL: String = "create-channel"
        const val JOIN_CHANNEL: String = "join-channel"
        const val CONTROL_QR_READER: String = "control-qr-reader"
        const val QR_STATUS_UPDATE: String = "qr-status-update"
        const val LEAVE_CHANNEL: String = "leave-channel"
        const val DESTROY_CHANNEL: String = "destroy-channel"
        const val ERROR: String = "error"
    }

    object QRReaderStatus {
        const val QR_READ_WAIT: String = "Read Wait"
        const val QR_READ_INFO: String = "Read Info"
        const val QR_READ_BLOCK: String = "Block Reader"
    }
}
