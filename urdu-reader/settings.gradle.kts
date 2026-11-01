pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
        // Tesseract4Android (offline Urdu OCR) is published on JitPack.
        maven("https://jitpack.io")
    }
}

rootProject.name = "UrduReader"
include(":app")
