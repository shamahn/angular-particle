"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var Particle = /** @class */ (function () {
    function Particle(_canvasParams, _params, _tmpParams, color, opacity, position) {
        this._canvasParams = _canvasParams;
        this._params = _params;
        this._tmpParams = _tmpParams;
        this._setupSize();
        this._setupPosition(position);
        this._setupColor(color);
        this._setupOpacity();
        this._setupAnimation();
    }
    Particle.prototype._setupSize = function () {
        this.radius =
            (this._params.particles.size.random ? Math.random() : 1) *
                this._params.particles.size.value;
        if (this._params.particles.size.anim.enable) {
            this.size_status = false;
            this.vs = this._params.particles.size.anim.speed / 100;
            if (!this._params.particles.size.anim.sync) {
                this.vs = this.vs * Math.random();
            }
        }
    };
    Particle.prototype._setupPosition = function (position) {
        this.x = position ? position.x : Math.random() * this._canvasParams.width;
        this.y = position ? position.y : Math.random() * this._canvasParams.height;
        if (this.x > this._canvasParams.width - this.radius * 2) {
            this.x = this.x - this.radius;
        }
        else if (this.x < this.radius * 2) {
            this.x = this.x + this.radius;
        }
        if (this.y > this._canvasParams.height - this.radius * 2) {
            this.y = this.y - this.radius;
        }
        else if (this.y < this.radius * 2) {
            this.y = this.y + this.radius;
        }
        if (this._params.particles.move.bounce) {
            this._checkOverlap(this, position);
        }
    };
    Particle.prototype._checkOverlap = function (p1, position) {
        var _this = this;
        var particles = this._params.particles;
        particles.array.forEach(function (particle) {
            var p2 = particle;
            var dx = p1.x - p2.x;
            var dy = p1.y - p2.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= p1.radius + p2.radius) {
                p1.x = position ? position.x : Math.random() * _this._canvasParams.width;
                p1.y = position
                    ? position.y
                    : Math.random() * _this._canvasParams.height;
                _this._checkOverlap(p1);
            }
        });
    };
    Particle.prototype._setupColor = function (color) {
        this.color = index_1.getColor(color.value);
    };
    Particle.prototype._setupOpacity = function () {
        this.opacity =
            (this._params.particles.opacity.random ? Math.random() : 1) *
                this._params.particles.opacity.value;
        if (this._params.particles.opacity.anim.enable) {
            this.opacity_status = false;
            this.vo = this._params.particles.opacity.anim.speed / 100;
            if (!this._params.particles.opacity.anim.sync) {
                this.vo = this.vo * Math.random();
            }
        }
    };
    Particle.prototype._setupAnimation = function () {
        var velbase = null;
        switch (this._params.particles.move.direction) {
            case 'top':
                velbase = { x: 0, y: -1 };
                break;
            case 'top-right':
                velbase = { x: 0.5, y: -0.5 };
                break;
            case 'right':
                velbase = { x: 1, y: 0 };
                break;
            case 'bottom-right':
                velbase = { x: 0.5, y: 0.5 };
                break;
            case 'bottom':
                velbase = { x: 0, y: 1 };
                break;
            case 'bottom-left':
                velbase = { x: -0.5, y: 1 };
                break;
            case 'left':
                velbase = { x: -1, y: 0 };
                break;
            case 'top-left':
                velbase = { x: -0.5, y: -0.5 };
                break;
            default:
                velbase = { x: 0, y: 0 };
                break;
        }
        if (this._params.particles.move.straight) {
            this.vx = velbase.x;
            this.vy = velbase.y;
            if (this._params.particles.move.random) {
                this.vx = this.vx * Math.random();
                this.vy = this.vy * Math.random();
            }
        }
        else {
            this.vx = velbase.x + Math.random() - 0.5;
            this.vy = velbase.y + Math.random() - 0.5;
        }
        this.vx_i = this.vx;
        this.vy_i = this.vy;
        var shape_type = this._params.particles.shape.type;
        if (typeof shape_type === 'object') {
            if (shape_type instanceof Array) {
                var shape_selected = shape_type[Math.floor(Math.random() * shape_type.length)];
                this.shape = shape_selected;
            }
        }
        else {
            this.shape = shape_type;
        }
        if (this.shape === 'image') {
            var sh = this._params.particles.shape;
            this.img = {
                src: sh.image.src,
                ratio: sh.image.width / sh.image.height
            };
            if (!this.img.ratio) {
                this.img.ratio = 1;
            }
            if (this._tmpParams.img_type === 'svg' && this._tmpParams.source_svg !== undefined) {
                index_1.createSvgImg(this, this._tmpParams);
                if (this._tmpParams.pushing) {
                    this.img.loaded = false;
                }
            }
        }
    };
    Particle.prototype._drawShape = function (c, startX, startY, sideLength, sideCountNumerator, sideCountDenominator) {
        var sideCount = sideCountNumerator * sideCountDenominator;
        var decimalSides = sideCountNumerator / sideCountDenominator;
        var interiorAngleDegrees = (180 * (decimalSides - 2)) / decimalSides;
        var interiorAngle = Math.PI - (Math.PI * interiorAngleDegrees) / 180;
        c.save();
        c.beginPath();
        c.translate(startX, startY);
        c.moveTo(0, 0);
        for (var i = 0; i < sideCount; i++) {
            c.lineTo(sideLength, 0);
            c.translate(sideLength, 0);
            c.rotate(interiorAngle);
        }
        c.fill();
        c.restore();
    };
    Particle.prototype.draw = function () {
        var _this = this;
        var particles = this._params.particles;
        var radius;
        if (this.radius_bubble !== undefined) {
            radius = this.radius_bubble;
        }
        else {
            radius = this.radius;
        }
        var opacity;
        if (this.opacity_bubble !== undefined) {
            opacity = this.opacity_bubble;
        }
        else {
            opacity = this.opacity;
        }
        var color_value;
        if (this.color.rgb) {
            var _a = this.color.rgb, r = _a.r, g = _a.g, b = _a.b;
            color_value = "rgba( " + r + ", " + g + ", " + b + ", " + opacity + " )";
        }
        else {
            var _b = this.color.hsl, h = _b.h, s = _b.s, l = _b.l;
            color_value = "hsla( " + h + ", " + s + ", " + l + ", " + opacity + " )";
        }
        this._canvasParams.ctx.fillStyle = color_value;
        this._canvasParams.ctx.beginPath();
        switch (this.shape) {
            case 'circle':
                this._canvasParams.ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, false);
                break;
            case 'edge':
                this._canvasParams.ctx.rect(this.x - radius, this.y - radius, radius * 2, radius * 2);
                break;
            case 'triangle':
                this._drawShape(this._canvasParams.ctx, this.x - radius, this.y + radius / 1.66, radius * 2, 3, 2);
                break;
            case 'polygon':
                this._drawShape(this._canvasParams.ctx, this.x -
                    radius / (this._params.particles.shape.polygon.nb_sides / 3.5), this.y - radius / (2.66 / 3.5), (radius * 2.66) / (this._params.particles.shape.polygon.nb_sides / 3), this._params.particles.shape.polygon.nb_sides, 1);
                break;
            case 'star':
                this._drawShape(this._canvasParams.ctx, this.x -
                    (radius * 2) / (this._params.particles.shape.polygon.nb_sides / 4), this.y - radius / ((2 * 2.66) / 3.5), (radius * 2 * 2.66) /
                    (this._params.particles.shape.polygon.nb_sides / 3), this._params.particles.shape.polygon.nb_sides, 2);
                break;
            case 'image':
                var draw = function (_img_obj) {
                    _this._canvasParams.ctx.drawImage(_img_obj, _this.x - radius, _this.y - radius, radius * 2, (radius * 2) / _this.img.ratio);
                };
                var img_obj = void 0;
                if (this._tmpParams.img_type === 'svg') {
                    img_obj = this.img.obj;
                }
                else {
                    img_obj = this._tmpParams.img_obj;
                }
                if (img_obj) {
                    draw(img_obj);
                }
                ;
                break;
        }
        this._canvasParams.ctx.closePath();
        if (this._params.particles.shape.stroke.width > 0) {
            this._canvasParams.ctx.strokeStyle = this._params.particles.shape.stroke.color;
            this._canvasParams.ctx.lineWidth = this._params.particles.shape.stroke.width;
            this._canvasParams.ctx.stroke();
        }
        this._canvasParams.ctx.fill();
    };
    return Particle;
}());
exports.Particle = Particle;
