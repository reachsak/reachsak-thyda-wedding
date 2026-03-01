$(document).ready(function () {
  let clock;

  // Wedding date
  let targetDate = moment.tz("2026-05-03 00:00", "Asia/Phnom_Penh");

  // Difference in seconds
  let diff = targetDate.unix() - moment().unix();

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
  }
});
