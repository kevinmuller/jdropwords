```

         ,---._
       .-- -.' \     ,---,                                            .---.
       |    |   :  .'  .' `\                     ,-.----.            /. ./|                       ,---,
       :    ;   |,---.'     \   __  ,-.   ,---.  \    /  \       .--'.  ' ;   ,---.    __  ,-.  ,---.'|
       :        ||   |  .`\  |,' ,'/ /|  '   ,'\ |   :    |     /__./ \ : |  '   ,'\ ,' ,'/ /|  |   | :  .--.--.
       |    :   ::   : |  '  |'  | |' | /   /   ||   | .\ : .--'.  '   \' . /   /   |'  | |' |  |   | | /  /    '
       :         |   ' '  ;  :|  |   ,'.   ; ,. :.   : |: |/___/ \ |    ' '.   ; ,. :|  |   ,',--.__| ||  :  /`./
       |    ;   |'   | ;  .  |'  :  /  '   | |: :|   |  \ :;   \  \;      :'   | |: :'  :  / /   ,'   ||  :  ;_
   ___ l         |   | :  |  '|  | '   '   | .; :|   : .  | \   ;  `      |'   | .; :|  | ' .   '  /  | \  \    `.
 /    /\    J   :'   : | /  ; ;  : |   |   :    |:     |`-'  .   \    .\  ;|   :    |;  : | '   ; |:  |  `----.   \
/  ../  `..-    ,|   | '` ,/  |  , ;    \   \  / :   : :      \   \   ' \ | \   \  / |  , ; |   | '/  ' /  /`--'  /
\    \         ; ;   :  .'     ---'      `----'  |   | :       :   '  |--"   `----'   ---'  |   :    :|'--'.     /
 \    \      ,'  |   ,.'                         `---'.|        \   \ ;                      \   \  /    `--'---'
  "---....--'    '---'                             `---`         '---"                        `----'
```
==========

### JDropWords V-0.1

JDropWords is a word game written in jQuery. You have to drag and drop the correct words to fill the blanks. The answer of the game is given through a json object, either retrieved through an ajax call, or given at the instantiation.
This plugin requires a copy of jQuery.

See a demo : http://www.enova-tech.net/jdropwords


### How do I install JDropWords ?

Installing JDropWords is very easy. Starting from the fact that you already know html and css, you just have to integrate to your web page the JDropWords script, and to give it some custom parameters to make it work the way you want it (ajax functions, etc..). Using JDropWords is very simple even though it is highly customizable.

Your html code should look like the one below :
```html
<div class="jdropwords">
    <div class="blanks">
        <p>bonjour, je m'<span class="blank" id="123-456-789"></span> Christian</p>
        <p><span class="blank" id="223-456-789"></span> ca va ?</p>
        <p>Tu <span class="blank" id="323-456-789"></span> où ?</p>
        <p>J'<span class="blank" id="423-456-789"></span> à Marseille, mais j'<span class="blank" id="523-456-789"></span> à Paris.</p>
    </div>
    <ul class="words">
        <li class="word" id="123-456-780">appelle</li>
        <li class="word" id="223-456-780">Comment</li>
        <li class="word" id="323-456-780">habites</li>
        <li class="word" id="423-456-780">habite</li>
        <li class="word" id="523-456-780">étudie</li>
    </ul>
    <div class="actions">
        <a href="#" class="button reset">Reset</a>
        <a href="#" class="button submit">Submit</a>
    </div>
</div>
```

Once you have a proper html code showing your list, you are just two step away.

First, it is necessary to include jQuery libraries on your page.
After what we integrate the JDropWords script and the css file :
```html
<script src="js/jquery-1.8.3.min.js"></script>
<script src="js/jquery-ui-1.9.2.custom.min.js"></script>
<script src="js/jdropwords.js"></script>
<link type="text/css" rel="stylesheet" href="css/jdropwords.css" media="all" />
```

In this state, the game is ready to work. You just need to call the script in the header of your page.

```javascript
<script>
    $(function(){
        $('.jdropwords').jDropWords({
            answers : "http://your-server.com/jdropwords/answers.json"
        });
    });
</script>
```
or, if you want to give the answers directly in the call (without ajax).

```javascript
<script>
    $(function(){
        $('.jdropwords').jDropWords({
            answers : {
             "123-456-789" : "123-456-780",
             "223-456-789" : "223-456-780",
             "323-456-789" : "323-456-780",
             "423-456-789" : "423-456-780"
             }
        });
    });
</script>
```

### What are the available configuration options ?

JDropWords has a lot of different configuration options. They are listed below with their default values.

```
hoverClass : "drop-hover"                      // class to put on the blank element when the word is dragged over.
droppedClass : "dropped"                       // class to put on the blank element when the word is dropped.
errorClass : "error"                           // class to apply on the blank element when there is an error (after correction).
successClass : "success"                       // class to apply on the blank element when the answer is right (after correction).
beforeDrop : null                              // callback function before drop.
afterDrop : null                               // callback function after drop.
afterCorrection : null                         // callback function after correction.
submitAjax : false                             // whether the answers should be submitted through ajax.
submitAjaxUrl : ""                             // url to submit the answers to.
submitAjaxExtraParams : {},                    // extra parameters to pass with the answers (test id for instance).
feedbacks : {                                  // Feedback to display at the correction (with keys given in percent).
  50 : "Low score, please try again.",
  80 : "Not perfect, but good.",
  100 : "Bravo ! You nailed it."
},
answers : null                                 // Answers. Either a url or a json object.
```

You can have fun playing around with the different options.