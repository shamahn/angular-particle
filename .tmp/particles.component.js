"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ParticlesComponent = /** @class */ (function () {
    function ParticlesComponent() {
        this.width = 100;
        this.height = 100;
        this.style = {};
    }
    __decorate([
        core_1.Input()
    ], ParticlesComponent.prototype, "width", void 0);
    __decorate([
        core_1.Input()
    ], ParticlesComponent.prototype, "height", void 0);
    __decorate([
        core_1.Input()
    ], ParticlesComponent.prototype, "params", void 0);
    __decorate([
        core_1.Input()
    ], ParticlesComponent.prototype, "style", void 0);
    ParticlesComponent = __decorate([
        core_1.Component({
            selector: 'particles',
            template: "\n        <div [ngStyle]=\"style\" class=\"particles-container\">\n            <canvas d-particles [params]=\"params\" [style.width.%]=\"width\" [style.height.%]=\"height\"></canvas>\n        </div>\n    "
        })
    ], ParticlesComponent);
    return ParticlesComponent;
}());
exports.ParticlesComponent = ParticlesComponent;
