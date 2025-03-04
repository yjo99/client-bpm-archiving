import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        <a href="https://exact.com.co/" target="_blank" rel="noopener noreferrer" class="font-bold hover:underline" >EXACT.</a> All rights reserved.
    </div>`
})
export class AppFooter {}
