if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
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
            this: null,
            imageMargin: 6,
            maxWidth: 0,
            maxHeight: 0,
            min: 0,
            max: 10,
            step: 10,
            fileList: [],
            fullscreenImg: {
                fullPath: null,
                imageData: null,
                angle: 0,
                maxWidth: 0,
                maxHeight: 0,
                width: 0,
                height: 0
            },
            pictureDir: "",
        },
        listDirectory: function () {
            
        },

        init: function () {
            console.log("<-- Gallery init start -->");
            
            s = this.settings;
            s.this = this;

            s.maxWidth = Math.floor(($(document).innerWidth()/ 2)-(s.imageMargin*4));
            s.maxHeight = Math.floor(($(document).innerWidth()/ 2)-(s.imageMargin*4)*0.8);

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
                    console.log("DIRS: " + JSON.stringify(fileList) );

                    Thesis.Gallery.bindUIActions(fileList);
                    Thesis.Gallery.loadGallery(fileList, 10);
                }

                this.listDirectory(s.pictureDir,"jpg",printDirPath);
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

            $("#fullscreen-image-container").on("click", function(event){
                $(this).parent().hide();
            });

            $("#rotate-left").on("click", function(event){
                console.log("Rotate left.");
                var canvas = document.getElementById("fullscreen-img");
                var imageObj = s.fullscreenImg;

                s.this.rotateCanvas(canvas, imageObj, s.fullscreenImg.angle -= 30);
            }); 

            $("#rotate-right").on("click", function(event){
                console.log("Rotate right.");
                var canvas = document.getElementById("fullscreen-img");
                var imageObj = s.fullscreenImg;
                           
                s.this.rotateCanvas(canvas, imageObj, s.fullscreenImg.angle += 30);
            });

            $("#invert").on("click", function(event){
                console.log("Rotate right.");
                var canvas = document.getElementById("fullscreen-img");
                var imageObj = s.fullscreenImg;

                s.this.invertCanvas(canvas, imageObj);
            });          

            $("#content").on("click","canvas", function(event){
                var canvas = $(this)[0];

                console.log(canvas);
                var canvasFullscreen = document.getElementById("fullscreen-img");
                canvasFullscreen.setAttribute("data-id",canvas.id);
                
                var ctx = canvasFullscreen.getContext("2d");
                var pixelRatio = window.devicePixelRatio;
                ctx.scale(pixelRatio, pixelRatio);

                var image = new Image();
                image.id = "pic"

                image.onload = function () {
                    var maxWidth = $(window).width()-100;
                    var maxHeight = $(window).height()-100;
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

                    canvasFullscreen.width = maxWidth;
                    canvasFullscreen.height = maxHeight;

                    /*
                    console.log("Ratio: " + ratio);

                    console.log("Max w: " + maxWidth);
                    console.log("Max h: " + maxHeight);

                    console.log("Src w: " + sourceWidth);
                    console.log("Src h: " + sourceHeight);

                    console.log("Dest w: " + canvasFullscreen.width);
                    console.log("Dest h: " + canvasFullscreen.height);*/
                    
                    s.fullscreenImg.maxWidth = maxWidth;
                    s.fullscreenImg.maxHeight = maxHeight;
                    s.fullscreenImg.width = sourceWidth;
                    s.fullscreenImg.height = sourceHeight;
                    ctx.drawImage(image, 0,0, image.width-2, image.height,(maxWidth-sourceWidth)/2, (maxHeight-sourceHeight)/2, sourceWidth,sourceHeight);
                        
                };

                image.src = images[canvas.id].fullPath;
                s.fullscreenImg.imageData = image;
               
                $("#fullscreen").show();
                
                console.log($(window).scrollTop());
            });
        }, 

        rotateCanvas: function (canvas, imageObj, degrees) {
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.save();
            ctx.translate(canvas.width/2,canvas.height/2);
            ctx.rotate(degrees*Math.PI/180);
            ctx.drawImage(imageObj.imageData,0,0, imageObj.imageData.width-2, imageObj.imageData.height,-(canvas.width)/2+(canvas.width-imageObj.width)/2, -(canvas.height)/2+(canvas.height-imageObj.height)/2, imageObj.width,imageObj.height);
            ctx.restore();
        },

        invertCanvas: function (canvas, imageObj) {
            var ctx = canvas.getContext("2d");
            //ctx.drawImage(image,canvas.width,canvas.height);
            console.log(canvas.width);
            console.log(imageObj.width);
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

        loadGallery: function (images, step) {
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
                    console.log(images[i].name);                    

                    canvas[i] = document.createElement("canvas");
                    canvas[i].id = i;
                    canvas[i].className = "thumb";

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
                    document.getElementById('content').appendChild(canvas[i]);
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
                console.warn("No file found: " + this.error);
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

//Tizen initialize function
var init = function () {
    //TODO: Make this as a module
    Thesis.Settings.device.tizen = true;

    // TODO:: Do your initialization job
    console.log("init() called");

    Thesis.Gallery.init();

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if(e.keyName == "back")
            tizen.application.getCurrentApplication().exit();
    });
};
$(document).bind('pageinit', init);

//Init brower and phonegap
$(function() {
    if (navigator.userAgent.match(/(Firefox)/)) {
        Thesis.Firefox.init();
    } else if (navigator.userAgent.match(/(Tizen)/)) {
        console.log("Script start!");
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



