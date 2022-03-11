package com.example.qrentrancereader.activities

import android.graphics.Color
import android.hardware.Camera
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import com.example.qrentrancereader.databinding.ActivityQrreadBinding
import com.google.zxing.BarcodeFormat
import com.journeyapps.barcodescanner.DefaultDecoderFactory
import java.util.*

class QRReadActivity : BaseActivity() {
    private lateinit var binding: ActivityQrreadBinding
    private var lastText = ""
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
            if( result.text != null && result.text.equals(lastText) == false) {
                lastText = result.text;
                binding.barcodeScanner.setStatusText(result.text)

                //result.getBitmapWithResultPoints(Color.YELLOW) // possible to setImageBitmap to imageView
            } else {
                // prevent duplicate scans
            }
        }
        binding.barcodeScanner.cameraSettings.requestedCameraId = Camera.CameraInfo.CAMERA_FACING_FRONT;
        binding.barcodeScanner.resume()
    }

   fun pause(view: View) {
       binding.barcodeScanner.pause()
   }

    fun resume(view: View) {
        binding.barcodeScanner.resume()
    }

    fun triggerScan(view: View) {
        binding.barcodeScanner.decodeSingle {
            if( it.text != null && it.text.equals(lastText) == false) {
                lastText = it.text;
                binding.barcodeScanner.setStatusText(it.text)

                //result.getBitmapWithResultPoints(Color.YELLOW) // possible to setImageBitmap to imageView
            } else {
                // prevent duplicate scans
            }
        }
    }
}