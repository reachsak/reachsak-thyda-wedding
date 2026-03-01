/*!
 * Project : simply-countdown (customized for Reachsak & Thyda)
 * Auto countdown target: 2026-06-19 00:00 (local time)
 * License : MIT
 */

/*global window, document*/
(function (exports) {
  "use strict";

  var extend, createElements, createCountdownElt, simplyCountdown;

  extend = function (out) {
    var i, obj, key;
    out = out || {};
    for (i = 1; i < arguments.length; i += 1) {
      obj = arguments[i];
      if (obj) {
        for (key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (
              typeof obj[key] === "object" &&
              obj[key] !== null &&
              !Array.isArray(obj[key])
            ) {
              out[key] = out[key] || {};
              extend(out[key], obj[key]);
            } else {
              out[key] = obj[key];
            }
          }
        }
      }
    }
    return out;
  };

  createCountdownElt = function (countdown, parameters, typeClass) {
    var innerSectionTag, sectionTag, amountTag, wordTag;

    sectionTag = document.createElement("div");
    amountTag = document.createElement("span");
    wordTag = document.createElement("span");
    innerSectionTag = document.createElement("div");

    innerSectionTag.appendChild(amountTag);
    innerSectionTag.appendChild(wordTag);
    sectionTag.appendChild(innerSectionTag);

    sectionTag.classList.add(parameters.sectionClass);
    sectionTag.classList.add(typeClass);
    amountTag.classList.add(parameters.amountClass);
    wordTag.classList.add(parameters.wordClass);

    countdown.appendChild(sectionTag);

    return {
      full: sectionTag,
      amount: amountTag,
      word: wordTag,
    };
  };

  createElements = function (parameters, countdown) {
    if (!parameters.inline) {
      return {
        days: createCountdownElt(countdown, parameters, "simply-days-section"),
        hours: createCountdownElt(
          countdown,
          parameters,
          "simply-hours-section",
        ),
        minutes: createCountdownElt(
          countdown,
          parameters,
          "simply-minutes-section",
        ),
        seconds: createCountdownElt(
          countdown,
          parameters,
          "simply-seconds-section",
        ),
      };
    }
    var spanTag = document.createElement("span");
    spanTag.classList.add(parameters.inlineClass);
    return spanTag;
  };

  simplyCountdown = function (elt, args) {
    var parameters = extend(
      {
        // defaults (can be overridden by args)
        year: 2026,
        month: 6,
        day: 19,
        hours: 0,
        minutes: 0,
        seconds: 0,
        words: {
          days: "day",
          hours: "hour",
          minutes: "minute",
          seconds: "second",
          pluralLetter: "s",
        },
        plural: true,
        inline: false,

        // IMPORTANT: use local time by default (better for wedding sites)
        enableUtc: false,

        onEnd: function () {
          return;
        },
        refresh: 1000,
        inlineClass: "simply-countdown-inline",
        sectionClass: "simply-section",
        amountClass: "simply-amount",
        wordClass: "simply-word",
        zeroPad: true,
      },
      args,
    );

    var cd = document.querySelectorAll(elt);
    if (!cd || cd.length === 0) return;

    var targetTmpDate = new Date(
      parameters.year,
      parameters.month - 1,
      parameters.day,
      parameters.hours,
      parameters.minutes,
      parameters.seconds,
    );

    var targetDate;
    if (parameters.enableUtc) {
      targetDate = new Date(
        targetTmpDate.getUTCFullYear(),
        targetTmpDate.getUTCMonth(),
        targetTmpDate.getUTCDate(),
        targetTmpDate.getUTCHours(),
        targetTmpDate.getUTCMinutes(),
        targetTmpDate.getUTCSeconds(),
      );
    } else {
      targetDate = targetTmpDate;
    }

    Array.prototype.forEach.call(cd, function (countdown) {
      var fullCountDown = createElements(parameters, countdown);
      var interval;

      var refresh = function () {
        var now = new Date();
        var secondsLeft;

        if (parameters.enableUtc) {
          // Build a "UTC-like" now date
          var nowUtc = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours(),
            now.getMinutes(),
            now.getSeconds(),
          );
          secondsLeft = (targetDate.getTime() - nowUtc.getTime()) / 1000;
        } else {
          secondsLeft = (targetDate.getTime() - now.getTime()) / 1000;
        }

        var days = 0,
          hours = 0,
          minutes = 0,
          seconds = 0;

        if (secondsLeft > 0) {
          days = parseInt(secondsLeft / 86400, 10);
          secondsLeft = secondsLeft % 86400;

          hours = parseInt(secondsLeft / 3600, 10);
          secondsLeft = secondsLeft % 3600;

          minutes = parseInt(secondsLeft / 60, 10);
          seconds = parseInt(secondsLeft % 60, 10);
        } else {
          window.clearInterval(interval);
          parameters.onEnd();
        }

        var dayWord, hourWord, minuteWord, secondWord;

        if (parameters.plural) {
          dayWord =
            days === 1
              ? parameters.words.days
              : parameters.words.days + parameters.words.pluralLetter;
          hourWord =
            hours === 1
              ? parameters.words.hours
              : parameters.words.hours + parameters.words.pluralLetter;
          minuteWord =
            minutes === 1
              ? parameters.words.minutes
              : parameters.words.minutes + parameters.words.pluralLetter;
          secondWord =
            seconds === 1
              ? parameters.words.seconds
              : parameters.words.seconds + parameters.words.pluralLetter;
        } else {
          dayWord = parameters.words.days;
          hourWord = parameters.words.hours;
          minuteWord = parameters.words.minutes;
          secondWord = parameters.words.seconds;
        }

        if (parameters.inline) {
          countdown.innerHTML =
            days +
            " " +
            dayWord +
            ", " +
            hours +
            " " +
            hourWord +
            ", " +
            minutes +
            " " +
            minuteWord +
            ", " +
            seconds +
            " " +
            secondWord +
            ".";
          return;
        }

        var pad = function (n) {
          var s = String(n);
          return parameters.zeroPad && s.length < 2 ? "0" + s : s;
        };

        fullCountDown.days.amount.textContent = pad(days);
        fullCountDown.days.word.textContent = dayWord;

        fullCountDown.hours.amount.textContent = pad(hours);
        fullCountDown.hours.word.textContent = hourWord;

        fullCountDown.minutes.amount.textContent = pad(minutes);
        fullCountDown.minutes.word.textContent = minuteWord;

        fullCountDown.seconds.amount.textContent = pad(seconds);
        fullCountDown.seconds.word.textContent = secondWord;
      };

      // Start immediately
      refresh();
      interval = window.setInterval(refresh, parameters.refresh);
    });
  };

  exports.simplyCountdown = simplyCountdown;
})(window);

/*global $, jQuery, simplyCountdown*/
if (window.jQuery) {
  (function ($, simplyCountdown) {
    "use strict";
    $.fn.simplyCountdown = function (options) {
      simplyCountdown(this.selector, options);
      return this;
    };
  })(jQuery, simplyCountdown);
}

/**
 * AUTO-INIT:
 * This makes the countdown run automatically on elements with class ".simply-countdown"
 * as soon as the DOM is ready, without needing another init file.
 */
document.addEventListener("DOMContentLoaded", function () {
  if (window.simplyCountdown) {
    window.simplyCountdown(".simply-countdown", {
      year: 2026,
      month: 5,
      day: 3,
      hours: 0,
      minutes: 0,
      seconds: 0,
      enableUtc: false,
      zeroPad: true,
      onEnd: function () {
        // optional: replace countdown with a message
        var el = document.querySelector(".simply-countdown");
        if (el) el.innerHTML = "<h2>Today is the big day! 💍</h2>";
      },
    });
  }
});
