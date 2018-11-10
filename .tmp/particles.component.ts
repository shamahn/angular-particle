import { Component, Input, OnInit } from '@angular/core';
import { IParams } from './lib/index';

@Component({
    selector: 'ng-particles',
    template: `
        <div [ngStyle]="style" class="particles-container">
            <canvas dParticles [params]="params" [style.width.%]="width" [style.height.%]="height"></canvas>
        </div>
    `
})
export class ParticlesComponent {

    @Input() width = 100;
    @Input() height = 100;
    @Input() params: IParams;
    @Input() style: Object = {};

    constructor() { }
}
