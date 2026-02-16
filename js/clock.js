$(document).ready(function () {
  let clock;

  let currentDate = new Date();

  // Wedding date
  let targetDate = moment.tz("2026-06-19 00:00", "Asia/Phnom_Penh");

  let diff = targetDate / 1000 - currentDate.getTime() / 1000;

  if (diff <= 0) {
    clock = $(".clock").FlipClock(0, {
      clockFace: "DailyCounter",
      countdown: true,
      autostart: false,
    });
    console.log("Date has already passed!");
  } else {
    clock = $(".clock").FlipClock(diff, {
      clockFace: "DailyCounter",
      countdown: true,
      callbacks: {
        stop: function () {
          console.log("Timer has ended!");
        },
      },
    });

    setTimeout(checktime, 1000);

    function checktime() {
      let t = clock.getTime();
      if (t <= 0) clock.setTime(0);
      setTimeout(checktime, 1000);
    }
  }
});
