package com.example.qrentrancereader.activities

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.WindowManager
import com.example.qrentrancereader.R
import com.example.qrentrancereader.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
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
    }

    private fun startQrReaderApp() {
        val eventId: String = binding.etEventId.text.toString().trim { it <= ' ' }
        val eventAppId: String = binding.etEventAppId.text.toString().trim { it <= ' ' }
        val qrAppId: String = binding.etQRAppId.text.toString().trim { it <= ' '}
        val serverAddres: String = binding.etServerAddress.text.toString().trim { it <= ' ' }

        // TODO:
    }

}