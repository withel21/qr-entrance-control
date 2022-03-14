package com.example.qrentrancereader.activities

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.TextUtils
import android.view.WindowManager
import android.webkit.URLUtil
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.qrentrancereader.R
import com.example.qrentrancereader.databinding.ActivityMainBinding
import com.example.qrentrancereader.utils.Constants
import org.w3c.dom.Text

class MainActivity : BaseActivity() {
    private lateinit var binding: ActivityMainBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        window.setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        )

        binding.btnSetAndStart.setOnClickListener {
            startQrReaderApp()
        }

        setSupportActionBar(binding.toolBarMain)

        checkPermission()
    }

    private fun startQrReaderApp() {
        val eventId: String = binding.etEventId.text.toString().trim { it <= ' ' }
        val eventAppId: String = binding.etEventAppId.text.toString().trim { it <= ' ' }
        val qrAppId: String = binding.etQRAppId.text.toString().trim { it <= ' '}
        val serverAddress: String = binding.etServerAddress.text.toString().trim { it <= ' ' }

        if(validateForm(eventId, eventAppId, qrAppId, serverAddress)) {
            val intent = Intent(this, QRReadActivity::class.java)

            intent.putExtra(Constants.EVENT_ID, eventId)
            intent.putExtra(Constants.EVENT_APP_ID, eventAppId)
            intent.putExtra(Constants.QRAPP_ID, qrAppId)
            intent.putExtra(Constants.SERVER_ADDR, serverAddress)

            startActivity(intent)
            finish()
        }
    }

    private fun validateForm(eventId: String, eventAppId: String, qrAppId: String, serverAddress: String): Boolean {
        return when {
            TextUtils.isEmpty(eventId) -> {
                showErrorSnackBar(resources.getString(R.string.event_id_validation))
                false
            }
            TextUtils.isEmpty(eventAppId) -> {
                showErrorSnackBar(resources.getString(R.string.event_app_id_validation))
                false
            }
            TextUtils.isEmpty(qrAppId) -> {
                showErrorSnackBar(resources.getString(R.string.qr_app_id_validation))
                false
            }
            TextUtils.isEmpty(serverAddress) -> {
                showErrorSnackBar(resources.getString(R.string.server_address_validation))
                false
            }
            !URLUtil.isHttpUrl(serverAddress) and !URLUtil.isHttpsUrl(serverAddress) -> {
                showErrorSnackBar(resources.getString(R.string.server_address_url_validation))
                false
            }
            else -> true
        }
    }
    private fun checkPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            showInfoSnackBar("You already have the permission for camera.")
        } else {
            // Request Permission
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.CAMERA), CAMERA_PERMISSION_CODE)
        }

    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (requestCode == CAMERA_PERMISSION_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                showInfoSnackBar("Permission granted for camera.")
            } else {
                showInfoSnackBar("Oops, you just denied the permission for camera. You can also allow it form settings.")
            }
        }
    }


    companion object {
        private const val CAMERA_PERMISSION_CODE = 1
    }

}