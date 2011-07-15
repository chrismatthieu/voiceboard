/**
 * Created by 23rd and Walnut
 * www.23andwalnut.com
 * User: Saleem El-Amin
 * Date: May 25, 2010
 * Time: 6:35:06 PM
 */


/** *
 * Please email me via my codecanyon profile
 * page http://codecanyon.net/user/23andwalnut
 * if you have any issues
 */
(function($)
{

    $.fn.ttwFullScreenMusic = function (config)
    {
        var plist = this;
        var defaultOpts = {
            autoPlay: true,
            autoAdvance: true,
            style: 'minimal',
            showPlaylist: false,
            autoHideControls: false,
            showProgressBar: true,
            controlsAutoHideInterval: 2000,
            loadFirstItem: true,
            preloadImages: true,
            backgroundColor: '#000000',
            useCufon: false,
            cufonFont: false,
            defaultVolume: 50
        };

        var options = $.extend({}, defaultOpts, config);

        var currentItem = null;
        var numItems = 0;
        var playlistItems = [];
        var sound;
        var timeTotal = null;
        var timeElapsed = null;
        var playBtn = null;
        var nextBtn = null;
        var prevBtn = null;
        var volume = null;
        var positionBar = null;
        var loadingBar = null;
        var backgroundQueue = [];
        var initComplete = false;
        var loadingIndicator;
        var currentVolume = options.defaultVolume;
        var player = new Player();
        var handler = new Handler();
        var initialized = false;

        player.start();


        /**
         * This sets up the playlist and soundmanager objects used in
         * the rest of the code.
         */
        function Playlist()
        {
            return {

                init: function ()
                {


                    plist.find('li a').each(function()
                    {
                        numItems++;
                        var songId = "openPlaylist-" + numItems;
                        currentItem = songId;

                        var nextAction = (options.autoAdvance) ? player.next : '';


                        playlistItems[numItems - 1] = soundManager.createSound({
                            id : songId,
                            url : $(this).attr('href'),
                            whileloading: handler.whileloading,
                            whileplaying: handler.whileplaying,
                            onfinish: nextAction
                        });


                        $(this).attr('id', "openPlaylist-" + numItems);

                    });

                    currentItem = null;
                }
            }
        }





        /**
         * The Handler object handles all interaction with soundmanager
         * i.e. play, pause, volume, etc.
         */
        function Handler()
        {
            function getTime(nMSec, bAsString)
            {
                // convert milliseconds to mm:ss, return as object literal or string
                var nSec = Math.floor(nMSec / 1000);
                var min = Math.floor(nSec / 60);
                var sec = nSec - (min * 60);
                if (min === 0 && sec === 0)
                {
                    return null;
                } // return 0:00 as null

                return (bAsString ? (min + ':' + (sec < 10 ? '0' + sec : sec)) : {'min':min,'sec':sec});
            }





            return{

                play: function(songId, forceChange)
                {
                    if (!forceChange)
                    {
                        var forceChange = false;
                    }

                    if (currentItem == null && songId == null)
                    {
                        songId = 'openPlaylist-1';
                    }

                    if (songId != null)
                    {

                        if (songId != currentItem || forceChange)
                        {
                            soundManager.stopAll();
                            sound = soundManager.getSoundById(songId);
                        }
                    }

                    if (sound != null)
                    {
                        if (sound.playState == 1 && !forceChange)
                        {
                            sound.togglePause();
                        }
                        else
                        {
                            currentItem = songId;
                            sound.setPosition(0);
                            sound.play({volume:currentVolume});
                        }
                    }
                },
                next: function()
                {

                    if (currentItem != null)
                    {
                        var nextItem = currentItem.split('-');
                        nextItem = (nextItem[1] * 1) + 1;

                        if (nextItem <= numItems)
                        {
                            nextItem = "openPlaylist-" + nextItem;
                        }
                        else
                        {
                            nextItem = "openPlaylist-" + 1;
                        }

                        currentItem = nextItem;
                        handler.play(currentItem, true);

                    }
                },
                previous: function()
                {

                    if (currentItem != null)
                    {
                        var previousItem = currentItem.split('-');
                        previousItem = (previousItem[1] * 1) - 1;

                        if (previousItem > 0)
                        {
                            previousItem = "openPlaylist-" + previousItem;
                        }
                        else
                        {
                            previousItem = "openPlaylist-" + numItems;
                        }

                        currentItem = previousItem;

                        handler.play(currentItem, true);
                    }

                },
                whileplaying: function()
                {
                    var elapsed = sound.position / sound.duration;

                    timeTotal.html(getTime(sound.duration, true));

                    positionBar.css("width", (elapsed * 100) + '%');

                    timeElapsed.html(getTime(sound.position, true) || '0:00');

                },
                whileloading: function()
                {
                    loadingBar.css("width", ((sound.bytesLoaded / sound.bytesTotal) * 100) + '%');
                },
                setPosition: function(e)
                {
                    var x = parseInt(e.clientX);

                    var statusBar = $('#statusbar');
                    var barPosition = statusBar.position();

                    var seekTime = sound.duration * ((x - barPosition.left) / statusBar.width());

                    sound.setPosition(seekTime)
                },
                load: function(songId)
                {
                    if (songId != null)
                    {
                        sound = soundManager.getSoundById(songId);
                        sound.load();
                        return sound.durationEstimate;
                    }
                },
                setVolume: function(e, vol)
                {
                    if (!vol)
                    {
                        var x = parseInt(e.clientX);

                        var volumeBarPosition = $('#volume').position();
                        var volume = ((x - volumeBarPosition.left) - 25);
                        sound.setVolume(volume);
                        currentVolume = volume;
                        $('#volume .value').css('width', volume + "%");

                    }
                    else
                    {
                        sound.setVolume(vol);
                        currentVolume = vol;

                        if (vol != 'mute')
                        {
                            $('#volume .value').css('width', vol + "%");
                        }
                        else $('#volume .value').css('width', 0);
                    }


                }
            }
        }





        /**
         * The player object handles all visual elements of
         * the player, as well as all of the player events
         * i.e. button clicks.
         */
        function Player()
        {
            var playlist = new Playlist();
            var style = options.style;
            var imgUrls = [];
            var images = [];
            var imagesLoaded = false;
            var playlistHTML;





            function buildPlayer()
            {
                var styleSpecific = (style == 'page-list') ?
                        '<div id="position-control"></div>' :
                        '<div id="media-description"></div>';
                var progressBar = (options.showProgressBar || style != 'fullscreen') ?
                        '<div id="timing" class="clearfix">' +
                                '<span id="elapsed"></span>/<span id="total"></span>' +
                                '</div>' +
                                '<div id="statusbar">' +
                                '<div id="loading" style="width: 0%;"></div>' +
                                '<div id="position" style="width: 0%;"></div>' +
                                ' </div>' : '';

                var volume = '<div id="volume">' +
                        '<a href="#" id="min"></a>' +
                        '<div class="outer">' +
                        '<div class="inner"></div>' +
                        '<div class="value"></div>' +
                        '</div>' +
                        '   <a href="#" id="max"></a>' +
                        '</div>';
                var play = (style == 'fullscreen') ? '' : '<a href="#" id="play" class="main-button"></a>' + volume;
                var playContainer = (style == 'fullscreen') ? '<div class="play-container"><a href="#" id="play" class="main-button"></a></div>' + volume : '';

                var myPlayer = playContainer + '<div id="openPlayer">' +
                        styleSpecific +
                        progressBar +
                        '<div class="controls-container">' +
                        '<div id="controls">' +
                        '<a href="#" id="previous" class="main-button"></a>' +
                        play +
                        '<a href="#" id="next" class="main-button"></a>' +

                        '</div>' +
                        '</div>' +

                        '</div>';

                return myPlayer;
            }





            function initialize()
            {

                if (!$('.openPlayerContent').length)
                {
                    plist.wrap('<div class="openPlayerContent" />');
                }

                if (is_ie6())
                {
                    if (options.style != 'minimal')
                    {
                        options.style = 'minimal';
                        style = 'minimal';
                    }

                    options.useCufon = false;
                }

                if (options.style == 'fullscreen' && !options.showPlaylist)
                {
                    plist.css('display', 'none');
                }

                if ($('#openPlayer').length == 0)
                    $('body').append(buildPlayer());

                if ($('#loading-indicator').length == 0 && style == 'fullscreen')
                {
                    $('body').prepend('<div id="loading-indicator>loading...</div>');
                    loadingIndicator = $('#loading-indicator');
                }


                timeTotal = $('#total');
                timeElapsed = $('#elapsed');
                playBtn = $('#play');
                nextBtn = $('#next');
                prevBtn = $('#previous');
                volume = $('#volume');
                positionBar = $('#position');
                loadingBar = $('#loading');
                playlistHTML = plist;
                var windowHeight = $(window).height();
                var openPlayerContent = $('.openPlayerContent');


                $('#volume .value').css('width', currentVolume + "%");
                if (options.autoPlay)
                {
                    playBtn.addClass('pause');
                } //hack, need to work on button states

                $('#openPlayer').addClass(style);
                openPlayerContent.addClass(style);

                playlistHTML.addClass(style);

                if (style == 'page-list')
                {
                    openPlayerContent.css({height: windowHeight});
                    playlistHTML.css({height: windowHeight - 40});

                    var controlsHTML = $('.controls-container');
                    controlsHTML.addClass(style);


                    if (!initialized)
                    {
                        $('body').append(controlsHTML);
                        $('body').prepend(volume.addClass('page-list'));
                    }

                }
                else if (style == 'fullscreen')
                {
                    if ($('#fullscreen-bg').length == 0)
                        $('body').append('<div id="fullscreen-bg"></div>').css('background-color', options.backgroundColor);

                    $('#fullscreen-bg').css({height: windowHeight});

                    if ($('.play-container').length == 0)
                    {
                        $('body').prepend('<div class="play-container></div>', volume);
                        $('.play-container').html(playBtn);
                    }

                    playBtn.addClass(style);
                    volume.addClass(style);

                    playlistHTML.find('li a').each(function()
                    {
                        imgUrls.push($(this).attr('rel'));
                    });
                }

                if (options.autoHideControls && style == 'fullscreen')
                {

                    $('body').hover(function()
                    {
                        $('#controls').animate({opacity:1}, 'fast');
                    }, function()
                    {
                        setTimeout(function()
                        {
                            $('#controls').animate({opacity:0}, 'fast')
                        }, options.controlsAutoHideInterval);
                    });
                }


                openPlayerContent.animate({opacity: 1}, 'fast', function()
                {
                    if (style == 'fullscreen')
                    {
                        if (options.loadFirstItem && currentItem == null)
                        {
                            var background = $('#fullscreen-bg');
                            var firstLink = plist.find('a:first-child');
                            if (background.find('.background-image').length == 0)
                            {
                                completeInit(); //will wait for the following code to run or for a user click to play a song
                                var firstImage = firstLink.attr('rel');
                                waitFor(firstImage, function()
                                {
                                    addBackgroundImage(background, firstImage);
                                    $('#media-description').html(firstLink.html());
                                    handler.load(firstLink.attr('id'));
                                    if (options.useCufon)
                                    {
                                        Cufon.refresh();
                                    }
                                    initComplete = true;
                                });
                            }

                        }
                        if (options.preloadImages && !imagesLoaded)
                        {
                            preloadImages(imgUrls, function()
                            {
                                imagesLoaded = true;
                                initComplete = true;
                            });
                        }
                        else
                        {
                            initComplete = true;
                        }
                    }
                    else
                    {
                        initComplete = true;
                        completeInit();
                    }
                });


                initialized = true;
            }





            function cufonInit(font)
            {
                Cufon.replace("#media-description, #openPlayerContent, .playlist", {
                    fontFamily: font,
                    hover: true
                });
            }





            //hack to finish initialization even if playlist button is clicked while loading
            function completeInit()
            {
                if (initComplete)
                {
                    if (options.useCufon)
                    {
                        cufonInit(options.cufonFont);
                    }

                    if (options.autoPlay)
                    {

                        if (currentItem == null)
                        {
                            player.play('openPlaylist-1');
                        }
                    }

                } else setTimeout(function()
                {
                    completeInit();
                }, 500);
            }





            function waitFor(img, callback)
            {


                clearQueue(backgroundQueue);

                loadingIndicator.animate({opacity:1}, 'fast');

                if (!options.preloadImages)
                {
                    loadImage(img, callback);
                }

                if (images[img] != undefined)
                {
                    if (imageLoaded(images[img]))
                    {
                        callback();
                        initComplete = true;
                        loadingIndicator.animate({opacity:0}, 'fast');
                    }
                    else
                    {
                        backgroundQueue.push(setTimeout(function()
                        {
                            waitFor(img, callback)
                        }, 500));
                    }
                }
                else
                {
                    backgroundQueue.push(setTimeout(function()
                    {
                        waitFor(img, callback)
                    }, 500));
                }
            }





            function clearQueue(queue)
            {
                for (var i = 0, len = queue.length; i < len; i++)
                    clearTimeout(queue[i]);
            }





            function addBackgroundImage(background, url)
            {
                var img = $("<img>").attr({
                    'src': url,
                    'class': 'background-image'}).css('opacity', 0);


                adjustBG(img, url);
                background.append(img);

                background.find('.background-image').css({opacity: 1});//, 'slow');
            }





            function adjustBG(img, url)
            {

                var imgRatio = images[url].width / images[url].height;

                var bgWidth = $(window).width(),
                        bgHeight = bgWidth / imgRatio;

                if (bgHeight < $(window).height())
                {
                    bgHeight = $(window).height();
                    bgWidth = bgHeight * imgRatio;
                }

                img.width(bgWidth).height(bgHeight);
            }





            function loadImage(image, callback)
            {
                images[image] = new Image();
                images[image].onload = function()
                {
                    if ($.isFunction(callback))
                    {
                        callback();
                        initComplete = true;
                    }
                };
                images[image].src = image;
            }





            function preloadImages(imageList, callback)
            {
                var i, total, loaded = 0;
                if (typeof imageList != 'undefined')
                {
                    if ($.isArray(imageList))
                    {
                        total = imageList.length; // used later
                        for (var i = 0; i < total; i++)
                        {
                            images[imageList[i]] = new Image();
                            images[imageList[i]].onload = function()
                            {
                                //$('body').append(this.src+"<br/>");
                                loaded++; // should never hit a race condition due to JS's non-threaded nature
                                if (loaded == total)
                                {
                                    if ($.isFunction(callback))
                                    {
                                        callback();
                                    }
                                }
                            };
                            images[imageList[i]].src = imageList[i];
                        }
                    }
                }
            }





            function imageLoaded(img)
            {

                if (!img.complete)
                {
                    return false;
                }

                if (typeof img.naturalWidth != 'undefined' && img.naturalWidth == 0)
                {
                    return false;
                }

                return true;
            }





            function managePlayer()
            {
                //loses playbtn because of play container
                playBtn = $('#play');

                if (currentItem != null)
                {
                    var changeBackground = false;
                    var addPause = false;

                    //if no item was playing and a button was just pressed
                    if ($('.playing').length == 0)
                    {
                        $('#' + currentItem).parent('li').addClass('pause');
                    }

                    if ($('.playing a').attr('id') == currentItem)
                    {
                        playBtn.toggleClass('pause');
                        $('.playing').toggleClass('pause');
                    }
                    else
                    {
                        $('.playing').removeClass('playing pause');
                        $('#' + currentItem).parent('li').addClass('playing pause');
                        changeBackground = true;
                    }

                    if (style == 'page-list')
                    {
                        var playerHTML = $('#openPlayer');
                        var currPlayItem = $('.playing');

                        if ($('li.playing').find('#openPlayer').length == 0)
                        {
                            playBtn.addClass('pause');
                            currPlayItem.append(playerHTML);
                            $('.playing').prepend($('#position-control'));
                        }
                    }
                    if (style == 'fullscreen')
                    {
                        var backgroundUrl = $('.playing a').attr('rel');
                        var background = $('#fullscreen-bg');

                        $('#media-description').html($('.playing a').html());

                        if (changeBackground)
                        {
                            if (background.find('.background-image').length > 0)
                            {
                                background.find('.background-image').animate({opacity: 0}, 'slow', function()
                                {
                                    $(this).remove();
                                    waitFor(backgroundUrl, function()
                                    {
                                        addBackgroundImage(background, backgroundUrl);
                                    });
                                });
                            }
                            else waitFor(backgroundUrl, function()
                            {
                                addBackgroundImage(background, backgroundUrl);
                            });
                        }
                    }
                    if (style == 'minimal')
                    {
                        $('.playing').append($('#timing'));
                    }

                    if (options.useCufon)
                    {
                        Cufon.refresh();
                    }
                }

            }





            function handleTitleClick()
            {
                if (currentItem != null)
                {
                    handler.play(currentItem);
                    managePlayer();
                }
                else
                {
                    handler.play('openPlaylist-1');
                    managePlayer();
                }
            }





            function is_ie6()
            {
                return ((window.XMLHttpRequest == undefined) && (ActiveXObject != undefined));
            }





            return {

                start: function()
                {
                    var self = this;
                    initialize();
                    playlist.init();
                    self.handleEvents();

                },
                play: function(songId)
                {
                    handler.play(songId);
                    managePlayer();
                    return false;
                },
                next: function(songId)
                {
                    handler.next(songId);
                    managePlayer();
                    return false;
                },
                previous: function(songId)
                {
                    handler.previous(songId);
                    managePlayer();
                    return false;
                },
                seekTo: function(e)
                {
                    handler.setPosition(e);
                },
                changeVolume: function (e, vol)
                {
                    if (!vol)
                    {
                        vol = false;
                    }
                    handler.setVolume(e, vol);
                },
                handleEvents: function()
                {
                    var self = this;

                    $(window).resize(function()
                    {
                        initialize();
                    });

                    $('#play').click(function()
                    {
                        self.play();
                    });

                    nextBtn.click(function()
                    {
                        self.next();
                        return false;
                    });

                    prevBtn.click(function()
                    {
                        self.previous();
                        return false;
                    });

                    plist.find('li a').click(function(e)
                    {
                        e.preventDefault();
                        self.play($(this).attr('id'));
                        return false;
                    });

                    $('#position-control').click(function(e)
                    {
                        self.seekTo(e);
                    });

                    $('#statusbar').click(function(e)
                    {
                        self.seekTo(e);
                    });

                    $('#media-description').click(function()
                    {
                        handleTitleClick();
                    });

                    $('#volume .outer').click(function(e)
                    {
                        self.changeVolume(e);
                    });

                    $('#min').click(function(e)
                    {
                        self.changeVolume(e, 'mute');
                    });

                    $('#max').click(function(e)
                    {

                        self.changeVolume(e, 100);
                    });

                }
            }
        }





        return {
            player: player,
            handler: handler
        }
    }
})(jQuery);
