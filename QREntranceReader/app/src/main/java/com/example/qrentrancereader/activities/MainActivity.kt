package com.example.qrentrancereader.activities

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.WindowManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.example.qrentrancereader.databinding.ActivityMainBinding

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
        val serverAddres: String = binding.etServerAddress.text.toString().trim { it <= ' ' }

        // TODO:

        // Temporarily goto QRReadActivity
        startActivity(Intent(this, QRReadActivity::class.java))
    }

    private fun checkPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
            showInfoSnackBar("You already have the permission for camera.")
        } else {
            // Request Permission
            ActivityCompat.requestPermissions(this, arrayOf(Manifest.permission.CAMERA), CAMERA_PERMISSON_CODE)
        }

    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (requestCode == CAMERA_PERMISSON_CODE) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                showInfoSnackBar("Permission granted for camera.")
            } else {
                showInfoSnackBar("Oops, you just denied the permission for camera. You can also allow it form settings.")
            }
        }
    }


    companion object {
        private const val CAMERA_PERMISSON_CODE = 1
    }

}