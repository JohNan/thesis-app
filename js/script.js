if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

var Thesis = {};
Thesis.Gallery = (function() {
    var s = null;
    
    return {
        settings: {
            this: null,
            maxWidth: 0,
            maxHeight: 0,
            min: 0,
            max: 10,
            step: 10,
            fileList: [],
            fullscreenImg: {
                fullPath: null,
                imageData: null,
                angle: 0
            }
        },

        init: function () {
            console.log("INIT");
            
            s = this.settings;
            s.this = this;

            s.maxWidth = Math.floor(($(document).width()-12-40) / 2);
            s.maxHeight = Math.floor((($(document).width()-12-40) / 2)*0.8);
  
            document.getElementById("ratio").innerHTML = s.maxWidth + " - " + s.maxHeight;

            if(Thesis.PhoneGap.isInitiated()) {
                var printDirPath = function(fileList){
                    console.log("DIRS: " + JSON.stringify(fileList) );

                    Thesis.Gallery.bindUIActions(fileList);
                    Thesis.Gallery.loadGallery(fileList, 10);
                }

                Thesis.PhoneGap.listDirectory("DCIM/Camera","jpg",printDirPath);  
            } else {
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

            $("#fullscreen-img").on("click", function(event){
                $(this).parent().hide();
            });

            $("#content").on("click","canvas", function(event){
                var canvas = $(this)[0];

                console.log(canvas);
                var canvasFullscreen = document.getElementById("fullscreen-img");
                var ctx = canvasFullscreen.getContext("2d");
                var pixelRatio = window.devicePixelRatio;
                ctx.scale(pixelRatio, pixelRatio);

                var image = new Image();
                image.id = "pic"

                image.onload = function () {
                    var maxWidth = document.width-80;
                    var maxHeight = document.height-40;
                    var ratio = 1;

                    if (image.height > image.width && image.height > maxHeight) {
                        ratio = maxHeight / image.height;
                        var sourceWidth = image.width * ratio;
                        var sourceHeight = image.height * ratio;
                    } else  if (image.width > maxWidth) {
                        ratio = maxWidth / image.width;
                        var sourceWidth = image.width * ratio;
                        var sourceHeight = image.height * ratio;
                    }

                    canvasFullscreen.width = image.width*ratio;
                    canvasFullscreen.height = image.height*ratio;
                    /*
                    console.log("Ratio: " + ratio);

                    console.log("Max w: " + maxWidth);
                    console.log("Max h: " + maxHeight);

                    console.log("Src w: " + sourceWidth);
                    console.log("Src h: " + sourceHeight);

                    console.log("Dest w: " + canvasFullscreen.width);
                    console.log("Dest h: " + canvasFullscreen.height);
                     */
                    ctx.drawImage(image, 0,0, sourceWidth, sourceHeight);

                };

                image.src = images[canvas.id].fullPath;
                //  image.src = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                // canvasFullscreen.parentNode.style.visibility='visible';
                $("#fullscreen-img").parent().show();

                console.log(ctx);
            });
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
                    if(!images[i].fullPath.endsWith("jpg")) {
                        console.log(images[i].name);
                        continue;
                    }

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
            initiated: false,
        },

        init: function () {
            s = this.settings;
            console.log("Load filesystem init");
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.onFileSystemSuccess, this.fail);
            s.initiated = true;
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
        },

        isInitiated: function () {
            return this.settings.initiated;
        }
    }
})();

/*  
function go() {
    $('<div/>')
      .html(new Array(1000).join('text')) // div with a text 
  .click(function() { })
}

var interval = setInterval(go, 10)
 */

//Tizen initialize function
var init = function () {
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
    
    if (navigator.userAgent.match(/(Tizen)/)) {
        console.log("Script start!");
    } else if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        document.addEventListener("deviceready", function () {
            Thesis.PhoneGap.init();  
            Thesis.Gallery.init();
        }, false);
    } else {
        Thesis.Gallery.init();
    }

});



