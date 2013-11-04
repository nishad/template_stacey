/*jshint
  expr: true
*/

$(document).ready(function() {

    /*    S E L E C T
    ---------------------------------------- */
    select = {

        $html:                  $('html'),
        $body:                  $('body'),
        $page_head:             $('.page-head'),
        $page_wrap:             $('.page-wrap'),

        $has_hero:              $('.page--has-hero'),
        $header_hero:           $('.header--hero'),
        $hero_image:            $('.hero__image'),

        $slider:                $('.slider'),
        $slide_image:           $('.slide__image'),
        $active_slide:          $('.slide.active'),
        $has_exif:              $('.media--show-exif')

    };


    /*    H O O K S
    ---------------------------------------- */
    hook = {

        jsParallax:     $('.js--parallax'),
        jsParallaxLG:   $('.js--parallax-large'),
        jsUnveil:       $('.js--unveil'),
        jsFitVid:       $('.js--fitvid'),
        jsFitText:      $('.js--fittext')

    };


    /*    S T A T E S
    ---------------------------------------- */
    state = {

        dom_loaded:     'state--dom-loaded',
        window_loaded:  'state--window-loaded',

    };





    /*    G L O B A L  V A R S
    ---------------------------------------- */

    var window_height        = $(window).outerHeight(),
        image_width,
        image_height,
        latest_known_scrollY = 0,
        ticking              = false,
        isMobile             = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);





    /*    H E R O  F U N C T I O N
    ---------------------------------------- */

    // push content down when there's a hero image
    function push_content_hero() {
        // move hero down the height of the header
        select.$header_hero.css({ 'marginTop' : select.$page_head.outerHeight() });
        if (!isMobile) {
            // when the hero is fixed, push page-wrap down
            $('.page--has-hero .page-wrap').css({ 'top' : (select.$header_hero.outerHeight() + select.$page_head.outerHeight()) });
        }
    }





    /*    S L I D E R  F U N C T I O N
    ---------------------------------------- */

    var slide_animation = function() {

        // set the first slide to be active by default
        if(select.$active_slide.length === 0) {
            select.$active_slide = $('.slide:first');
        }

        // remove the active class
        select.$active_slide.removeClass('active');

        // if the active slide has a sibling, add the active class to the sibling,
        // otherwise add active to the first slide
        if(select.$active_slide.next('li').length > 0) {
            select.$active_slide.next('li').addClass('active');
        } else {
            $('.slide:first').addClass('active');
        }
    };

    // trigger slider animations
    setInterval(function() { slide_animation(); }, 5000);





    /*    D E V I C E  T E S T
    ---------------------------------------- */

    if (isMobile) {
        select.$html.addClass('browser--handheld');
    } else {
        select.$html.addClass('browser--desktop');
    }





    /*    D O M  M O D I F Y
    ---------------------------------------- */

    // add a dom loaded class to the html to trigger css animations
    select.$body.addClass(state.dom_loaded);

    // fix height of pages with slider content for loading overlay
    select.$has_hero.height(window_height).css({ 'overflow' : 'hidden' });





    /*    F A L L B A C K  S U P P O R T
    ---------------------------------------- */

    // switch the svg logo for a png if svg isn't supported
    if (!Modernizr.svg) {
        // select.$logo.attr("src", "/public/src/img/logo.png");
    }





    /*    L O A D
    ---------------------------------------- */

    $(window).load(function() {

        // add window_loaded class to the body
        select.$body.addClass(state.window_loaded);

        // init functions
        push_content_hero();

    });





    /*    R E S I Z E
    ---------------------------------------- */

    $(window).resize(function() {

        // recalculate sizes etc.
        push_content_hero();

    });





    /*    S C R O L L  E V E N T
    ---------------------------------------- */

    // callback for scroll event - just keeps track of the last scroll value
    function onScroll() {
        latest_known_scrollY = window.scrollY;
        requestTick();
    }

    // calls rAF if it's not already
    function requestTick() {
        if(!ticking) {
            requestAnimationFrame(update);
        }
        ticking = true;
    }

    // update values and do stuff with them
    function update() {
        // get current scroll position
        var current_scrollY = latest_known_scrollY;

        // as the user scrolls down, slowly move parallax elements
        if (current_scrollY > 1 && !isMobile) {
            // set parallax speeds
            hook.jsParallax.css({ 'top' : 1-(current_scrollY/5) + 'px' });
            hook.jsParallaxLG.css({ 'top' : 1-(current_scrollY/3) + 'px' });
        } else if (!isMobile) {
            // else reset them
            hook.jsParallax.css({ 'top' : '0px' });
            hook.jsParallaxLG.css({ 'top' : '0px' });
        }

        // if window scrolls past (header_hero + 200) & isn't mobile
        if (current_scrollY > (select.$header_hero.outerHeight() + 200) && !isMobile) {
            // stop parallax vars
            hook.jsParallax.css({ 'top' : 1-((select.$header_hero.outerHeight() + 300)/5) + 'px' });
            hook.jsParallaxLG.css({ 'top' : 1-((select.$header_hero.outerHeight() + 300)/3) + 'px' });
        } else if (!isMobile) {

        }

        // allow further rAFs to be called
        ticking = false;

    }

    // listen for scroll event and run function
    window.addEventListener('scroll', onScroll, false);





    /*    H E L L O  M E S S A G E
    ---------------------------------------- */

    if(window.console) {
        window.console.info("-----\nHey there nosey!\nAny questions?\nEmail me at mail@samking.co, or tweet me @samkingphoto!\nhttp://samking.co\n-----");
    }





    /*    3 R D  P A R T Y  P L U G I N S
    ---------------------------------------- */

    // Unveil
    hook.jsUnveil.unveil(200);

    // FitVids
    hook.jsFitVid.fitVids();

});
