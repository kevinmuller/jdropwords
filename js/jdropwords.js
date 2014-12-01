jQuery.fn.jDropWords = function(options) {

  // Default settings.
  var defaults = {
    hoverClass : "drop-hover",
    droppedClass : "dropped",
    errorClass : "error",
    successClass : "success",
    beforeDrop : null,
    afterDrop : null,
    afterCorrection : null,
    submitAjax : false,
    submitAjaxUrl : "",
    submitAjaxExtraParams : {},
    feedbacks : {
      50 : "Low score, please try again.",
      80 : "Not perfect, but good.",
      100 : "Bravo ! You nailed it."
    },
    answers : null
  };

  var settings = $.extend( {}, defaults, options );

  /**
   * Drop a source element into a target element.
   *
   * @param srcElt
   *   jQuery source element.
   * @param targetElt
   *   jQuery target element.
   */
  function dropElement(srcElt, targetElt) {
    // Removes droppable.
    srcElt.draggable( "disable" );
    //srcElt.prepend(targetElt);
    var droppedElt = getDroppedElement(srcElt);
    droppedElt.prependTo(targetElt);
    targetElt.addClass("active");
    srcElt.hide();
  }

  /**
   * Generate and return a dropped element.
   *
   * A dropped element is different from a dragged one, since it also
   * contains a close button.
   *
   * @param srcElt
   *   source element
   * @returns {jQuery|HTMLElement}
   *   JQuery element.
   */
  function getDroppedElement(srcElt) {
    var html = '<div class="' + settings.droppedClass + ' clearfix" rel="' + srcElt.attr('id') + '">' +
      '<span>' + srcElt.html() + '</span>' +
      '<div class="action"><a href="#" class="close">x</a></div>' +
      '</div>';
    var container = $(html);
    $('a', container).click(function() {
      container.parent().removeClass('active');
      resetDraggableElement(srcElt);
      container.remove();
    });
    return container;
  }

  /**
   * onDrop callback.
   *
   * @param event
   * @param ui
   */
  function onDrop ( event, ui ) {
    // Before drop callback.
    if (settings.beforeDrop && jQuery.isFunction(settings.beforeDrop)) {
      settings.beforeDrop(event, ui);
    }
    dropElement($('.ui-draggable-dragging'), $(this));

    // After drop callback.
    if (settings.onDrop && jQuery.isFunction(settings.onDrop)) {
      settings.afterDrop(event, ui);
    }
  }

  /**
   * Reset a draggable element.
   *
   * @param elt
   */
  function resetDraggableElement(elt) {
    elt.show();
    elt.draggable( "enable" );
  }


  /**
   * Reset app in its initial state.
   *
   * @param appContainer
   */
  function reset(appContainer) {
    $( ".word", appContainer).each(function() {
      $(this).draggable( "disable" );
      resetDraggableElement($(this));
    });
    $( ".blank", appContainer).html("");
    $( ".blank", appContainer).removeClass("active");
    $('.blanks p .blank', appContainer)
      .removeClass('error')
      .removeClass('success');
    $('.feedback', appContainer).remove();
    $('.overlay', appContainer).remove();
    // Reactivate submit button.
    $(".submit", appContainer).removeAttr("disabled");
  }

  /**
   * Init app.
   *
   * @param appContainer
   */
  function init(appContainer) {
    $( ".word", appContainer).draggable({
      containment: appContainer,
      revert: true
    });

    // Check size of the biggest sentence.
    var maxWidth = 0;
    $( ".word", appContainer).each(function() {
      var eltWidth = $(this).width();
      if (eltWidth > maxWidth) {
        maxWidth = eltWidth;
      }
    });

    $( ".blank", appContainer).each(function() {
      initBlank($(this));
      // Adjust size of the blanks to match the maximum word.
      $(this).width(maxWidth);
    });

    $(".submit", appContainer).click(function() {
      // If button is disabled, do not process.
      if ($(this).attr("disabled") == "disabled") {
        return false;
      }
      // Else, perform correction.
      doCorrection(appContainer);
    });

    $(".reset", appContainer).click(function() {
      // If button is disabled, do not process.
      if ($(this).attr("disabled") == "disabled") {
        return false;
      }
      // Else, perform reset.
      reset(appContainer);
    });
  }

  /**
   * Init a blank area (droppable area).
   *
   * @param jQuery obj blankElt
   *   a blank element. (container to receive a filling).
   */
  function initBlank(blankElt) {
    blankElt.droppable({
      drop: onDrop,
      hoverClass: settings.hoverClass
    });
  }

  /**
   * Perform a correction.
   *
   * @param json answers
   *   answers json object
   * @param appContainer
   *   appContainer
   */
  function doCorrection(appContainer) {
    var answers = settings.answers;
    // If answers is a string, it is a url, we make a call to the server.
    if (typeof answers == 'string' || answers instanceof String) {
      $.get( answers, function( data ) {
       checkAnswers(data, appContainer);
      }, "json" );
    }
    // if answers is a json object, we read directly from it.
    else {
      checkAnswers(answers, appContainer);
    }
    $(".submit", appContainer).attr("disabled", "disabled");
  }

  /**
   * Check answers according to the answers object.
   *
   * Check each answer and apply the corresponding class as defined in settings.
   * Also calculate the score and display it. (+ call the callback function if defined).
   *
   * @param jQuery Obj activity appContainer.
   *   the container for the app.
   */
  function checkAnswers(answers, appContainer) {
    var score = 0;
    var nbQuestions = 0;
    var animUpDuration = 75;
    var animDownDuration = 100;
    var totalAnimDuration = animUpDuration + animDownDuration;
    // Delay to add before each animation starts.
    var delay = 0;

    $('.blanks p .blank', appContainer).each(function() {
      var blankId = $(this).attr("id");
      var dropped = $("." + settings.droppedClass, $(this));
      var expected = answers[blankId];
      var actual = dropped.attr("rel");
      var className = settings.errorClass;
      if (actual == expected) {
        className = settings.successClass;
        score ++;
      }

      // For all filled blanks, add a small animation before adding the class.
      // Up and Down animation. The color is added after the element goes up,
      // and before it goes down.
      var blank = $(this);
      if (dropped.length) {
        var posTop = parseInt(dropped.css('top'));
        dropped
          .delay(delay)
          .animate({'top': (posTop - 7) + "px"},
          {
            duration : 75,
            queue : true,
            complete : function() {
              blank.addClass(className);
            }
          }
        )
          .animate({'top': posTop + "px"}, {duration : 100, queue : true});
        delay += totalAnimDuration;
      }
      else {
        $(this).addClass(className);
      }
      nbQuestions++;
    });

    // Display score.
    setTimeout(function() {
        displayScore(appContainer, score, nbQuestions);
    },
    delay + totalAnimDuration);
    blockApp(appContainer);

    // After correct callback.
    if (settings.afterCorrection && jQuery.isFunction(settings.afterCorrection)) {
      settings.afterCorrection(score, nbQuestions);
    }

    // Submit results through ajax (post).
    if (settings.submitAjax) {
      var postParams = {
        score : score,
        nbqst : nbQuestions
      }
      postParams = $.extend( {}, postParams, settings.submitAjaxExtraParams );
      $.post(settings.submitAjaxUrl, postParams);
    }
  }

  /**
   * Display score.
   *
   * @param appContainer
   *   appContainer.
   * @param score
   *   score
   * @param nbQst
   *   number of questions.
   */
  function displayScore(appContainer, score, nbQst) {
    // Get score element.
    var scoreHtml = getScoreElement();
    var scoreElt = $(scoreHtml);
    appContainer.prepend(scoreElt);
    scoreElt.show();

    var percent = Math.round(score / nbQst * 100);
    var feedbackText = null;
    for (i in settings.feedbacks) {
      if (percent <= i) {
        feedbackText = settings.feedbacks[i];
        break;
      }
    }
    drawCircle(35, 35, score + "/" + nbQst, function() {
      $(".feedback p").text(feedbackText);
    });
  }

  function blockApp(appContainer) {
    $('.words', appContainer).prepend('<div class="overlay"></div>');
    $('.blanks', appContainer).prepend('<div class="overlay"></div>');
  }

  /**
   * Get score and feedback html element.
   *
   * @returns string {string}
   */
  function getScoreElement() {
    var html = '<div class="feedback clearfix" style="display: none;">' +
      '<p></p>' +
      '<div class="score">' +
        '<canvas id="score-canvas" width="70" height="70"></canvas>' +
      '</div>' +
    '</div>';
    return html;
  }

  /**
   * Draw a circle in a canvas.
   *
   * Mainly used for score display.
   *
   * @param int x
   *   offset x
   * @param y
   *   offset y
   * @param text
   *   text to display in the middle
   * @param callback
   *   callback
   */
  function drawCircle(x, y, text, callback) {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;

    var canvas = document.getElementById('score-canvas');
    var context = canvas.getContext('2d');
    var circles = [];

    var radius = 30;
    var endPercent = 101;
    var curPerc = 0;
    var counterClockwise = false;
    var circ = Math.PI * 2;
    var quart = Math.PI / 2;
    var speed = 4;

    context.lineWidth = 10;
    context.strokeStyle = '#286090';
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    function doText(context, x, y, text) {
      context.lineWidth = 1;
      context.fillStyle = "#000000";
      context.lineStyle = "#286090";
      context.font = "24px Arial";
      context.fillText(text, x - 17, y + 7);
    }

    function animate(current) {
      context.lineWidth = 10;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.beginPath();
      context.arc(x, y, radius, -(quart), ((circ) * current) - quart, false);
      context.stroke();
      curPerc+=speed;
      if (circles.length) {
        for (var i = 0; i < circles.length; i++) {
          context.lineWidth = 10;
          context.beginPath();
          context.arc(circles[i].x, circles[i].y, radius, -(quart), ((circ) * circles[i].curr) - quart, false);
          context.stroke();
          doText(context, circles[i].x, circles[i].y, circles[i].text);
        }
      }
      if (curPerc < endPercent) {

        requestAnimationFrame(function () {
          animate(curPerc / 100)
        });
      } else {
        var circle = {
          x: x,
          y: y,
          curr: current,
          text: text
        };
        circles.push(circle);
        doText(context, x, y, text);
        if (callback) callback.call();
      }
    }
    animate();
  }

  // Init application.
  return this.each(function() {
    var appContainer = $(this);
    init(appContainer);
  });
};
