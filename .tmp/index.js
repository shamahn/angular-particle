"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var particles_component_1 = require("./particles.component");
var particles_directive_1 = require("./particles.directive");
__export(require("./particles.component"));
__export(require("./particles.directive"));
var ParticlesModule = /** @class */ (function () {
    function ParticlesModule() {
    }
    ParticlesModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule
            ],
            declarations: [
                particles_component_1.ParticlesComponent,
                particles_directive_1.ParticlesDirective
            ],
            exports: [
                particles_component_1.ParticlesComponent,
                particles_directive_1.ParticlesDirective
            ]
        })
    ], ParticlesModule);
    return ParticlesModule;
}());
exports.ParticlesModule = ParticlesModule;
