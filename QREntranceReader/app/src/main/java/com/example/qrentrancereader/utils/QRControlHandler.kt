package com.example.qrentrancereader.utils

import android.text.TextUtils
import io.socket.client.IO
import io.socket.client.Socket
import io.socket.emitter.Emitter
import org.json.JSONObject
import java.lang.Exception
import java.net.URISyntaxException
import java.util.*

interface QRControlResultHandler {
    fun error(msg: String, command: String)
    fun update(command: String, status: String, msg: String)
}

class QRControlHandler(
    private val serverAddress: String,
    val eventId: String,
    val eventAppId: String,
    val qrAppId: String,
    val resultHandler: QRControlResultHandler) {

    private lateinit var socket: Socket

    fun connect() {

        try {
            socket = IO.socket(serverAddress)
            socket.connect()
        } catch(e: URISyntaxException) {
            resultHandler.error(e.toString(), Constants.QRCntlCommand.JOIN_CHANNEL)
        } catch(e: Exception) {
            resultHandler.error(e.toString(), Constants.QRCntlCommand.JOIN_CHANNEL)
        }

        socket.on(Socket.EVENT_CONNECT, onConnect)
        socket.on(Socket.EVENT_DISCONNECT, onDisconnect)
        socket.on(Constants.QRCntlCommand.JOIN_CHANNEL, onJoinChannel)
        socket.on(Constants.QRCntlCommand.CONTROL_QR_READER, onControlQRReader)
        socket.on(Constants.QRCntlCommand.QR_STATUS_UPDATE, onQRStatusUpdate)
        socket.on(Constants.QRCntlCommand.LEAVE_CHANNEL, onLeaveChannel)
        socket.on(Constants.QRCntlCommand.DESTROY_CHANNEL, onDestroyChannel)
        socket.on(Constants.QRCntlCommand.ERROR, onError)
    }

    fun SendQrStatusChange(targetQrStatus: String, qrInfo: String = "") {
        val data = JSONObject()
        data.put("token", UUID.randomUUID().toString())
        data.put("eventId", eventId)
        data.put("appId", eventAppId)
        data.put("state", targetQrStatus)
        if(!TextUtils.isEmpty(qrInfo)) {
            data.put("qrInfo", qrInfo)
        }

        socket.emit(Constants.QRCntlCommand.QR_STATUS_UPDATE, data)
    }

    private val onConnect = Emitter.Listener {
        val joinData = JSONObject()
        joinData.put("token", UUID.randomUUID().toString())
        joinData.put("eventId", eventId)
        joinData.put("appId", eventAppId)
        joinData.put( "eventAppId", eventAppId)

        socket.emit(Constants.QRCntlCommand.JOIN_CHANNEL, joinData)
    }

    private val onDisconnect = Emitter.Listener {
        resultHandler.error("disconnected!!", Constants.QRCntlCommand.ERROR)
    }

    private val onJoinChannel = Emitter.Listener { args ->
        val data = JSONObject(args[0].toString())

        resultHandler.update(Constants.QRCntlCommand.JOIN_CHANNEL, Constants.QRReaderStatus.QR_READ_WAIT, "Ready to Read!")
    }
    private val onControlQRReader = Emitter.Listener { args ->
        val data = JSONObject(args[0].toString())
        val message = data.getJSONObject("message")

        resultHandler.update(Constants.QRCntlCommand.CONTROL_QR_READER, data.getString("targetQrStatus"), message.getString("value"))
    }
    private val onQRStatusUpdate = Emitter.Listener { args ->
        val data = JSONObject(args[0].toString())

        // Just inform
        resultHandler.update(Constants.QRCntlCommand.QR_STATUS_UPDATE, "", "")
    }
    private val onLeaveChannel = Emitter.Listener {
        resultHandler.update(Constants.QRCntlCommand.LEAVE_CHANNEL, Constants.QRReaderStatus.QR_READ_BLOCK, "Service Closed!")
    }
    private val onDestroyChannel = Emitter.Listener {
        resultHandler.update(Constants.QRCntlCommand.DESTROY_CHANNEL, Constants.QRReaderStatus.QR_READ_BLOCK, "Service Not Avail")
    }
    private val onError = Emitter.Listener { args ->
        val data = JSONObject(args[0].toString())

        resultHandler.error(data.getString("message"), data.getString("command"))
    }
}