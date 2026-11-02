plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "com.nomanharis.urdureader"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.nomanharis.urdureader"
        minSdk = 26
        targetSdk = 35
        // Each GitHub build gets a higher number, so phones see it as an update.
        val build = System.getenv("GITHUB_RUN_NUMBER")?.toIntOrNull() ?: 1
        versionCode = build
        versionName = "1.0.$build"
    }

    // A fixed signing key lets every new build install over the previous one (keeping scores).
    // CI provides it from repository secrets; without them the usual debug key is used.
    val keystorePath = System.getenv("URDU_KEYSTORE_FILE")
    signingConfigs {
        create("family") {
            if (keystorePath != null) {
                storeFile = file(keystorePath)
                storePassword = System.getenv("URDU_KEYSTORE_PASSWORD")
                keyAlias = "urduparho"
                keyPassword = System.getenv("URDU_KEYSTORE_PASSWORD")
            }
        }
    }
    val signing = if (keystorePath != null) signingConfigs.getByName("family") else signingConfigs.getByName("debug")

    buildTypes {
        debug {
            signingConfig = signing
        }
        release {
            isMinifyEnabled = false
            signingConfig = signing
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    androidResources {
        noCompress += "traineddata"
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.12.01")
    implementation(composeBom)
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-core")
    implementation("androidx.compose.ui:ui-tooling-preview")
    debugImplementation("androidx.compose.ui:ui-tooling")

    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")
    implementation("androidx.exifinterface:exifinterface:1.3.7")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")

    // Offline OCR. Google ML Kit has no Urdu / Arabic-script model, Tesseract does.
    implementation("cz.adaptech.tesseract4android:tesseract4android:4.7.0")

    testImplementation("junit:junit:4.13.2")
}
