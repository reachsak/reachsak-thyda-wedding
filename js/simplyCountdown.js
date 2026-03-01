/*!
 * Project : simply-countdown (customized for Reachsak & Thyda)
 * Auto countdown target: 2026-05-03 00:00 (local time)
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
        // 🎯 TARGET DATE
        year: 2026,
        month: 5,
        day: 3,
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

    var targetDate = new Date(
      parameters.year,
      parameters.month - 1,
      parameters.day,
      parameters.hours,
      parameters.minutes,
      parameters.seconds,
    );

    Array.prototype.forEach.call(cd, function (countdown) {
      var fullCountDown = createElements(parameters, countdown);
      var interval;

      var refresh = function () {
        var now = new Date();
        var secondsLeft = (targetDate.getTime() - now.getTime()) / 1000;

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

        var dayWord =
          days === 1
            ? parameters.words.days
            : parameters.words.days + parameters.words.pluralLetter;

        var hourWord =
          hours === 1
            ? parameters.words.hours
            : parameters.words.hours + parameters.words.pluralLetter;

        var minuteWord =
          minutes === 1
            ? parameters.words.minutes
            : parameters.words.minutes + parameters.words.pluralLetter;

        var secondWord =
          seconds === 1
            ? parameters.words.seconds
            : parameters.words.seconds + parameters.words.pluralLetter;

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

      refresh();
      interval = window.setInterval(refresh, parameters.refresh);
    });
  };

  exports.simplyCountdown = simplyCountdown;
})(window);

/**
 * AUTO INIT
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
        var el = document.querySelector(".simply-countdown");
        if (el) {
          el.innerHTML = "<h2>Today is the big day! 💍</h2>";
        }
      },
    });
  }
});
