package com.example.qrentrancereader.activities

import android.app.Dialog
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.core.content.ContextCompat
import com.example.qrentrancereader.R
import com.example.qrentrancereader.databinding.DialogProgressBinding
import com.google.android.material.snackbar.Snackbar

open class BaseActivity : AppCompatActivity() {
    private lateinit var progressDialog: Dialog

    fun showProgressDialog(text: String) {
        progressDialog = Dialog(this)
        progressDialog.let { dialog ->
            val dlgBinding = DialogProgressBinding.inflate(layoutInflater)
            dialog.setContentView(dlgBinding.root)
            dlgBinding.tvProgressText.text = text

            dialog.show()
        }
    }

    fun hideProgressDialog() {
        progressDialog.dismiss()
    }

    fun showErrorSnackBar(message: String) {
        val snackBar = Snackbar.make(findViewById(android.R.id.content), message, Snackbar.LENGTH_LONG)
        val snackBarView = snackBar.view
        snackBarView.setBackgroundColor(ContextCompat.getColor(this, R.color.snackbar_error_color))
        snackBar.show()
    }

    fun showInfoSnackBar(message: String) {
        val snackBar = Snackbar.make(findViewById(android.R.id.content), message, Snackbar.LENGTH_LONG)
        val snackBarView = snackBar.view
        snackBarView.setBackgroundColor(ContextCompat.getColor(this, R.color.snackbar_info_color))
        snackBar.show()
    }
}