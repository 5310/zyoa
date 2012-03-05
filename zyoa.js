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

var node, done = true;

var clicktomove = true, interactive = false;

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

var up = function() {
    if (node.tag() != 'ARTICLE') {
        node = node.parent();
        return true;
    } else {
        return false;
    }
};

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

var jump = function(id) {
    node = $(id);
    if (down()) {
        display();
        done = false;
        return true;    
    }
};

var display = function() {
    // Remove click-to-movability from previously added element.
    $('#zyoa').children().last().removeClass('move');
    // Remove all `a` links, unless designated as permanent.
    $('#zyoa').children().last().find('a:not(.permanent)').contents().unwrap(); //NOTE: If this isn't helping, unoptimize.
    // Hide last element if it's marked as transient.
    $('#zyoa').find('.transient').hide(); //NOTE: It this is costly, optimize.
    // Now to add the current element. But first, let's remove `id`s!
    // Put the raw HTML into a variable for ease of use.
    var data = node.outerHTML();
    // Regex is a canine of the female persuation. Useful though.
    var regex = new RegExp("(id=[\"|\']\s*[^\"|^\']*?\s*[\"|\'])", 'g'); //TODO: Make sure matched `id`s are inside angular brackets!
    // Use regex to remove `id`s from the raw HTML.
    data = data.replace(regex, ''); 
    // Then append the cleaned up element.
    $('#zyoa').append(data);
    // Don't forget to reapply click-to-movability!
    $('#zyoa').children().last().addClass("move");
};

var evaluate = function() {
    if (node.tag() == 'SCRIPT') {
        // Yes, I know, "the `Function` constructor is `eval`, and therefore, _evil_." Deal with it.
        var temporary_function = new Function(node.html());
        temporary_function();
    } else {
        if (node.hasClass("aside"))
            move();
        else
            display();
        if (node.hasClass("interactive"))
            interactive = true;
        else
            interactive = false;            
    }
};

var move = function() {
    if (!done) {
        if(iterate())
            evaluate();
        else
            done = true;
    }
};

$('.move').live("click", function() { // But live() is supposedly deprecated, what else shall I use as on() doesn't work for future elements?
    if (!interactive)
        move();
});

$('#zyoa > a').live("click", function() { 
    if ($(this).hasClass('once'))
        $(this).contents().unwrap();
});
