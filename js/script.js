//Adds function to check if a string ends with a set of chars
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

//Adds a function on cnavas context to make it black
if (typeof CanvasRenderingContext2D.prototype.reset !== 'function') {
    CanvasRenderingContext2D.prototype.reset = function(suffix) {
        this.clearRect(0, 0, this.canvas.width, this.canvas.height);
        return this;
    };
}
if (typeof Array.prototype.diff !== 'function') {
    Array.prototype.diff = function(b, prop) {
        var bIds = {}
        b.forEach(function(obj) {
            bIds[obj[prop]] = obj;
        });

        return this.filter(function(i) {
            return !(i[prop] in bIds);
        });
    };
}
var Thesis = {};

Thesis.Settings = (function() {
    var debug = false;

    return {
        device: {
            phonegap: false,
            tizen: false,
            firefox: false,
            desktop: false,
        },

        isPhoneGap: function() {
            return this.device.phonegap;
        },

        isTizen: function() {
            return this.device.tizen;
        },

        isFireFox: function() {
            return this.device.firefox;
        },

        isDesktop: function() {
            return this.device.desktop;
        },

        isDebug: function() {
            return debug;
        },

        enableDebug: function() {
            debug = true;
        },

        disableDebug: function() {
            debug = false;
        }
    }
}(jQuery));

Thesis.Gallery = (function() {
    var s = null;
    var that = null;
    var currentZoom = 1.0;
    var lastDist = null;

    return {
        settings: {
            obj: null,
            moveLimit: 30,
            imageMargin: 1,
            headerHeight: 60,
            footerHeight: 60,
            maxWidth: 0,
            maxHeight: 0,
            min: 0,
            max: 20,
            step: 20,
            fileList: [],
            fullscreenImg: [],
            pictureDir: "",
            timers: [],
            windowWidth: 0,
            inFullscreenMode: false

        },
        listDirectory: function() {

        },

        init: function() {
            console.log("<-- Gallery init start -->");

            s = this.settings;
            that = this;
            Thesis.Messure.start("load-gallery");            

            s.windowWidth = $(window).width();
            s.footerHeight = $("#footer").height();
            s.headerHeight = $("#header").height();

            s.maxWidth = Math.floor(( $(document).innerWidth() / 3));
            
            if(Thesis.Settings.isDesktop()) {
                s.maxWidth = Math.floor(( $(document).innerWidth() / 3) - 15);
            }

            
            s.maxHeight = s.maxWidth * 0.8 - (s.imageMargin * 4);
            s.maxWidth -= (s.imageMargin * 4);

            if (Thesis.Settings.isPhoneGap()) {
                this.listDirectory = Thesis.PhoneGap.listDirectory;
                s.pictureDir = "DCIM/Camera";
            } else if (Thesis.Settings.isFireFox()) {
                this.listDirectory = Thesis.Firefox.listDirectory;
                s.pictureDir = "pictures";
            } else if (Thesis.Settings.isTizen()) {
                this.listDirectory = Thesis.Tizen.listDirectory;
                s.pictureDir = "images";
            }

            if (Thesis.Settings.isDesktop()) {
                var fileList = [{
                        name: "img1.jpg",
                        fullPath: "img/img1.jpg"
                    }, {
                        name: "img2.jpg",
                        fullPath: "img/img2.jpg"
                    }, {
                        name: "img3.jpg",
                        fullPath: "img/img3.jpg"
                    }, {
                        name: "img4.jpg",
                        fullPath: "img/img4.jpg"
                    }, {
                        name: "img1.jpg",
                        fullPath: "img/img1.jpg"
                    }, {
                        name: "img2.jpg",
                        fullPath: "img/img2.jpg"
                    }, {
                        name: "img3.jpg",
                        fullPath: "img/img3.jpg"
                    }, {
                        name: "img4.jpg",
                        fullPath: "img/img4.jpg"
                    }, {
                        name: "img1.jpg",
                        fullPath: "img/img1.jpg"
                    }, {
                        name: "img1.jpg",
                        fullPath: "img/img1.jpg"
                    }, {
                        name: "img2.jpg",
                        fullPath: "img/img2.jpg"
                    }, {
                        name: "img3.jpg",
                        fullPath: "img/img3.jpg"
                    }, {
                        name: "img4.jpg",
                        fullPath: "img/img4.jpg"
                    }, {
                        name: "img1.jpg",
                        fullPath: "img/img1.jpg"
                    }, {
                        name: "img2.jpg",
                        fullPath: "img/img2.jpg"
                    }, {
                        name: "img3.jpg",
                        fullPath: "img/img3.jpg"
                    }, {
                        name: "img4.jpg",
                        fullPath: "img/img4.jpg"
                    }, {
                        name: "img1.jpg",
                        fullPath: "img/img1.jpg"
                    }, {
                        name: "img2.jpg",
                        fullPath: "img/img2.jpg"
                    }, {
                        name: "img3.jpg",
                        fullPath: "img/img3.jpg"
                    }, {
                        name: "img4.jpg",
                        fullPath: "img/img4.jpg"
                    }, {
                        name: "img1.jpg",
                        fullPath: "img/img1.jpg"
                    }, {
                        name: "img2.jpg",
                        fullPath: "img/img2.jpg"
                    }, {
                        name: "img3.jpg",
                        fullPath: "img/img3.jpg"
                    }, {
                        name: "img4.jpg",
                        fullPath: "img/img4.jpg"
                    }, {
                        name: "img1.jpg",
                        fullPath: "img/img1.jpg"
                    },
                ];
                this.bindUIActions(fileList);
                this.loadGallery(fileList, s.step);
            } else {
                var printDirPath = function(fileList) {
                    Thesis.Gallery.bindUIActions(fileList);
                    Thesis.Gallery.loadGallery(fileList, s.step);
                };

                var galleryRefresh = function(fileList) {
                    if (!that.inFullscreenMode) {
                        return;
                    }
                    var preLength = s.fileList.length;

                    console.log("Refresh: " + fileList.length + " - " + s.fileList.length);

                    var diffArr = fileList.diff(s.fileList, 'name');
                    console.log(diffArr.length);
                    if (diffArr.length > 0) {
                        console.log((fileList.length - s.fileList.length - 1));
                        for (var i = diffArr.length - 1; i >= 0; i--) {
                            console.log(diffArr[i].name);
                            s.fileList.unshift(diffArr[i]);
                        }

                        var tmpMin = s.min;
                        var tmpMax = s.max;
                        s.min = 0;
                        s.max = diffArr.length;
                        console.log(s.max);
                        Thesis.Gallery.loadGallery(fileList, 0, true);
                        s.min = tmpMin;
                        s.max = tmpMax;
                    }
                };

                this.listDirectory(s.pictureDir, "jpg", printDirPath);
                var refresh = setInterval(function() {
                    that.listDirectory(s.pictureDir, "jpg", galleryRefresh);
                }, 10000);
            }
        },

        touchEvents: (function () {
            var draggable = null;
            var start = {
                   X: 0,
                   Y: 0
                };
            var move = {
                    X: 0,
                    Y: 0
                };
            var zoomed = false;
            var tracks = [];
            var multiTouch = false;
            var startDist = 0;

            var pinchScale = 1;
            var lastScale = 1;
            var maxScale = 3.0;
            var minScale = 1.0;

            return {
                //Public variables
                prevPicObj: null,
                currentPicObj: null,
                nextPicObj: null,
                lastScale: 1,

                touchStart: function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    //this gets poluted somhow and cant be used.
                    var touch = Thesis.Gallery.touchEvents;
                    var pageX = event.pageX || event.originalEvent.touches[0].pageX || event.originalEvent.changedTouches[0].pageX;
                    var pageY = event.pageY || event.originalEvent.touches[0].pageY || event.originalEvent.changedTouches[0].pageY;

                    //If right click do nothing.
                    if (event.button === 2) {
                        return false;
                    }

                    if (event.type == 'touchstart' && event.originalEvent.touches.length === 2) {  
                        var canvas = touch.currentPicObj.find("canvas")[0];
                        var imageObj = s.fullscreenImg[canvas.id];
                                  
                        //Dont zoom further than the image width             
                        if($(window).width() > imageObj.imageData.width*imageObj.ratio*touch.lastScale) {
                            touch.lastScale = 1;
                            zoomed = false;
                            return;
                        }

                        startDist =
                        Math.sqrt(
                            Math.pow((event.originalEvent.touches[1].pageX - event.originalEvent.touches[0].pageX),2)
                            +
                            Math.pow((event.originalEvent.touches[1].pageY - event.originalEvent.touches[0].pageY),2)
                        );
                        var scale = touch.lastScale; 
                        that.scaleCanvas(canvas, imageObj, scale);
                        zoomed = true;                        
                    } else {       
                        move = {
                            X: 0,
                            Y: 0
                        };
                        start = {
                            X: pageX,
                            Y: pageY
                        };

                        draggable = $(event.currentTarget);
                        touch.currentPicObj = $(event.currentTarget);
                        
                        touch.nextPicObj.show();
                        touch.prevPicObj.show();
                    }
                },

                touchMove: function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    var touch = Thesis.Gallery.touchEvents;
                    //PageX is located differently depending of what event. 
                    var pageX = event.pageX || event.originalEvent.touches[0].pageX || event.originalEvent.changedTouches[0].pageX;
                    var pageY = event.pageY || event.originalEvent.touches[0].pageY || event.originalEvent.changedTouches[0].pageY;

                    //Multi touch i.e. 2 touch points
                    if (event.type == 'touchmove' && event.originalEvent.touches.length === 2) {
                        multiTouch = true;
                        var canvas = touch.currentPicObj.find("canvas")[0];
                        var imageObj = s.fullscreenImg[canvas.id];

                        var dist =
                        Math.sqrt(
                            Math.pow((event.originalEvent.touches[1].pageX - event.originalEvent.touches[0].pageX),2)
                            +
                            Math.pow((event.originalEvent.touches[1].pageY - event.originalEvent.touches[0].pageY),2)
                        );
                        pinchScale = dist/startDist;                    
                        
                        if($(window).width() > imageObj.imageData.width*imageObj.ratio*touch.lastScale*pinchScale) {
                            touch.lastScale = 1;
                            zoomed = false;
                            return;
                        }
                        
                        var scale = touch.lastScale*pinchScale;                        
                        that.scaleCanvas(canvas, imageObj, scale);
                    } /* This is a start of implementing Panning while zoomed.  
                        else if(zoomed) {
                        move.X = pageX - start.X;
                        move.Y = pageY - start.Y;
                        draggable.offset({
                            top: move.Y,
                            left: move.X
                        });
                    }*/ else {                         
                        move.X = pageX - start.X;

                        if (Math.abs(move.X) > s.moveLimit && draggable && !multiTouch) {
                            draggable.offset({
                                left: move.X
                            });

                            touch.nextPicObj.offset({
                                left: move.X + s.windowWidth
                            });

                            touch.prevPicObj.offset({
                                left: move.X - s.windowWidth
                            });
                        }
                    }
                },

                touchEnd: function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    var touch = Thesis.Gallery.touchEvents;
                    
                    if (multiTouch) {
                        multiTouch = false
                        touch.lastScale = pinchScale;
                    } else {
                        if (touch.currentPicObj != null) {
                            var center = s.windowWidth / 2;
                            var offLeft = touch.currentPicObj.offset().left;
                            var offRight = touch.currentPicObj.offset().left + touch.currentPicObj.width();
                            var currentImageIndex = parseInt(touch.currentPicObj.find("canvas")[0].getAttribute("data-id"),10);

                            if (offRight < center && offLeft < 0) {
                                //slide out left
                                if (s.fileList.length > currentImageIndex + 1) {
                                    touch.currentPicObj.animate({
                                        "left": -touch.currentPicObj.width()
                                    }, "fast");
                                    touch.nextPicObj.animate({
                                        "left": 0
                                    }, "fast");

                                    tmp = touch.currentPicObj;
                                    touch.currentPicObj = touch.nextPicObj;
                                    touch.nextPicObj = touch.prevPicObj;
                                    touch.prevPicObj = tmp;

                                    tmp = null;

                                    var imageIndexLeft = parseInt(touch.currentPicObj.find("canvas")[0].getAttribute("data-id"),10);
                                    var trgCanvasLeft = touch.nextPicObj.find("canvas")[0];

                                    if (s.fileList.length > imageIndexLeft + 1) {
                                        that.loadPicture(trgCanvasLeft, imageIndexLeft + 1);
                                    } else {
                                        //No more images. Clear the next obj.                              
                                        touch.nextPicObj.find("canvas")[0].getContext("2d").reset();
                                    }
                                } else {
                                    touch.currentPicObj.animate({
                                        "left": 0
                                    }, "fast");
                                    touch.nextPicObj.animate({
                                        "left": s.windowWidth
                                    }, "fast");
                                }
                            } else if (offLeft > center && offRight > s.windowWidth) {
                                //slide out right                            
                                if (currentImageIndex - 1 >= 0) {
                                    touch.currentPicObj.animate({
                                        "left": s.windowWidth
                                    }, "fast");
                                    touch.prevPicObj.animate({
                                        "left": 0
                                    }, "fast");

                                    tmp = touch.currentPicObj;
                                    touch.currentPicObj = touch.prevPicObj;
                                    touch.prevPicObj = touch.nextPicObj;
                                    touch.nextPicObj = tmp;

                                    tmp = null;

                                    var imageIndexRight = parseInt(touch.currentPicObj.find("canvas")[0].getAttribute("data-id"),10);
                                    var trgCanvasRight = touch.prevPicObj.find("canvas")[0];

                                    if (imageIndexRight - 1 >= 0) {
                                        that.loadPicture(trgCanvasRight, imageIndexRight - 1);
                                    } else {
                                        //No more images. Clear the previouthat.
                                        touch.prevPicObj.find("canvas")[0].getContext("2d").reset();
                                    }
                                } else {
                                    touch.currentPicObj.animate({
                                        "left": 0
                                    }, "fast");
                                    touch.prevPicObj.animate({
                                        "left": -s.windowWidth
                                    }, "fast");
                                }

                            } else if (offLeft < center && offRight > s.windowWidth) {
                                //slide back from right
                                touch.currentPicObj.animate({
                                    "left": 0
                                }, "fast");
                                touch.prevPicObj.animate({
                                    "left": -s.windowWidth
                                }, "fast");
                            } else if (offLeft < 0 && offRight > center) {
                                //slide back from left
                                touch.currentPicObj.animate({
                                    "left": 0
                                }, "fast");
                                touch.nextPicObj.animate({
                                    "left": s.windowWidth
                                }, "fast");
                            }
                        }
                        draggable = null;
                    }
                },

                transform: function (argument) {
                    
                }
            }
        })(),

        bindUIActions: function(images) {
            if (s.fileList.length == 0) {
                s.fileList = images;
            }

            $(window).scroll(function() {
                var g = Thesis.Gallery;
                if ($(window).scrollTop() == $(document).height() - $(window).height()) {
                    g.loadGallery(g.settings.fileList, g.settings.step);

                }
            });
            
            var fullscreenContainers = $("#fullscreen-image-container-prev, #fullscreen-image-container-current, #fullscreen-image-container-next");
            fullscreenContainers.bind("vmousedown touchstart", that.touchEvents.touchStart);
            fullscreenContainers.bind("vmouseup touchend", that.touchEvents.touchEnd);
            fullscreenContainers.bind("vmousemove touchmove", that.touchEvents.touchMove);

            $("#rotate-left").on("click", function(event) {
                console.log("Rotate left.");
                var canvas = that.touchEvents.currentPicObj.find("canvas")[0];
                var imageObj = s.fullscreenImg[canvas.id];

                that.rotateCanvas(canvas, imageObj, s.fullscreenImg[canvas.id].angle -= 30);
            });

            $("#rotate-right").on("click", function(event) {
                console.log("Rotate right.");
                var canvas = that.touchEvents.currentPicObj.find("canvas")[0];
                var imageObj = s.fullscreenImg[canvas.id];

                that.rotateCanvas(canvas, imageObj, s.fullscreenImg[canvas.id].angle += 30);
            });

            $("#invert").on("click", function(event) {
                console.log("Invert.");
                var canvas = that.touchEvents.currentPicObj.find("canvas")[0];
                var imageObj = s.fullscreenImg[canvas.id];

                that.invertCanvas(canvas, imageObj);                
            });

            $("#content").on("click", "canvas", function(event) {
                var srcCanvas1 = $(this)[0];
                var currentCanvas = document.getElementById("fullscreen-img");
                var nextCanvas = document.getElementById("fullscreen-img2");
                var prevCanvas = document.getElementById("fullscreen-img3");
                var imageIndex = parseInt(srcCanvas1.getAttribute("data-id"),10);

                that.touchEvents.lastScale = 1;

                currentCanvas.getContext("2d").reset();
                that.touchEvents.currentPicObj = that.resetFullscreenImageContainer(currentCanvas, 0);

                nextCanvas.getContext("2d").reset();
                that.touchEvents.nextPicObj = that.resetFullscreenImageContainer(nextCanvas, s.windowWidth);

                prevCanvas.getContext("2d").reset();
                that.touchEvents.prevPicObj = that.resetFullscreenImageContainer(prevCanvas, -s.windowWidth);

                //Load next image
                if (imageIndex + 1 <= s.fileList.length - 1) {
                    that.loadPicture(nextCanvas, (imageIndex + 1));
                }

                //Load previous image
                if (imageIndex - 1 >= 0) {
                    that.loadPicture(prevCanvas, (imageIndex - 1));
                }

                that.loadPicture(currentCanvas, imageIndex, Thesis.Messure);

                $("#fullscreen").show();
                $("#footer").offset({
                    bottom: 0
                });
                $("#footer").css("position", "fixed");
                $("#footer").show();

                s.inFullscreenMode = true;
                if(Thesis.Settings.isFireFox()) {
                    $("#backbutton").show();
                }
            });
        },
        
        closeFullscreenView: function() {
            $("#fullscreen").hide();
            $("#footer").hide();
        },

        resetFullscreenImageContainer: function(canvas, pos) {
            var imageContainer = $(canvas).parent();
            imageContainer.offset({
                left: pos
            });

            imageContainer.css("position", "fixed");
            return imageContainer;
        },

        loadPicture: function(trgCanvas, imageIndex, callback) {
            if (callback) {
                //Load and draw image - timer start
                callback.start("load-image-" + s.fileList[imageIndex].name);
            }

            s.fullscreenImg[trgCanvas.id] = {
                fullPath: null,
                imageData: null,
                angle: 0,
                maxWidth: 0,
                maxHeight: 0,
                width: 0,
                height: 0
            };

            trgCanvas.setAttribute("data-id", imageIndex);
            trgCanvas.setAttribute("style", "margin-top:" + s.headerHeight + "px");


            var ctx = trgCanvas.getContext("2d");
            var pixelRatio = window.devicePixelRatio;
            ctx.scale(pixelRatio, pixelRatio);

            var image = new Image();

            image.onload = function() {
                var maxWidth = $(window).width();
                var maxHeight = $(window).height() - s.footerHeight - s.headerHeight;
                var ratio = 1;

                ratio = that.getRatio(image);
                var sourceWidth = image.width * ratio;
                var sourceHeight = image.height * ratio;

                trgCanvas.width = maxWidth;
                trgCanvas.height = maxHeight;

                s.fullscreenImg[trgCanvas.id].rotation = Math.PI / 180;
                s.fullscreenImg[trgCanvas.id].ratio = ratio;
                s.fullscreenImg[trgCanvas.id].scale = 1;
                s.fullscreenImg[trgCanvas.id].maxWidth = maxWidth;
                s.fullscreenImg[trgCanvas.id].maxHeight = maxHeight;
                s.fullscreenImg[trgCanvas.id].width = sourceWidth;
                s.fullscreenImg[trgCanvas.id].height = sourceHeight;

                ctx.save();
                ctx.translate(trgCanvas.width / 2, trgCanvas.height / 2);
                //ctx.translate(image.width / 2, image.height / 2);
                ctx.scale(ratio,ratio);
                ctx.drawImage(image, -image.width / 2, -image.height / 2);
                ctx.restore();
                if (callback) {
                    //Load and draw image - timer start
                    callback.stop("load-image-" + s.fileList[imageIndex].name);
                }
            };

            image.src = s.fileList[imageIndex].fullPath;
            s.fullscreenImg[trgCanvas.id].imageData = image;
        },

        getRatio: function (image) {
            var maxWidth = $(window).width();
            var maxHeight = $(window).height() - s.footerHeight - s.headerHeight;    
            var ratio = maxWidth / image.width;
            var sourceHeight = image.height * ratio;

            if (image.height > image.width) {
                ratio = maxHeight / image.height;
            } else if (sourceHeight > maxHeight) {
                ratio = maxHeight / image.height;
            }

            return ratio;
        },

        scaleCanvas: function (canvas, imageObj, scale) {
            var ctx = canvas.getContext("2d").reset();
            var ratio = that.getRatio(imageObj.imageData);

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);                        
            ctx.rotate(imageObj.rotation);                        
            ctx.scale(scale*ratio, scale*ratio);
            ctx.drawImage(imageObj.imageData, -imageObj.imageData.width / 2, -imageObj.imageData.height / 2);
            ctx.restore();

            //Save the scale
            imageObj.scale = scale;
        },

        rotateCanvas: function(canvas, imageObj, degrees) {
            Thesis.Messure.start("rotate-image-" + imageObj.name);
            var ctx = canvas.getContext("2d").reset();
            var ratio = that.getRatio(imageObj.imageData);
            var rotation = degrees * Math.PI / 180;            
            var scale = imageObj.scale;

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(rotation);
            ctx.scale(scale*ratio,scale*ratio);       
            ctx.drawImage(imageObj.imageData, -imageObj.imageData.width / 2, -imageObj.imageData.height / 2);
            ctx.restore();

            //Save the rotation
            imageObj.rotation = rotation;
            Thesis.Messure.stop("rotate-image-" + imageObj.name);
        },

        invertCanvas: function(canvas, imageObj) {
            Thesis.Messure.start("invert-image-" + imageObj.name);
            var ctx = canvas.getContext("2d");
            var ratio = that.getRatio(imageObj.imageData);
            var rotation = imageObj.rotation;
            var scale = imageObj.scale;

            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate(rotation);
            ctx.scale(scale*ratio,scale*ratio)         
            var imgData = ctx.getImageData((canvas.width / 2) - ((imageObj.width - 1) / 2), (canvas.height / 2) - (imageObj.height / 2), imageObj.width, imageObj.height);
            // invert colors
            for (var i = 0; i < imgData.data.length; i += 4) {
                imgData.data[i] = 255 - imgData.data[i];
                imgData.data[i + 1] = 255 - imgData.data[i + 1];
                imgData.data[i + 2] = 255 - imgData.data[i + 2];
                imgData.data[i + 3] = 255;
            }
            ctx.putImageData(imgData, (canvas.width / 2) - ((imageObj.width - 1) / 2), (canvas.height / 2) - (imageObj.height / 2));
            ctx.restore();
            Thesis.Messure.stop("invert-image-" + imageObj.name);
        },

        loadGallery: function(images, step, insertOnTop) {
            var canvas = [];
            var ctx = [];
            var imageObj = [];
            var min = s.min;
            var max = s.max;
            var total = 0;

            if (s.fileList.length == 0) {
                s.fileList = images;
            }
        
            if (images.length < min) {
                return;
            }            
            
            for (var i = min; i < images.length && i < max; i++) {
                canvas[i] = document.createElement("canvas");
                canvas[i].className = "thumb";
                canvas[i].setAttribute("data-id", i);

                ctx[i] = canvas[i].getContext("2d");

                imageObj[i] = new Image();

                imageObj[i].onload = (function(n) {
                    return function() {
                        canvas[n].width = s.maxWidth;
                        canvas[n].height = s.maxHeight;

                        var sourceX = 0;
                        var sourceY = 0;
                        var destX = 0;
                        var destY = 0;
                        
                        var stretchRatio = (imageObj[n].height / canvas[n].height);
                        var sourceWidth = Math.floor(canvas[n].width * stretchRatio);
                        var sourceHeight = Math.floor(imageObj[n].height);
                        
                        // http://zsprawl.com/iOS/2012/03/cropping-scaling-images-with-canvas-html5/
                        if (imageObj[n].height > imageObj[n].width) {                                
                            stretchRatio = (imageObj[n].width / canvas[n].width);
                            sourceWidth = Math.floor(imageObj[n].width);
                            sourceHeight = Math.floor(canvas[n].height * stretchRatio);                                
                        }
                        var destWidth = Math.floor(canvas[n].width);
                        var destHeight = Math.floor(canvas[n].height);
                        
                       /* console.log("id: " + n + " : " + sourceX + " : " + sourceY + " : " + sourceWidth + " : " + sourceHeight
                                + " : " + destX + " : " + destY
                                + " : " + destWidth + " : " + destHeight
                            );*/

                        ctx[n].drawImage(imageObj[n], sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
                        total++;

                        //Need to wait untill al images have been loaded before stopping the
                        if(total == max && !insertOnTop) {
                            Thesis.Messure.stop("load-gallery");
                        }
                    }
                }(i));
                imageObj[i].src = images[i].fullPath;

                if (insertOnTop) {
                    var parentElement = document.getElementById('content');
                    var theFirstChild = parentElement.firstChild;
                    parentElement.insertBefore(canvas[i], theFirstChild);
                    console.log(parentElement);
                } else {
                    document.getElementById('content').appendChild(canvas[i]);
                }
            }
        

            s.min = s.max;
            s.max += step;
            
        },
        LeakMemory: function() {
            for (var i = 0; i < 5000; i++) {
                var parentDiv = document.createElement("div");
                parentDiv.onclick = function() {
                    foo();
                }
            }
        }
    }
}(jQuery));

Thesis.PhoneGap = (function() {
    var rootDir = null;
    var that = null;
    var s;

    return {
        settings: {

        },

        init: function() {
            console.log("<-- PhoneGap init start -->");
            Thesis.Settings.device.phonegap = true;

            s = this.settings;
            that = this;
            console.log("Load filesystem init");
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.onFileSystemSuccess, this.fail);

            document.addEventListener("backbutton", function(e){
                if (Thesis.Gallery.settings.inFullscreenMode) {
                    Thesis.Gallery.closeFullscreenView();
                } else {
                    navigator.app.exitApp();
                }
            }, false);

            Thesis.Gallery.init();
        },

        listDirectory: function(path, suffix, callback) {
            if (rootDir === null) {
                console.log("Error! fileSystem not initiated! run init() first!");
                return;
            }

            var dirs = path.split("/").reverse();
            var root = rootDir;

            var getDir = function(dir) {
                root.getDirectory(dir, {
                    create: false,
                    exclusive: false
                }, successGet, failGet);
            };

            var successGet = function(entry) {
                root = entry;
                if (dirs.length > 0) {
                    getDir(dirs.pop());
                } else {
                    var directoryReader = root.createReader();
                    directoryReader.readEntries(successList, failList);
                }
            };

            var failGet = function() {
                console.log("failed to get dir " + dir);
            };

            var successList = function(entries) {
                var i;
                var dirs = [];

                for (i = entries.length - 1; i >= 0; i--) {
                    if (entries[i].name.endsWith(suffix)) {
                        var dir = {
                            name: entries[i].name,
                            fullPath: entries[i].fullPath
                        }

                        dirs.push(dir);
                    }
                }
                callback(dirs);
            }

            var failList = function(error) {
                alert("Failed to list directory contents: " + error.code);
            }

            getDir(dirs.pop());
        },

        onFileSystemSuccess: function(fileSystem) {
            var g = Thesis.PhoneGap;
            rootDir = fileSystem.root;
        },

        fail: function(evt) {
            console.log(evt.target.error.code);
        }

    }
}(jQuery));

Thesis.Firefox = (function() {
    var s;
    var context;

    return {
        settings: {
            gManifestName: location.protocol + "//" + location.host + location.pathname + "manifest.webapp",
            x: 100,
            y: 200,
            dx: 5,
            dy: 5
        },

        init: function() {
            Thesis.Settings.device.firefox = true;

            s = this.settings;
            this.bindUIActions();
            
            var request = navigator.mozApps.getSelf();

            request.onsuccess = function() {
                if (request.result) {
                    // we're installed
                    $("#install_button").text("INSTALLED!").show();
                    $("#install-button-container").hide();
                    Thesis.Gallery.init();
                } else {
                    // not installed
                    $("#install_button").show();
                    context = document.getElementById('bouncing-ball').getContext('2d');
                    setInterval(Thesis.Firefox.drawBall, 10);
                }
            }

            $("#backbutton").hide();
            console.log("<-- Firefox init done -->");
        },

        bindUIActions: function() {
            $("#install_button").click(function() {
                console.log(s.gManifestName);
                var req = navigator.mozApps.install(s.gManifestName);

                req.onsuccess = function() {
                    $("#install_button").text("INSTALLED!").unbind('click');
                };

                req.onerror = function(errObj) {
                    alert("Couldn't install (" + errObj.code + ") " + errObj.message);
                }
            });

            $("#backbutton").click(function() {
                if (Thesis.Gallery.settings.inFullscreenMode) {
                    Thesis.Gallery.closeFullscreenView();
                }
                $(this).hide();
            });
        },

        listDirectory: function(path, suffix, callback) {
            var pics = navigator.getDeviceStorage(path);
            var dirs = [];
            if(pics == null) {
                callback(dirs);
                Thesis.Settings.device.firefox = false;
                Thesis.Settings.device.desktop = true;
                return;                
            }

            var cursor = pics.enumerate();            
            var allowedFileTypes = ["image/png", "image/jpeg", "image/gif"];
            var state;

            cursor.onsuccess = function() {
                var file = this.result;
                if (!file) {
                    callback(dirs);
                } else {
                    if (allowedFileTypes.indexOf(file.type) > -1) {
                        var dir = {
                            name: file.name,
                            fullPath: window.URL.createObjectURL(file)
                        }

                        dirs.push(dir);
                    }
                    this.
                    continue ();
                }
            };

            cursor.onerror = function() {
                console.warn("No file found: " + this.error);
            }
        },

        drawBall: function() {
            context.clearRect(0, 0, 300, 300);
            context.beginPath();
            context.fillStyle = "#0000ff";
            // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
            context.arc(s.x, s.y, 20, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();

            if (s.x < 20 || s.x > 280) s.dx = -s.dx;
            if (s.y < 20 || s.y > 280) s.dy = -s.dy;
            s.x += s.dx;
            s.y += s.dy;
        }
    }
}(jQuery));

Thesis.Tizen = (function() {
    var s;
    var context;

    return {
        settings: {

        },

        init: function() {
            console.log("<-- Tizen init start -->");
            Thesis.Settings.device.tizen = true;

            s = this.settings;

            // add eventListener for tizenhwkey
            document.addEventListener('tizenhwkey', function(e) {
                if (e.keyName == "back") {
                    console.log("Back pressed");
                    if (Thesis.Gallery.settings.inFullscreenMode) {
                        Thesis.Gallery.closeFullscreenView();
                    } else {
                        tizen.application.getCurrentApplication().exit();
                    }
                }
            });

            this.bindUIActions();
            Thesis.Gallery.init();
        },

        bindUIActions: function() {

        },

        listDirectory: function(path, suffix, callback) {
            var documentsDir;
            var dirs = [];
            var onsuccess = function(files) {
                for (var i = 0; i < files.length; i++) {                    
                    console.log(files[i].fullPath);
                    var dir = {
                        name: files[i].name,
                        fullPath: files[i].toURI()
                    }

                    dirs.push(dir);
                }

                callback(dirs);
            };

            var onerror = function(error) {
                console.log("The error " + error.message + " occurred when listing the files in the selected folder");
            };

            tizen.filesystem.resolve(
                path, function(dir) {
                documentsDir = dir;
                dir.listFiles(onsuccess, onerror);
            }, function(e) {
                console.log("Error" + e.message);
            }, "r");

            /* Detta listar bilder från kameran.
               gManager.find(onFindSuccess, onFindError,
                "7bbfe1cb-79dc-4477-b76c-086add396af1" ,
                mediaType == "ALL" ? null : new tizen.AttributeFilter("type", "EXACTLY", "IMAGE"),
                new tizen.SortMode("title", "ASC"));
             */
        },
    }
}(jQuery));

Thesis.Messure = (function() {
    var s = null;
    return {
        settings: {
            clocks: [],
            enabled: true
        },

        init: function() {
            s = this.settings;
        },

        start: function(name) {
            if (!s.enabled) {
                return;
            }

            if (s.clocks[name] === undefined) {
                s.clocks[name] = {
                    name: name,
                    timeStart: 0,
                    timeEnd: 0,
                    result: 0
                }
            }
            if (s.clocks[name].timeStart === 0) {
                s.clocks[name].timeStart = new Date().getTime();
                if (Thesis.Settings.isDebug()) {
                    console.log("Messure clock: '" + name + "' started at " + s.clocks[name].timeStart);
                }
            }
        },

        stop: function(name) {
            if (!s.enabled) {
                return;
            }

            if (s.clocks[name] === undefined) {
                console.log("Messure error: Could not find any clock with the name '" + name + "'");
            } else {
                s.clocks[name].timeEnd = new Date().getTime();
                var time = s.clocks[name].timeEnd - s.clocks[name].timeStart;
                console.log(name + ": " + time + "ms");
                s.clocks[name].result = time;
                s.clocks[name].timeStart = 0;
                if (Thesis.Settings.isDebug()) {
                    console.log("Messure clock: '" + name + "' stopped at " + s.clocks[name].timeEnd);
                }
            }
        },

        list: function() {
            console.log("Messure list");
            for (var clock in s.clocks) {
                console.log(clock.name + ": " + clock.result + "ms");
            }
        },

        dump: function() {
            //Eventually this one can be used to dump the result in a textfile on the sdcard.
        }
    }
}(jQuery));

$(document).bind('pageinit', function() {

});

//Init brower and phonegap
$(function() {
    //Init the messure moduel
    Thesis.Messure.init();

    if (navigator.userAgent.match(/(Firefox)/)) {
        Thesis.Firefox.init();
    } else if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        document.addEventListener("deviceready", function() {
            Thesis.PhoneGap.init();            
        }, false);
    } else if (navigator.userAgent.match(/(Tizen)/)) {
        Thesis.Tizen.init();
    } else {
        Thesis.Settings.device.desktop = true;
        Thesis.Gallery.init();
    }
});