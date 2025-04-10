import './bootstrap';
import "https://cdn.jsdelivr.net/npm/ionicons@latest/dist/ionicons/ionicons.esm.js";

import { setupInstance } from './instanceManager.js';
import { setupThemeToggle } from "./themeToggle.js";

setupThemeToggle();

document.addEventListener('livewire:init', () => {
    Livewire.on('showDataset', (event) => {
        console.log("showDataset event fired with path:", event.path);
        let filePath = event.path;
        setupInstance(filePath, false, 2, 1);
    });
});


