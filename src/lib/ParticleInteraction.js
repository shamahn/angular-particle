"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ParticleInteraction = /** @class */ (function () {
    function ParticleInteraction() {
    }
    ParticleInteraction.prototype.linkParticles = function (p1, p2, params, canvasParams) {
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var line_linked = params.particles.line_linked;
        if (dist <= params.particles.line_linked.distance) {
            var opacity_line = params.particles.line_linked.opacity -
                dist /
                    (1 / params.particles.line_linked.opacity) /
                    params.particles.line_linked.distance;
            if (opacity_line > 0) {
                var color_line = params.particles.line_linked.color_rgb_line;
                var r = color_line.r, g = color_line.g, b = color_line.b;
                canvasParams.ctx.save();
                canvasParams.ctx.strokeStyle = "rgba( " + r + ", " + g + ", " + b + ", " + opacity_line + " )";
                canvasParams.ctx.lineWidth = params.particles.line_linked.width;
                canvasParams.ctx.beginPath();
                if (line_linked.shadow.enable) {
                    canvasParams.ctx.shadowBlur = line_linked.shadow.blur;
                    canvasParams.ctx.shadowColor = line_linked.shadow.color;
                }
                canvasParams.ctx.moveTo(p1.x, p1.y);
                canvasParams.ctx.lineTo(p2.x, p2.y);
                canvasParams.ctx.stroke();
                canvasParams.ctx.closePath();
                canvasParams.ctx.restore();
            }
        }
    };
    ParticleInteraction.prototype.attractParticles = function (p1, p2, params) {
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= params.particles.line_linked.distance) {
            var ax = dx / (params.particles.move.attract.rotateX * 1000);
            var ay = dy / (params.particles.move.attract.rotateY * 1000);
            p1.vx -= ax;
            p1.vy -= ay;
            p2.vx += ax;
            p2.vy += ay;
        }
    };
    ParticleInteraction.prototype.bounceParticles = function (p1, p2) {
        var dx = p1.x - p2.x;
        var dy = p1.y - p2.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var dist_p = p1.radius + p2.radius;
        if (dist <= dist_p) {
            p1.vx = -p1.vx;
            p1.vy = -p1.vy;
            p2.vx = -p2.vx;
            p2.vy = -p2.vy;
        }
    };
    return ParticleInteraction;
}());
exports.ParticleInteraction = ParticleInteraction;
