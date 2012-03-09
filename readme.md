Zen Your Own Adventure
======================



What is ZYOA?
-------------

ZYOA is a _simple_ little framework for writing branching-narratives (also known as [gamebooks][]; for example, the Choose Your Own Adventure series) in HTML, a little css, and as much Javascript as one desires.

The framework itself is nothing but a bunch of Javascript helper-code to allow a specifically written (nothing arcane or complex) HTML `article` to _play-back_ its contents. It does so by going through the `article` in a predictable tree-like manner -- since all HTML code is a tree anyway -- where all the "leaves" are elements of the story, and printing them to the screen. Special functions also make jumping from one part of the tree to another, making the "branching" bit in branching-narrative possible. 

If it sounds complicated, it's only because you haven't emptied your mind sufficiently, grasshopper. Take, for example, the simple `article`:

    <article id='test-story'>
        <p>This is the first line of a story.</p>
        <p>Then this must be the <em>thrilling</em> climax.</p>
        <p>Because this is the end.</p>
    <article>
    
This simple little story would play out one after another upon each click. But some hop skip and jump would make it a lot more interesting:

    <article id='test-story'>
        <p id='start'>This is the first line of a story.</p>
        <p>Then this must be the <em>thrilling</em> climax.</p>
        <p class='stop'>You liked it, right? <a href="#" onClick="jump('#yes');">Yes?</a> <a href="#" onClick="jump('#no');">No?</a></p>
        <p id='yes' class='stop'>Good, good. <a href="#" onClick="jump('#start');">Come back any time</a>.</p>
        <p id='no'>Well! I guess you will be rushing to the library, then.</p>
    <article>
    
Don't let the sudden lengthening dissuade you, things are just getting...exciting.

Now, once the reader reaches the point of decision, the story would not progress automatically on clicking; the reader would have to make a choice. 

If the reader chooses "yes" he will get to read the story all over again after the next link. If the reader had chosen "no", the game would jump to that point, and end. Naturally, the `id`s identify elements for jumping around. And the `class`es alter the flow of the story: It wouldn't do if the reader could click anywhere during the moment of choice, and break our plot, would it?

Of course, there's more to ZYOA. But it's still pretty _simple,_ really, as simple as necessary, but maybe not simpler...which sounds like a good excuse to have.



Can I see for myself, please?
-----------------------------

Why, of course. Direct yourself to the [demo][] while I meditate.



How do I go about writing stories-- er... "branching-narratives" with ZYOA?
---------------------------------------------------------------------------

I'm glad you asked. This could take a while. Why not have some momos while I get the study-material ready? 

Or you could go through the [source][] for the demo should you wish, although it might use do a few custom things which could get in the way.

**There's also a template [jsFiddle][] for quickly getting started writing ZYOA stories.**



[gamebooks]:    http://en.wikipedia.org/wiki/Gamebook                   "The Wikipedia article for gamebooks."
[demo]:         http://5310.github.com/zyoa/                            "A demo story written using ZYOA."
[source]:       https://github.com/5310/zyoa/blob/master/index.html     "Source for the demo story."
[jsFiddle]:     http://jsfiddle.net/Scio/9H8Tf/                         "ZYOA Template jsFiddle."
