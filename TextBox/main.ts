
import { App } from './ViewModels/app.ts';
import { mainloop } from "./deps.ts";

/** unpack configuration file */
import cfg from "./cfg.json" assert { type: "json" };
import { containerInit, hydrateUI, render } from './deps.ts'

import manifest from './widget_manifest.ts'

// initialize the Surface container
// REQUIRED-FIRST -> before any app method calls
containerInit(
    cfg,
    manifest,
    'TextBox - Surface Example', // sets window title
)

// initialize our App (main viewmodel)
App.init();

// load and display the Apps UI (User Interface)
// REQUIRED - after the App is initialized
hydrateUI()

// Main Render Loop (MUST be the LAST call in main.ts)
// REQUIRED by the framework (called ~ every 16ms)
await mainloop(render)
