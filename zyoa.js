jQuery.fn.tag = function() {
    return $(this).get(0).tagName;
};

var node, done = true;

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
    console.log(node.html());
};

var evaluate = function() {
    if (node.tag() == 'SCRIPT') {
        // Yes, I know, "the `Function` constructor is `eval`, and therefore, _evil_." Deal with it.
        var temporary_function = new Function(node.html());
        temporary_function();
    } else {
        display();
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

$(document).click(function() {
    move();
});