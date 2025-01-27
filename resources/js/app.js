import './bootstrap';
import "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js";
import "https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js";
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


