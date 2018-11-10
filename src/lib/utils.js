"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToRgb = function (hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
        : null;
};
exports.clamp = function (number, min, max) {
    return Math.min(Math.max(number, min), max);
};
exports.isInArray = function (value, array) {
    if (typeof array === 'string') {
        return array.toString().indexOf(value) > -1;
    }
    return array.indexOf(value) > -1;
};
exports.deepExtend = function (destination, source) {
    for (var property in source) {
        if (source[property] &&
            source[property].constructor &&
            source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            exports.deepExtend(destination[property], source[property]);
        }
        else {
            destination[property] = source[property];
        }
    }
    return destination;
};
exports.getColor = function (colorObject) {
    var color = {};
    if (typeof colorObject === 'object') {
        if (colorObject instanceof Array) {
            var selectedColor = colorObject[Math.floor(Math.random() * colorObject.length)];
            color.rgb = exports.hexToRgb(selectedColor);
        }
        else {
            var r = colorObject.r, g = colorObject.g, b = colorObject.b;
            if (r !== undefined && g !== undefined && b !== undefined) {
                color.rgb = { r: r, g: g, b: b };
            }
            else {
                var h = colorObject.h, s = colorObject.s, l = colorObject.l;
                if (h !== undefined && g !== undefined && b !== undefined) {
                    color.hsl = { h: h, s: s, l: l };
                }
            }
        }
    }
    else if (colorObject === 'random') {
        color.rgb = {
            r: Math.floor(Math.random() * 255) + 1,
            g: Math.floor(Math.random() * 255) + 1,
            b: Math.floor(Math.random() * 255) + 1
        };
    }
    else if (typeof colorObject === 'string') {
        color.rgb = exports.hexToRgb(colorObject);
    }
    return color;
};
exports.getDefaultParams = function () {
    return {
        particles: {
            number: {
                value: 100,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#FFF'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 5
                },
                image: {
                    src: '',
                    width: 100,
                    height: 100
                }
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#FFF',
                opacity: 0.6,
                width: 1,
                shadow: {
                    enable: false,
                    blur: 5,
                    color: 'lime'
                }
            },
            move: {
                enable: true,
                speed: 3,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: true,
                attract: {
                    enable: false,
                    rotateX: 3000,
                    rotateY: 3000
                }
            },
            array: []
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 200,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 200,
                    size: 80,
                    duration: 0.4
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            },
            mouse: {}
        },
        retina_detect: true
    };
};
loadImg = (params, tmp) => {
    var particles = params.particles;
    tmp.img_error = undefined;
    if (particles.shape.type === 'image' && particles.shape.image.src !== '') {
        if (tmp.img_type === 'svg') {
            var xhr_1 = new XMLHttpRequest();
            xhr_1.open('GET', particles.shape.image.src);
            xhr_1.onreadystatechange = function (data) {
                if (xhr_1.readyState === 4) {
                    if (xhr_1.status === 200) {
                        tmp.source_svg = data.currentTarget.response;
                        if (tmp.source_svg === undefined) {
                            var check = void 0;
                            tmp.checkAnimFrame = requestAnimationFrame(check);
                        }
                    }
                    else {
                        tmp.img_error = true;
                        throw 'Error : image not found';
                    }
                }
            };
            xhr_1.send();
        }
        else {
            var img_1 = new Image();
            img_1.addEventListener('load', function () {
                tmp.img_obj = img_1;
                cancelAnimationFrame(tmp.checkAnimFrame);
            });
            img_1.src = particles.shape.image.src;
        }
    }
    else {
        tmp.img_error = true;
        throw 'Error : no image.src';
    }
}
exports.loadImg = loadImg;
function createSvgImg(particle, tmp) {
    var svgXml = tmp.source_svg;
    var rgbHex = /#([0-9A-F]{3,6})/gi;
    var coloredSvgXml = svgXml.replace(rgbHex, function (m, r, g, b) {
        var color_value;
        if (particle.color.rgb) {
            var _a = particle.color.rgb, _r = _a._r, _g = _a._g, _b = _a._b;
            color_value = "rgba( " + _r + ", " + _g + ", " + _b + ", " + particle.opacity + " )";
        }
        else {
            var _c = particle.color.hsl, h = _c.h, s = _c.s, l = _c.l;
            color_value = "rgba( " + h + ", " + s + ", " + l + ", " + particle.opacity + " )";
        }
        return color_value;
    });
    var svg = new Blob([coloredSvgXml], {
        type: 'image/svg+xml;charset=utf-8'
    });
    var DOMURL = window.URL || window;
    var url = DOMURL.createObjectURL(svg);
    var img = new Image();
    img.addEventListener('load', function () {
        particle.img.obj = img;
        particle.img.loaded = true;
        DOMURL.revokeObjectURL(url);
        tmp.count_svg++;
    });
    img.src = url;
}
exports.createSvgImg = createSvgImg;
