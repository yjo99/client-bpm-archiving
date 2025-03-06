import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {AppFloatingConfigurator} from "../../layout/component/app.floatingconfigurator";

@Component({
    selector: 'app-dynamic-view',
    standalone: true,
    imports: [
        AppFloatingConfigurator
    ],
    templateUrl: './process-view.html'
})
export class DynamicViewComponent implements OnInit {
    instanceId!: number;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.instanceId = +params['id']; // Convert to number
            console.log('Instance ID:', this.instanceId); // Debugging
            this.loadInstanceData(this.instanceId);
        });
    }

    loadInstanceData(id: number) {
        this.instanceId = id;
    }
}
