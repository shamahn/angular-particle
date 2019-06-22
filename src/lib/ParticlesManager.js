"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var ParticlesManager = /** @class */ (function () {
    function ParticlesManager(_canvasParams, _params, _tmpParams) {
        this._canvasParams = _canvasParams;
        this._params = _params;
        this._tmpParams = _tmpParams;
        this._interaction = new index_1.ParticleInteraction();
    }
    ParticlesManager.prototype.particlesCreate = function () {
        var _a = this._params.particles, color = _a.color, opacity = _a.opacity;
        for (var i = 0; i < this._params.particles.number.value; i++) {
            this._params.particles.array.push(new index_1.Particle(this._canvasParams, this._params, this._tmpParams, color, opacity.value));
        }
    };
    ParticlesManager.prototype._particlesUpdate = function () {
        var _this = this;
        this._params.particles.array.forEach(function (particle, i) {
            if (_this._params.particles.move.enable) {
                var ms = _this._params.particles.move.speed / 2;
                particle.x += particle.vx * ms;
                particle.y += particle.vy * ms;
            }
            if (_this._params.particles.opacity.anim.enable) {
                if (particle.opacity_status === true) {
                    if (particle.opacity >= _this._params.particles.opacity.value) {
                        particle.opacity_status = false;
                    }
                    particle.opacity += particle.vo;
                }
                else {
                    if (particle.opacity <= _this._params.particles.opacity.anim.opacity_min) {
                        particle.opacity_status = true;
                    }
                    particle.opacity -= particle.vo;
                }
                if (particle.opacity < 0) {
                    particle.opacity = 0;
                }
            }
            if (_this._params.particles.size.anim.enable) {
                if (particle.size_status === true) {
                    if (particle.radius >= _this._params.particles.size.value) {
                        particle.size_status = false;
                    }
                    particle.radius += particle.vs;
                }
                else {
                    if (particle.radius <= _this._params.particles.size.anim.size_min) {
                        particle.size_status = true;
                    }
                    particle.radius -= particle.vs;
                }
                if (particle.radius < 0) {
                    particle.radius = 0;
                }
            }
            var new_pos;
            if (_this._params.particles.move.out_mode === 'bounce') {
                new_pos = {
                    x_left: particle.radius,
                    x_right: _this._canvasParams.width,
                    y_top: particle.radius,
                    y_bottom: _this._canvasParams.height
                };
            }
            else {
                new_pos = {
                    x_left: -particle.radius,
                    x_right: _this._canvasParams.width + particle.radius,
                    y_top: -particle.radius,
                    y_bottom: _this._canvasParams.height + particle.radius
                };
            }
            if (particle.x - particle.radius > _this._canvasParams.width) {
                particle.x = new_pos.x_left;
                particle.y = Math.random() * _this._canvasParams.height;
            }
            else if (particle.x + particle.radius < 0) {
                particle.x = new_pos.x_right;
                particle.y = Math.random() * _this._canvasParams.height;
            }
            if (particle.y - particle.radius > _this._canvasParams.height) {
                particle.y = new_pos.y_top;
                particle.x = Math.random() * _this._canvasParams.width;
            }
            else if (particle.y + particle.radius < 0) {
                particle.y = new_pos.y_bottom;
                particle.x = Math.random() * _this._canvasParams.width;
            }
            if (_this._params.particles.move.out_mode === 'bounce') {
                if (particle.x + particle.radius > _this._canvasParams.width) {
                    particle.vx = -particle.vx;
                }
                else if (particle.x - particle.radius < 0) {
                    particle.vx = -particle.vx;
                }
                if (particle.y + particle.radius > _this._canvasParams.height) {
                    particle.vy = -particle.vy;
                }
                else if (particle.y - particle.radius < 0) {
                    particle.vy = -particle.vy;
                }
            }
            if (index_1.isInArray('grab', _this._params.interactivity.events.onhover.mode)) {
                _this._grabParticle(particle);
            }
            if (index_1.isInArray('bubble', _this._params.interactivity.events.onhover.mode) ||
                index_1.isInArray('bubble', _this._params.interactivity.events.onclick.mode)) {
                _this._bubbleParticle(particle);
            }
            if (index_1.isInArray('repulse', _this._params.interactivity.events.onhover.mode) ||
                index_1.isInArray('repulse', _this._params.interactivity.events.onclick.mode)) {
                _this._repulseParticle(particle);
            }
            if (_this._params.particles.line_linked.enable ||
                _this._params.particles.move.attract.enable) {
                for (var j = i + 1; j < _this._params.particles.array.length; j++) {
                    var link = _this._params.particles.array[j];
                    if (_this._params.particles.line_linked.enable) {
                        _this._interaction.linkParticles(particle, link, _this._params, _this._canvasParams);
                    }
                    if (_this._params.particles.move.attract.enable) {
                        _this._interaction.attractParticles(particle, link, _this._params);
                    }
                    if (_this._params.particles.move.bounce) {
                        _this._interaction.bounceParticles(particle, link);
                    }
                }
            }
        });
    };
    ParticlesManager.prototype.particlesDraw = function () {
        this._canvasParams.ctx.clearRect(0, 0, this._canvasParams.width, this._canvasParams.height);
        this._particlesUpdate();
        this._params.particles.array.forEach(function (particle) {
            particle.draw();
        });
    };
    ParticlesManager.prototype.particlesEmpty = function () {
        this._params.particles.array = [];
    };
    ParticlesManager.prototype.removeParticles = function (nb) {
        this._params.particles.array.splice(0, nb);
        if (!this._params.particles.move.enable) {
            this.particlesDraw();
        }
    };
    ParticlesManager.prototype.pushParticles = function (nb, pos) {
        this._tmpParams.pushing = true;
        for (var i = 0; i < nb; i++) {
            this._params.particles.array.push(new index_1.Particle(this._canvasParams, this._params, this._tmpParams, this._params.particles.color, this._params.particles.opacity.value, {
                x: pos ? pos.pos_x : Math.random() * this._canvasParams.width,
                y: pos ? pos.pos_y : Math.random() * this._canvasParams.height
            }));
            if (i === nb - 1) {
                if (!this._params.particles.move.enable) {
                    this.particlesDraw();
                }
                this._tmpParams.pushing = false;
            }
        }
    };
    ParticlesManager.prototype._bubbleParticle = function (particle) {
        var _this = this;
        if (this._params.interactivity.events.onhover.enable &&
            index_1.isInArray('bubble', this._params.interactivity.events.onhover.mode)) {
            var dx_mouse = particle.x - this._params.interactivity.mouse.pos_x;
            var dy_mouse = particle.y - this._params.interactivity.mouse.pos_y;
            var dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);
            var ratio = 1 - dist_mouse / this._params.interactivity.modes.bubble.distance;
            var init = function () {
                particle.opacity_bubble = particle.opacity;
                particle.radius_bubble = particle.radius;
            };
            if (dist_mouse <= this._params.interactivity.modes.bubble.distance) {
                if (ratio >= 0 && this._params.interactivity.status === 'mousemove') {
                    if (this._params.interactivity.modes.bubble.size !==
                        this._params.particles.size.value) {
                        if (this._params.interactivity.modes.bubble.size >
                            this._params.particles.size.value) {
                            var size = particle.radius +
                                this._params.interactivity.modes.bubble.size * ratio;
                            if (size >= 0) {
                                particle.radius_bubble = size;
                            }
                        }
                        else {
                            var dif = particle.radius - this._params.interactivity.modes.bubble.size;
                            var size = particle.radius - dif * ratio;
                            if (size > 0) {
                                particle.radius_bubble = size;
                            }
                            else {
                                particle.radius_bubble = 0;
                            }
                        }
                    }
                    if (this._params.interactivity.modes.bubble.opacity !==
                        this._params.particles.opacity.value) {
                        if (this._params.interactivity.modes.bubble.opacity >
                            this._params.particles.opacity.value) {
                            var opacity = this._params.interactivity.modes.bubble.opacity * ratio;
                            if (opacity > particle.opacity &&
                                opacity <= this._params.interactivity.modes.bubble.opacity) {
                                particle.opacity_bubble = opacity;
                            }
                        }
                        else {
                            var opacity = particle.opacity -
                                (this._params.particles.opacity.value -
                                    this._params.interactivity.modes.bubble.opacity) *
                                    ratio;
                            if (opacity < particle.opacity &&
                                opacity >= this._params.interactivity.modes.bubble.opacity) {
                                particle.opacity_bubble = opacity;
                            }
                        }
                    }
                }
            }
            else {
                init();
            }
            if (this._params.interactivity.status === 'mouseleave') {
                init();
            }
        }
        else if (this._params.interactivity.events.onclick.enable &&
            index_1.isInArray('bubble', this._params.interactivity.events.onclick.mode)) {
            if (this._tmpParams.bubble_clicking) {
                var dx_mouse = particle.x - this._params.interactivity.mouse.click_pos_x;
                var dy_mouse = particle.y - this._params.interactivity.mouse.click_pos_y;
                var dist_mouse_1 = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);
                var time_spent_1 = (new Date().getTime() - this._params.interactivity.mouse.click_time) /
                    1000;
                if (time_spent_1 > this._params.interactivity.modes.bubble.duration) {
                    this._tmpParams.bubble_duration_end = true;
                }
                if (time_spent_1 > this._params.interactivity.modes.bubble.duration * 2) {
                    this._tmpParams.bubble_clicking = false;
                    this._tmpParams.bubble_duration_end = false;
                }
                var process = function (bubble_param, particles_param, p_obj_bubble, p_obj, id) {
                    if (bubble_param !== particles_param) {
                        if (!_this._tmpParams.bubble_duration_end) {
                            if (dist_mouse_1 <= _this._params.interactivity.modes.bubble.distance) {
                                var obj = void 0;
                                if (p_obj_bubble !== undefined) {
                                    obj = p_obj_bubble;
                                }
                                else {
                                    obj = p_obj;
                                }
                                if (obj !== bubble_param) {
                                    var value = p_obj -
                                        (time_spent_1 * (p_obj - bubble_param)) /
                                            _this._params.interactivity.modes.bubble.duration;
                                    if (id === 'size') {
                                        particle.radius_bubble = value;
                                    }
                                    if (id === 'opacity') {
                                        particle.opacity_bubble = value;
                                    }
                                }
                            }
                            else {
                                if (id === 'size') {
                                    particle.radius_bubble = undefined;
                                }
                                if (id === 'opacity') {
                                    particle.opacity_bubble = undefined;
                                }
                            }
                        }
                        else {
                            if (p_obj_bubble !== undefined) {
                                var value_tmp = p_obj -
                                    (time_spent_1 * (p_obj - bubble_param)) /
                                        _this._params.interactivity.modes.bubble.duration;
                                var dif = bubble_param - value_tmp;
                                var value = bubble_param + dif;
                                if (id === 'size') {
                                    particle.radius_bubble = value;
                                }
                                if (id === 'opacity') {
                                    particle.opacity_bubble = value;
                                }
                            }
                        }
                    }
                };
                if (this._tmpParams.bubble_clicking) {
                    process(this._params.interactivity.modes.bubble.size, this._params.particles.size.value, particle.radius_bubble, particle.radius, 'size');
                    process(this._params.interactivity.modes.bubble.opacity, this._params.particles.opacity.value, particle.opacity_bubble, particle.opacity, 'opacity');
                }
            }
        }
    };
    ParticlesManager.prototype._repulseParticle = function (particle) {
        var _this = this;
        if (this._params.interactivity.events.onhover.enable &&
            index_1.isInArray('repulse', this._params.interactivity.events.onhover.mode) &&
            this._params.interactivity.status === 'mousemove') {
            var dx_mouse = particle.x - this._params.interactivity.mouse.pos_x;
            var dy_mouse = particle.y - this._params.interactivity.mouse.pos_y;
            var dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);
            var normVec = { x: dx_mouse / dist_mouse, y: dy_mouse / dist_mouse };
            var repulseRadius = this._params.interactivity.modes.repulse
                .distance;
            var velocity = 100;
            var repulseFactor = index_1.clamp((1 / repulseRadius) *
                (-1 * Math.pow(dist_mouse / repulseRadius, 2) + 1) *
                repulseRadius *
                velocity, 0, 50);
            var pos = {
                x: particle.x + normVec.x * repulseFactor,
                y: particle.y + normVec.y * repulseFactor
            };
            if (this._params.particles.move.out_mode === 'bounce') {
                if (pos.x - particle.radius > 0 &&
                    pos.x + particle.radius < this._canvasParams.width) {
                    particle.x = pos.x;
                }
                if (pos.y - particle.radius > 0 &&
                    pos.y + particle.radius < this._canvasParams.height) {
                    particle.y = pos.y;
                }
            }
            else {
                particle.x = pos.x;
                particle.y = pos.y;
            }
        }
        else if (this._params.interactivity.events.onclick.enable &&
            index_1.isInArray('repulse', this._params.interactivity.events.onclick.mode)) {
            if (!this._tmpParams.repulse_finish) {
                this._tmpParams.repulse_count++;
                if (this._tmpParams.repulse_count === this._params.particles.array.length) {
                    this._tmpParams.repulse_finish = true;
                }
            }
            if (this._tmpParams.repulse_clicking) {
                var repulseRadius = Math.pow(this._params.interactivity.modes.repulse.distance / 6, 3);
                var dx_1 = this._params.interactivity.mouse.click_pos_x - particle.x;
                var dy_1 = this._params.interactivity.mouse.click_pos_y - particle.y;
                var d = dx_1 * dx_1 + dy_1 * dy_1;
                var force_1 = (-repulseRadius / d);
                var process = function () {
                    var f = Math.atan2(dy_1, dx_1);
                    particle.vx = force_1 * Math.cos(f);
                    particle.vy = force_1 * Math.sin(f);
                    if (_this._params.particles.move.out_mode === 'bounce') {
                        var pos = {
                            x: particle.x + particle.vx,
                            y: particle.y + particle.vy
                        };
                        if (pos.x + particle.radius > _this._canvasParams.width) {
                            particle.vx = -particle.vx;
                        }
                        else if (pos.x - particle.radius < 0) {
                            particle.vx = -particle.vx;
                        }
                        if (pos.y + particle.radius > _this._canvasParams.height) {
                            particle.vy = -particle.vy;
                        }
                        else if (pos.y - particle.radius < 0) {
                            particle.vy = -particle.vy;
                        }
                    }
                };
                if (d <= repulseRadius) {
                    process();
                }
            }
            else {
                if (this._tmpParams.repulse_clicking === false) {
                    particle.vx = particle.vx_i;
                    particle.vy = particle.vy_i;
                }
            }
        }
    };
    ParticlesManager.prototype._grabParticle = function (particle) {
        var _a = this._params, interactivity = _a.interactivity, particles = _a.particles;
        if (interactivity.events.onhover.enable &&
            interactivity.status === 'mousemove') {
            var dx_mouse = particle.x - interactivity.mouse.pos_x;
            var dy_mouse = particle.y - interactivity.mouse.pos_y;
            var dist_mouse = Math.sqrt(dx_mouse * dx_mouse + dy_mouse * dy_mouse);
            if (dist_mouse <= interactivity.modes.grab.distance) {
                var grab = interactivity.modes.grab;
                var opacity_line = grab.line_linked.opacity -
                    dist_mouse / (1 / grab.line_linked.opacity) / grab.distance;
                if (opacity_line > 0) {
                    var color_line = particles.line_linked.color_rgb_line;
                    var r = color_line.r, g = color_line.g, b = color_line.b;
                    this._canvasParams.ctx.strokeStyle = "rgba( " + r + ", " + g + ", " + b + ", " + opacity_line + " )";
                    this._canvasParams.ctx.lineWidth = particles.line_linked.width;
                    this._canvasParams.ctx.beginPath();
                    this._canvasParams.ctx.moveTo(particle.x, particle.y);
                    this._canvasParams.ctx.lineTo(interactivity.mouse.pos_x, interactivity.mouse.pos_y);
                    this._canvasParams.ctx.stroke();
                    this._canvasParams.ctx.closePath();
                }
            }
        }
    };
    return ParticlesManager;
}());
exports.ParticlesManager = ParticlesManager;
