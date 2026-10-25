plugins {
    id("com.android.application")
}

android {
    namespace = "com.fan.tsmalfoy"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.fan.tsmalfoy"
        minSdk = 26
        targetSdk = 35
        // CI 실행 번호를 버전 코드로 써서 새 APK가 기존 설치를 덮어쓸 수 있게 한다
        versionCode = (System.getenv("GITHUB_RUN_NUMBER") ?: "1").toInt()
        versionName = "0.1." + (System.getenv("GITHUB_RUN_NUMBER") ?: "0")
    }

    signingConfigs {
        // 팬게임 배포용 고정 키 (비밀이 아님). 같은 키로 서명해야 업데이트 설치가 된다.
        create("fan") {
            storeFile = file("fan-release.keystore")
            storePassword = "tsmalfoy"
            keyAlias = "tsmalfoy"
            keyPassword = "tsmalfoy"
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            signingConfig = signingConfigs.getByName("fan")
        }
        debug {
            signingConfig = signingConfigs.getByName("fan")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
