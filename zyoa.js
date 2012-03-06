// ### Some jQuery extensions.

jQuery.fn.outerHTML = function() {
    var s = $(this).clone().wrap('<div>').parent().html();
    return s;
};

jQuery.fn.appendAll= function(s) {
    $(this).append(s.outerHTML());
};

jQuery.fn.tag = function() {
    return $(this).get(0).tagName;
};



// ### Lowish level tree traversal functions. ZYOA specific, though.

// The active node inside the tree. Always a leaf.
var node;

// Moves to the bottom-most node, traversing through `section` elements. 
// All else is considered leaves.
var down = function() {
    if (node.tag() == 'SECTION' || node.tag() == 'ARTICLE') {
        node = node.children().first();
        down();
    }
    if (node === undefined) {
        return false;
    } else {
        return true;
    }
};

// Moves up the tree to the next leaf-node, but not over the root `article` element.
var up = function() {
    if (node.tag() != 'ARTICLE') {
        node = node.parent();
        return true;
    } else {
        return false;
    }
};

// Moves to the next leaf-node, if there is any, and not beyond the root `article` tag.
var next = function() {
    if (node.tag() == 'ARTICLE')
        return false;
    if (node.get(0) != node.parent().children().last().get(0)) {
        node = node.next();
        return true;
    } else {
        return false;
    }
};

// ### Internal story-tree functions.

//Iterates through the story-tree, finding one element after another.
var iterate = function() {
    if (next()) {
        return down();
    } else {
        if (up()) {
           return iterate();
        } else {
           return false;
        }
    }
};

// Evaluates what to do with the current element.
var evaluate = function() {
    if (node.tag() == 'SCRIPT') {
        // Yes, I know, "the `Function` constructor is `eval`, and therefore, _evil_." Deal with it.
        var temporary_function = new Function(node.html());
        temporary_function();
    } else {
        if (node.hasClass("skip"))
            move();
        else
            display();
        if (node.hasClass("stop"))
            stop = true;
        else
            stop = false;            
    }
};

// Durations for show-and-hide animation used throughout.
var hide_duration = 250;
var show_duration = 250;

// Only processes and draws elements.
var write = function() {    
    // Put the raw HTML into a variable for ease of use.
    var data = node.outerHTML();
    
    // Regex is a canine of the female persuation. Useful though.
    // Matches `id` attributes.
    var re_id = new RegExp("(id=[\"|\']\s*[^\"|^\']*?\s*[\"|\'])", 'g'); //TODO: Make sure matched `id`s are inside angular brackets!
    
    // Use format string by the regexes above.
    data = data.replace(re_id, ''); 
    
    // Then append the cleaned up element.
    $('#zyoa').append(data);
    
    // Immediately hide the added element, but then reveal it slowly.
    $('#zyoa').children().last().hide().show(show_duration);
};

// Scrolls to the newest element.
var scroll = function(selector) {
    var top = $('#zyoa').children().last().offset().top-50;
    if ($('#zyoa').children().eq(-2).hasClass('transient'))
        top = $('#zyoa').children().eq(-2).offset().top-50;
    
    if(!$('#zyoa').children().last().hasClass('donotscroll')) {
        $('html, body').animate({
            scrollTop: top
        }, 250);
    }
};

// Writes elements to screen after processing them.
var display = function() {
    
    // First, alter the previous element as needed.
    
    // Remove click-to-movability from previously added element.
    $('#zyoa').children().removeClass('move');
    
    // Remove all `a` links, unless designated as permanent.
    $('#zyoa').children().find('a:not(.permanent)').contents().unwrap(); //NOTE: If this isn't helping, unoptimize.
    
    // Hide last element if it's marked as transient.
    $('#zyoa').find('.transient').hide(hide_duration); //NOTE: It this is costly, optimize.
    
    // Now to add the current element!
    write();
    
    // And scroll to it.
    scroll();
    
    // Don't forget to re-apply click-to-movability!
    if (doclicktomove)
        $('#zyoa').children().last().addClass("move");
};

// Remove links that can only be clicked once.
$('#zyoa').find('a').live("click", function() { 
    if ($(this).hasClass('once'))
        $(this).contents().unwrap();
});





// ### These are the exposed functions for controlling story progression.

// Jumps to the specified `id`, if possible, though.
var jump = function(id) {
    node = $(id);
    if (down()) {
        display();
        done = false;
        return true;    
    }
};

// Flag to see if the story-tree has finished.
var done = true;

// Moves to the next story-element.
var move = function() {
    if (!done) {
        if(iterate())
            evaluate();
        else
            done = true;
    }
};

// Displays element specified by the `id` as an aside, without moving from the current position in the story.
var aside = function(id) {
    // Remember previous state, as relevant.
    var temp_node = node;
    // Make the jump.
    node = $(id);
    if (down())
        write();   
    // Then restore previous state.
    node = temp_node;
}



// ### Make the story progress by click-to-move.

// A global flag to know when to automatically add `.move` to elements.
var doclicktomove = true;
// A flag to know when not to interfere with clicks by moving with the story.
var stop = false;

// Set up necessary event-handlers to implement click-to-move.
var clicktomove = function() {
    // But live() is supposedly deprecated, what else shall I use as on() doesn't work for future elements?
    // Progress story if any element with class `move` is clicked.
    $('#zyoa > .move').live("click", function() { 
        if (!stop)
            move();
    });
    // All `a` elements can be clicked without progressing the story.
    $('#zyoa > .move').find('a').live("click", function(e) { 
        e.stopPropagation();
    });
    // All other elements would have to be explicitly marked to stop if clickable but should not progress the story.
    $('#zyoa').find('.stop').live("click", function(e) { 
        e.stopPropagation();
    });
}();

// Toggles click-to-move.
var toggle_clicktomove = function() {
    doclicktomove = !doclicktomove;
}


// ### The actual start function.

var start = function(story_id, clicktomove_flag) { // And a book_id for later. 
    if (clicktomove_flag === false)
        toggle_clicktomove();
	jump(story_id);
}
