package com.nomanharis.urdureader

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.nomanharis.urdureader.data.Store
import com.nomanharis.urdureader.ui.AddPassageScreen
import com.nomanharis.urdureader.ui.HomeScreen
import com.nomanharis.urdureader.ui.ProgressScreen
import com.nomanharis.urdureader.ui.ReadScreen
import com.nomanharis.urdureader.ui.UrduReaderTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val store = Store.get(this)
        setContent {
            UrduReaderTheme {
                // Routes: "home", "add", "progress", "read:<passageId>"
                var route by rememberSaveable { mutableStateOf(HOME) }
                BackHandler(enabled = route != HOME) { route = HOME }

                when {
                    route == ADD -> AddPassageScreen(
                        store = store,
                        onBack = { route = HOME },
                        onSaved = { route = "read:${it.id}" },
                    )
                    route == PROGRESS -> ProgressScreen(store = store, onBack = { route = HOME })
                    route.startsWith("read:") -> {
                        val passage = store.passage(route.removePrefix("read:"))
                        if (passage == null) LaunchedEffect(route) { route = HOME }
                        else ReadScreen(passage = passage, store = store, onBack = { route = HOME })
                    }
                    else -> HomeScreen(
                        store = store,
                        onRead = { route = "read:${it.id}" },
                        onAdd = { route = ADD },
                        onProgress = { route = PROGRESS },
                    )
                }
            }
        }
    }

    private companion object {
        const val HOME = "home"
        const val ADD = "add"
        const val PROGRESS = "progress"
    }
}
