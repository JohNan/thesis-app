//Adds function to check if a string ends with a set of chars
if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

//Adds a function on cnavas context to make it black
if (typeof CanvasRenderingContext2D.prototype.reset !== 'function') {
    CanvasRenderingContext2D.prototype.reset = function(suffix) {
        this.clearRect(0,0,this.canvas.width,this.canvas.height);
        return this;
    };
}
if (typeof Array.prototype.diff !== 'function') {
    Array.prototype.diff = function(b,prop) {
        var bIds = {}
        b.forEach(function(obj){
            bIds[obj[prop]] = obj;
        });

        return this.filter(function(i) {
            return !(i[prop] in bIds);
        });
    };
}
var Thesis = {};

Thesis.Settings = (function () {
    return {
        device: {
            phonegap: false,
            tizen: false,
            firefox: false,
            desktop: false,
        },

        isPhoneGap: function () {
            return this.device.phonegap;
        },

        isTizen: function () {
            return this.device.tizen;
        },

        isFireFox: function () {
            return this.device.firefox;
        },

        isDesktop: function () {
            return this.device.desktop;
        }
    }
})();

Thesis.Gallery = (function() {
    var s = null;
    
    return {
        settings: {
            obj: null,
            moveLimit: 30,
            imageMargin: 6,
            headerHeight: 60,
            footerHeight: 60,
            maxWidth: 0,
            maxHeight: 0,
            min: 0,
            max: 10,
            step: 10,
            fileList: [],
            fullscreenImg: [],
            pictureDir: "",
            timers: [],
            windowWidth: 0,
            
        },
        listDirectory: function () {
            
        },

        init: function () {
            console.log("<-- Gallery init start -->");
            
            s = this.settings;
            s.obj = this;

            s.maxWidth = Math.floor(($(document).innerWidth()/ 2)-(s.imageMargin*4)-15);
            s.maxHeight = Math.floor((($(document).innerWidth()/ 2)-(s.imageMargin*4)-15)*0.8);
            s.windowWidth = $(window).width();
            s.footerHeight = $("#footer").height();
            s.headerHeight = $("#header").height();

            if(Thesis.Settings.isPhoneGap()) {
                this.listDirectory = Thesis.PhoneGap.listDirectory;
                s.pictureDir = "DCIM/Camera";
            } else if(Thesis.Settings.isFireFox()) {
                this.listDirectory = Thesis.Firefox.listDirectory;
                s.pictureDir = "pictures";
            }

            if(Thesis.Settings.isDesktop()) {
                var fileList = [
                                {   name: "img1.jpg",
                                    fullPath: "img/img1.jpg" },
                                    {   name: "img2.jpg",
                                        fullPath: "img/img2.jpg" },
                                        {   name: "img3.jpg",
                                            fullPath: "img/img3.jpg" },
                                            {   name: "img4.jpg",
                                                fullPath: "img/img4.jpg" },
                                                {   name: "img1.jpg",
                                                    fullPath: "img/img1.jpg" },
                                                    {   name: "img2.jpg",
                                                        fullPath: "img/img2.jpg" },
                                                        {   name: "img3.jpg",
                                                            fullPath: "img/img3.jpg" },
                                                            {   name: "img4.jpg",
                                                                fullPath: "img/img4.jpg" },
                                                                {   name: "img1.jpg",
                                                                    fullPath: "img/img1.jpg" },
                                                                    {   name: "img1.jpg",
                                                                        fullPath: "img/img1.jpg" },
                                                                        {   name: "img2.jpg",
                                                                            fullPath: "img/img2.jpg" },
                                                                            {   name: "img3.jpg",
                                                                                fullPath: "img/img3.jpg" },
                                                                                {   name: "img4.jpg",
                                                                                    fullPath: "img/img4.jpg" },
                                                                                    {   name: "img1.jpg",
                                                                                        fullPath: "img/img1.jpg" },
                                                                                        {   name: "img2.jpg",
                                                                                            fullPath: "img/img2.jpg" },
                                                                                            {   name: "img3.jpg",
                                                                                                fullPath: "img/img3.jpg" },
                                                                                                {   name: "img4.jpg",
                                                                                                    fullPath: "img/img4.jpg" },
                                                                                                    {   name: "img1.jpg",
                                                                                                        fullPath: "img/img1.jpg" },
                                                                                                        {   name: "img2.jpg",
                                                                                                            fullPath: "img/img2.jpg" },
                                                                                                            {   name: "img3.jpg",
                                                                                                                fullPath: "img/img3.jpg" },
                                                                                                                {   name: "img4.jpg",
                                                                                                                    fullPath: "img/img4.jpg" },
                                                                                                                    {   name: "img1.jpg",
                                                                                                                        fullPath: "img/img1.jpg" },
                                                                                                                        {   name: "img2.jpg",
                                                                                                                            fullPath: "img/img2.jpg" },
                                                                                                                            {   name: "img3.jpg",
                                                                                                                                fullPath: "img/img3.jpg" },
                                                                                                                                {   name: "img4.jpg",
                                                                                                                                    fullPath: "img/img4.jpg" },
                                                                                                                                    {   name: "img1.jpg",
                                                                                                                                        fullPath: "img/img1.jpg" },
                                                                                                                                        ];
                this.bindUIActions(fileList);
                this.loadGallery(fileList, s.step);
            } else {
                var printDirPath = function(fileList){
                    Thesis.Gallery.bindUIActions(fileList);
                    Thesis.Gallery.loadGallery(fileList, 10);
                };

                var galleryRefresh = function(fileList){
                    var preLength = s.fileList.length;
                    
                    console.log("Refresh: " + fileList.length + " - " + s.fileList.length);

                    var diffArr = fileList.diff(s.fileList,'name');
                    console.log(diffArr.length);
                    if(diffArr.length > 0) {
                        console.log((fileList.length - s.fileList.length - 1));
                        for (var i = diffArr.length - 1; i >= 0; i--) {
                            console.log(diffArr[i].name);
                            s.fileList.unshift(diffArr[i]);                            
                        };
                        
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

                this.listDirectory(s.pictureDir,"jpg",printDirPath);
                var refresh = setInterval(function() { s.obj.listDirectory(s.pictureDir,"jpg",galleryRefresh); }, 10000);
            } 
        },

        bindUIActions: function (images) {
            if(s.fileList.length == 0) {
                s.fileList = images;
            }


            $(window).scroll(function() {
                var g = Thesis.Gallery;
                if($(window).scrollTop() == $(document).height() - $(window).height()) {
                    g.loadGallery(g.settings.fileList, g.settings.step);    

                }
            });

            var prevPicObj = null;
            var currentPicObj = null;
            var nextPicObj = null;
            var draggable = null;
            var startX = 0;
            var moveX = 0;
            var tap = true;

            $("#fullscreen-image-container-prev, #fullscreen-image-container-current, #fullscreen-image-container-next").bind("vmousedown vmouseup vmousemove", function (event) {
                event.preventDefault();
                event.stopPropagation();

                //If right click do nothing.
                if(event.button === 2) {
                    return false;
                }

                if (event.type == 'vmousedown') {
                    moveX = 0;
                    startX = event.pageX;
                    
                    //If draggeble != null, we are still dragging. Tap should not be set to true to hide the fullscreen.
                    if(draggable == null) {
                        tap = true;    
                    }

                    draggable = $(this);
                    currentPicObj = $(this);

                    nextPicObj.show();
                    prevPicObj.show();
                } else if (event.type == 'vmouseup') {
                    if(tap) {
                        currentPicObj.parent().hide();
                        
                        prevPicObj.parent().hide();
                        nextPicObj.parent().hide();

                        $("#footer").hide();
                        tap = false;
                    } else if(currentPicObj != null) {                        
                        var center = s.windowWidth/2;
                        var offLeft = currentPicObj.offset().left;
                        var offRight = currentPicObj.offset().left+currentPicObj.width();
                        var currentImageIndex = parseInt(currentPicObj.find("canvas")[0].getAttribute("data-id"));

                        if(offRight < center && offLeft < 0) {
                            //slide out left
                            if(s.fileList.length > currentImageIndex+1) {                          
                                currentPicObj.animate({"left" : -currentPicObj.width()}, "fast");
                                nextPicObj.animate({"left" : 0}, "fast");
                           
                                tmp = currentPicObj;
                                currentPicObj = nextPicObj;
                                nextPicObj = prevPicObj;
                                prevPicObj = tmp;        

                                delete tmp;

                                var imageIndex = parseInt(currentPicObj.find("canvas")[0].getAttribute("data-id"));
                                var trgCanvas1 = nextPicObj.find("canvas")[0];

                                if(s.fileList.length > imageIndex+1) {
                                    s.obj.loadPicture(trgCanvas1, imageIndex+1);
                                } else {
                                    //No more images. Clear the next obj.                              
                                    var canvas = nextPicObj.find("canvas")[0]
                                    canvas.getContext("2d").reset();
                                }
                            } else {
                                currentPicObj.animate({"left" : 0}, "fast");
                                nextPicObj.animate({"left" : s.windowWidth}, "fast");
                            }
                        } else if(offLeft > center && offRight > s.windowWidth) {
                            //slide out right                            
                            if(currentImageIndex-1 >= 0) {
                                currentPicObj.animate({"left" : s.windowWidth}, "fast");
                                prevPicObj.animate({"left" : 0}, "fast");

                                tmp = currentPicObj;
                                currentPicObj = prevPicObj;
                                prevPicObj = nextPicObj;
                                nextPicObj = tmp;

                                delete tmp;

                                var imageIndex = parseInt(currentPicObj.find("canvas")[0].getAttribute("data-id"));
                                var trgCanvas1 = prevPicObj.find("canvas")[0];

                                if(imageIndex-1 >= 0) {
                                    s.obj.loadPicture(trgCanvas1, imageIndex-1);
                                } else {
                                    //No more images. Clear the previous obj.
                                    var canvas = prevPicObj.find("canvas")[0]
                                    canvas.getContext("2d").reset();
                                }
                            } else {
                                currentPicObj.animate({"left" : 0}, "fast");
                                prevPicObj.animate({"left" : -s.windowWidth}, "fast");
                            }

                        } else if(offLeft < center && offRight > s.windowWidth) {
                            //slide back from right
                            currentPicObj.animate({"left" : 0}, "fast");
                            prevPicObj.animate({"left" : -s.windowWidth}, "fast");
                        } else if(offLeft < 0 && offRight > center) {
                            //slide back from left
                            currentPicObj.animate({"left" : 0}, "fast");
                            nextPicObj.animate({"left" : s.windowWidth}, "fast");
                        }
                    }
                    draggable = null;
                } else if (event.type == 'vmousemove') {
                    moveX = event.pageX-startX;
                    if (Math.abs(moveX) > s.moveLimit && draggable) {
                        tap = false;
                        draggable.offset({
                            left: moveX
                        });

                        nextPicObj.offset({
                            left: moveX+s.windowWidth
                        });

                        prevPicObj.offset({
                            left: moveX-s.windowWidth
                        });
                    } 
                }                 
            });

            $("#rotate-left").on("click", function(event){
                console.log("Rotate left.");
                var canvas = currentPicObj.find("canvas")[0];
                var imageObj = s.fullscreenImg[canvas.id];
                
                s.obj.rotateCanvas(canvas, imageObj, s.fullscreenImg[canvas.id].angle -= 30);
            }); 

            $("#rotate-right").on("click", function(event){
                console.log("Rotate right.");
                var canvas = currentPicObj.find("canvas")[0];
                var imageObj = s.fullscreenImg[canvas.id];
                           
                s.obj.rotateCanvas(canvas, imageObj, s.fullscreenImg[canvas.id].angle += 30);
            });

            $("#invert").on("click", function(event){
                console.log("Invert.");
                var canvas = currentPicObj.find("canvas")[0];
                var imageObj = s.fullscreenImg[canvas.id];

                s.obj.invertCanvas(canvas, imageObj);
            });          

            $("#content").on("click","canvas", function(event){                
                console.log("clicked");

                var srcCanvas1 = $(this)[0];                
                var currentCanvas = document.getElementById("fullscreen-img");
                var nextCanvas = document.getElementById("fullscreen-img2");
                var prevCanvas = document.getElementById("fullscreen-img3");
                var imageIndex =  parseInt(srcCanvas1.getAttribute("data-id"));
                
                currentCanvas.getContext("2d").reset();
                currentPicObj = s.obj.resetFullscreenImageContainer(currentCanvas, 0);               

                nextCanvas.getContext("2d").reset();
                nextPicObj = s.obj.resetFullscreenImageContainer(nextCanvas, s.windowWidth);
               
                prevCanvas.getContext("2d").reset();
                prevPicObj = s.obj.resetFullscreenImageContainer(prevCanvas, -s.windowWidth);
                
                //Load next image
                if(imageIndex+1 <= s.fileList.length-1) {                        
                    s.obj.loadPicture(nextCanvas, (imageIndex+1));
                }

                //Load previous image
                if(imageIndex-1 >= 0) {                        
                    s.obj.loadPicture(prevCanvas, (imageIndex-1));
                }
                
                s.obj.loadPicture(currentCanvas, imageIndex, s.obj.messureTime);                

                $("#fullscreen").show();
                $("#footer").offset({
                        bottom: 0
                    });
                $("#footer").css("position","fixed");
                $("#footer").show();                 
            });
        }, 

        resetFullscreenImageContainer : function (canvas, pos) {
            var imageContainer = $(canvas).parent();
            imageContainer.offset({
                left: pos
            });

            imageContainer.css("position","fixed");
            return imageContainer;
        },

        messureTime : function (name) {
            if(s.timers[name] === undefined) {
                s.timers[name] = { 
                    name: name,
                    timeStart: 0,
                    timeEnd: 0
                }
            }
            if(s.timers[name].timeStart === 0) {
                s.timers[name].timeStart = new Date().getMilliseconds();
            } else {
                s.timers[name].timeEnd = new Date().getMilliseconds();
                var time = s.timers[name].timeEnd - s.timers[name].timeStart;                
                $("#exec-time").html(name + ": " + time);

                s.timers[name].timeStart = 0;
            }
        },

        loadPicture: function (trgCanvas, imageIndex, callback) {
            if(callback) {
                //Load and draw image - timer start
                callback(imageIndex);        
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

            trgCanvas.setAttribute("data-id",imageIndex);
            trgCanvas.setAttribute("style","margin-top:" + s.headerHeight + "px");

            
            var ctx = trgCanvas.getContext("2d");
            var pixelRatio = window.devicePixelRatio;
            ctx.scale(pixelRatio, pixelRatio);

            var image = new Image();

            image.onload = function () {
                var maxWidth = $(window).width();
                var maxHeight = $(window).height()-s.footerHeight-s.headerHeight;
                var ratio = 1;

                ratio = maxWidth / image.width;
                var sourceWidth = image.width * ratio;
                var sourceHeight = image.height * ratio;

                if (image.height > image.width) {
                    ratio = maxHeight / image.height;
                    var sourceWidth = image.width * ratio;
                    var sourceHeight = image.height * ratio;
                } else if(sourceHeight > maxHeight) {
                    ratio = maxHeight / image.height;
                    sourceWidth = image.width * ratio;
                    sourceHeight = image.height * ratio;
                }

                trgCanvas.width = maxWidth;
                trgCanvas.height = maxHeight;

                /*
                console.log("Ratio: " + ratio);

                console.log("Max w: " + maxWidth);
                console.log("Max h: " + maxHeight);

                console.log("Src w: " + sourceWidth);
                console.log("Src h: " + sourceHeight);

                console.log("Dest w: " + trgCanvas.width);
                console.log("Dest h: " + trgCanvas.height);*/
                
                s.fullscreenImg[trgCanvas.id].maxWidth = maxWidth;
                s.fullscreenImg[trgCanvas.id].maxHeight = maxHeight;
                s.fullscreenImg[trgCanvas.id].width = sourceWidth;
                s.fullscreenImg[trgCanvas.id].height = sourceHeight;
                ctx.drawImage(image, 0,0, image.width-2, image.height,(maxWidth-sourceWidth)/2, (maxHeight-sourceHeight)/2, sourceWidth,sourceHeight);
            
                if(callback) {
                    //Load and draw image - timer start
                    callback(imageIndex);        
                }       
            };

            image.src = s.fileList[imageIndex].fullPath;
            s.fullscreenImg[trgCanvas.id].imageData = image;
        },

        rotateCanvas: function (canvas, imageObj, degrees) {
            var ctx = canvas.getContext("2d").reset();
            ctx.save();
            ctx.translate(canvas.width/2,canvas.height/2);
            ctx.rotate(degrees*Math.PI/180);
            ctx.drawImage(imageObj.imageData,0,0, imageObj.imageData.width-2, imageObj.imageData.height,-(canvas.width)/2+(canvas.width-imageObj.width)/2, -(canvas.height)/2+(canvas.height-imageObj.height)/2, imageObj.width,imageObj.height);
            ctx.restore();
        },

        invertCanvas: function (canvas, imageObj) {
            var ctx = canvas.getContext("2d");
            var imgData = ctx.getImageData((canvas.width/2)-((imageObj.width-1)/2),(canvas.height/2)-(imageObj.height/2),imageObj.width,imageObj.height);
            // invert colors
            for (var i=0;i<imgData.data.length;i+=4) {
              imgData.data[i]=255-imgData.data[i];
              imgData.data[i+1]=255-imgData.data[i+1];
              imgData.data[i+2]=255-imgData.data[i+2];
              imgData.data[i+3]=255;
            }
            ctx.putImageData(imgData,(canvas.width/2)-((imageObj.width-1)/2),(canvas.height/2)-(imageObj.height/2));            
        },

        loadGallery: function (images, step, insertOnTop) {
            var canvas = [];
            var ctx = [];
            var imageObj = [];
            var min = s.min;
            var max = s.max;

            if(s.fileList.length == 0) {
                s.fileList = images;
            }

            if(images.length >= min) {
                for (var i = min; i < images.length && i < max; i++) {
                    canvas[i] = document.createElement("canvas");
                    canvas[i].className = "thumb";
                    canvas[i].setAttribute("data-id",i);

                    ctx[i] = canvas[i].getContext("2d");

                    imageObj[i] = new Image();

                    imageObj[i].onload = (function(n){
                        return function(){
                            canvas[n].width = s.maxWidth;
                            canvas[n].height = s.maxHeight;

                            var sourceX = 0;
                            var sourceY = 0;
                            var destX = 0;
                            var destY = 0;
                            // http://zsprawl.com/iOS/2012/03/cropping-scaling-images-with-canvas-html5/
                            if (imageObj[n].height > imageObj[n].width) {
                                // console.log("Portrait");
                                var stretchRatio = ( imageObj[n].width / canvas[n].width );
                                var sourceWidth = Math.floor(imageObj[n].width);
                                var sourceHeight = Math.floor(canvas[n].height*stretchRatio);
                                //sourceY = Math.floor((imageObj[n].height - sourceHeight)/2);
                            } else {
                                //console.log("Landscape");                    
                                var stretchRatio = ( imageObj[n].height / canvas[n].height );
                                var sourceWidth = Math.floor(canvas[n].width*stretchRatio);
                                var sourceHeight = Math.floor(imageObj[n].height);
                                // sourceX = Math.floor((imageObj[n].width - sourceWidth)/2);
                            }            
                            var destWidth = Math.floor(canvas[n].width);
                            var destHeight = Math.floor(canvas[n].height);
                            /*
                        console.log("Pixelratio: " + pixelRatio);
                        console.log("Ratio: " + stretchRatio);

                        console.log("Max w: " + canvas[n].width);
                        console.log("Max h: " + canvas[n].height);

                        console.log("Src w: " + sourceWidth);
                        console.log("Src h: " + sourceHeight);

                        console.log("Dest w: " + destWidth);
                        console.log("Dest h: " + destHeight);


                        console.log("sourceY: " + sourceY);
                        console.log("sourceX: " + sourceX);
                             */
                            ctx[n].drawImage(imageObj[n], sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
                        }
                    }(i));
                    imageObj[i].src = images[i].fullPath;
                    
                    if(insertOnTop) {
                        var parentElement = document.getElementById('content');
                        var theFirstChild = parentElement.firstChild;
                        parentElement.insertBefore(canvas[i], theFirstChild);
                        console.log(parentElement);
                    } else {
                        document.getElementById('content').appendChild(canvas[i]);    
                    }                    
                };
            };

            s.min += step;
            s.max += step;
        },
        LeakMemory: function (){
            for(var i = 0; i < 5000; i++){
                var parentDiv = document.createElement("div");
                parentDiv.onclick = function() {
                    foo();
                };
            }
        }
    }
})();

Thesis.PhoneGap = (function() {
    var rootDir = null;
    var s;

    return {
        settings: {
            
        },

        init: function () {
            console.log("<-- PhoneGap init start -->");
            Thesis.Settings.device.phonegap = true;

            s = this.settings;
            console.log("Load filesystem init");
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.onFileSystemSuccess, this.fail);
        },

        listDirectory: function (path, suffix, callback) {
            if(rootDir === null) {
                console.log("Error! fileSystem not initiated! run init() first!");
                return;
            }

            var dirs = path.split("/").reverse();
            var root = rootDir;

            var getDir = function(dir){
                root.getDirectory(dir, { create : false, exclusive : false}, successGet, failGet);
            };

            var successGet = function(entry){
                root = entry;
                if(dirs.length > 0){
                    getDir(dirs.pop());
                }else{
                    var directoryReader = root.createReader();
                    directoryReader.readEntries(successList,failList);
                }
            };

            var failGet = function(){
                console.log("failed to get dir " + dir);
            };

            var successList = function (entries) {
                var i;
                var dirs = [];

                for (i=entries.length-1; i >= 0; i--) {
                    if(entries[i].name.endsWith(suffix)) {
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
            console.log(fileSystem.name);
            console.log(fileSystem.root.fullPath);

            rootDir = fileSystem.root;
        },

        fail: function(evt) {
            console.log(evt.target.error.code);
        }

    }
})();

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

        init: function () {
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
                    setInterval(Thesis.Firefox.drawBall,10);
                }
            }

            
            console.log("<-- Firefox init done -->");
        },

        bindUIActions: function () {
            $("#install_button").click(function() {
                console.log(s.gManifestName);
                var req = navigator.mozApps.install(s.gManifestName);
                req.onsuccess = function() {
                    $("#install_button").text("INSTALLED!").unbind('click');
                }
                req.onerror = function(errObj) {
                    alert("Couldn't install (" + errObj.code + ") " + errObj.message);
                }
            });
        },

        listDirectory: function (path, suffix, callback) {
            var pics = navigator.getDeviceStorage(path);
            var cursor = pics.enumerate();
            var dirs = [];
            var allowedFileTypes = ["image/png", "image/jpeg", "image/gif"];
            var state;

            cursor.onsuccess = function () {
                var file = this.result;
                if (!file) {
                    callback(dirs);
                } else {
                    if(allowedFileTypes.indexOf(file.type) > -1) {
                        var dir = {
                                name: file.name,
                                fullPath: window.URL.createObjectURL(file)
                        }

                        dirs.push(dir);
                    }
                    this.continue();
                } 
            }

            cursor.onerror = function () {
                console.warn("No file found: " + this.error.name);
            }
        },

        drawBall: function()
        {
          context.clearRect(0,0, 300,300);
          context.beginPath();
          context.fillStyle="#0000ff";
          // Draws a circle of radius 20 at the coordinates 100,100 on the canvas
          context.arc(s.x,s.y,20,0,Math.PI*2,true);
          context.closePath();
          context.fill();

          if( s.x<20 || s.x>280) s.dx=-s.dx;
          if( s.y<20 || s.y>280) s.dy=-s.dy;
          s.x+=s.dx;
          s.y+=s.dy;
        }
    }
})();

Thesis.Tizen = (function () {
    var s;
    var context;

    return {
        settings: {
            
        },

        init: function () {
            console.log("<-- Tizen init start -->");
            Thesis.Settings.device.tizen = true;
            
            s = this.settings;

            


            // add eventListener for tizenhwkey
            document.addEventListener('tizenhwkey', function(e) {
                if(e.keyName == "back")
                    tizen.application.getCurrentApplication().exit();
            });

            this.bindUIActions();
        },

        bindUIActions: function () {
            
        },

        listDirectory: function (path, suffix, callback) {
           
        },
    }
})();

$(document).bind('pageinit', function () {
    if (navigator.userAgent.match(/(Tizen)/)) {
        Thesis.Tizen.init();
    }     
});

//Init brower and phonegap
$(function() {
    if (navigator.userAgent.match(/(Firefox)/)) {
        Thesis.Firefox.init();
    } else if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        document.addEventListener("deviceready", function () {
            Thesis.PhoneGap.init();  
            Thesis.Gallery.init();
        }, false);
    } else {
        Thesis.Settings.device.desktop = true;
        Thesis.Gallery.init();
    }
});



