package com.example.qrentrancereader.activities

import android.content.Intent
import android.content.IntentSender
import android.graphics.Color
import android.hardware.Camera
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.CountDownTimer
import android.text.TextUtils
import android.util.Log
import android.view.View
import android.view.WindowManager
import com.example.qrentrancereader.databinding.ActivityQrreadBinding
import com.example.qrentrancereader.utils.Constants
import com.example.qrentrancereader.utils.QRControlHandler
import com.example.qrentrancereader.utils.QRControlResultHandler
import com.google.android.material.snackbar.Snackbar
import com.google.zxing.BarcodeFormat
import com.journeyapps.barcodescanner.DefaultDecoderFactory
import org.json.JSONObject
import java.util.*

class QRReadActivity : BaseActivity(), QRControlResultHandler {
    private lateinit var binding: ActivityQrreadBinding
    private var lastText = ""
    private lateinit var qrControlHandler : QRControlHandler
    private var progressBarTimer: CountDownTimer? = null
    private var guideTimer: CountDownTimer? = null
    private var currentStatus: String = ""
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityQrreadBinding.inflate(layoutInflater)
        setContentView(binding.root)

        window.setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        )

        val formats = Arrays.asList(BarcodeFormat.QR_CODE, BarcodeFormat.CODE_39);
        binding.barcodeScanner.barcodeView.decoderFactory = DefaultDecoderFactory(formats)
        binding.barcodeScanner.initializeFromIntent(intent)
        binding.barcodeScanner.decodeContinuous { result ->
            if (result.text != null && result.text.equals(lastText) == false) {
                lastText = result.text;
                //binding.barcodeScanner.setStatusText(result.text)

                currentStatus = Constants.QRReaderStatus.QR_READ_INFO;
                qrControlHandler.SendQrStatusChange(currentStatus, lastText)
                //result.getBitmapWithResultPoints(Color.YELLOW) // possible to setImageBitmap to imageView
            } else {
                // prevent duplicate scans
            }
        }
        binding.barcodeScanner.cameraSettings.requestedCameraId = Camera.CameraInfo.CAMERA_FACING_FRONT;

        connectToServer()
    }

    override fun onDestroy() {
        qrControlHandler.disconnect()

        guideTimer?.cancel()
        guideTimer = null

        super.onDestroy()
    }

    fun pause() {
        binding.barcodeScanner.pause()
        Log.d("QRCONTROLCHANNEL", "pause called")
        lastText = "" // reset last read QR Info
        binding.coverView.visibility = View.VISIBLE
    }

    fun resume() {
        binding.barcodeScanner.resume()
        Log.d("QRCONTROLCHANNEL", "resume called")
        binding.coverView.visibility = View.INVISIBLE
    }

    fun triggerScan(view: View) {
        binding.barcodeScanner.decodeSingle {
            if( it.text != null && it.text.equals(lastText) == false) {
                lastText = it.text;
                //binding.barcodeScanner.setStatusText(it.text)

                currentStatus = Constants.QRReaderStatus.QR_READ_INFO
                qrControlHandler.SendQrStatusChange(currentStatus, lastText)
                binding.barcodeScanner.pause()

                //result.getBitmapWithResultPoints(Color.YELLOW) // possible to setImageBitmap to imageView
            } else {
                // prevent duplicate scans
            }
        }
    }

    override fun error(msg: String, command: String) {
        runOnUiThread {
            hideProgressDialog()
            when (command) {
                Constants.QRCntlCommand.JOIN_CHANNEL -> {
                    showErrorSnackBar(if (TextUtils.isEmpty(msg)) "Fail to connect to server" else msg)
                }
                Constants.QRCntlCommand.QR_STATUS_UPDATE -> {
                    showErrorSnackBar(if (TextUtils.isEmpty(msg)) "Fail to report qr status" else msg)
                }
                Constants.QRCntlCommand.CONTROL_QR_READER -> {
                }
                else -> {
                    showErrorSnackBar(msg)
                }
            }
        }
    }

    override fun update(command: String, status: String, msg: String) {
        runOnUiThread {
            when (command) {
                Constants.QRCntlCommand.JOIN_CHANNEL -> {
                    hideProgressDialog()
                }
                Constants.QRCntlCommand.CONTROL_QR_READER -> {
                    binding.tvStatus.text = status
                    if (TextUtils.isEmpty(msg)) {
                        binding.tvGuide.visibility = View.INVISIBLE
                    } else {
                        binding.tvGuide.visibility = View.VISIBLE
                        binding.tvGuide.text = msg
                    }
                    when (status) {
                        Constants.QRReaderStatus.QR_READ_WAIT -> {
                            resume()
                        }
                        else -> {
                            pause()
                        }
                    }
                    if(currentStatus != status) {
                        currentStatus = status
                        qrControlHandler.SendQrStatusChange(status)
                    }
                }
                Constants.QRCntlCommand.QR_STATUS_UPDATE -> {
                    // Nothing to do. but just check if status is the same as current
                    if(!TextUtils.isEmpty(status)) {
                        binding.tvStatus.text = status
                    }
                }
                Constants.QRCntlCommand.LEAVE_CHANNEL -> {
                    showInfoSnackBar("Leaving Service...", object : Snackbar.Callback() {
                        override fun onDismissed(transientBottomBar: Snackbar?, event: Int) {
                            if( event == Snackbar.Callback.DISMISS_EVENT_TIMEOUT) {
                                returnToMainActivity()
                            }
                        }
                    })
                }
                Constants.QRCntlCommand.DESTROY_CHANNEL -> {
                    showErrorSnackBar("Operation Control Disconnected!", object : Snackbar.Callback() {
                        override fun onDismissed(transientBottomBar: Snackbar?, event: Int) {
                            if( event == Snackbar.Callback.DISMISS_EVENT_TIMEOUT) {
                                returnToMainActivity()
                            }
                        }
                    })
                }
                else -> {
                    // IGNORE!?
                }
            }
        }
    }

    private fun returnToMainActivity() {
        startActivity(Intent(this@QRReadActivity, MainActivity::class.java))
        finish()
    }

    private fun connectToServer() {
        val serverAddr = intent.getStringExtra(Constants.SERVER_ADDR) ?: ""
        val eventId = intent.getStringExtra(Constants.EVENT_ID) ?: ""
        val eventAppId = intent.getStringExtra(Constants.EVENT_APP_ID) ?: ""
        val qrAppId = intent.getStringExtra(Constants.QRAPP_ID) ?: ""

        showProgressDialog("Connecting...")

        qrControlHandler = QRControlHandler(serverAddr, eventId, eventAppId, qrAppId, this)
        qrControlHandler.connect()
    }

    private fun setTimerForGuide(sec: Long = 3) {
        guideTimer?.cancel()
        guideTimer = object : CountDownTimer(sec * 1000, 1000) {
            override fun onTick(millisUntilFinished: Long) {

            }

            override fun onFinish() {
                binding.tvGuide.visibility = View.INVISIBLE
                guideTimer = null
            }
        }.start()
    }
}