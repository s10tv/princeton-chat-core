class TimeDifferenceCalculator {
  static calculate(current, previous, withAgo) {
    var msPerSecond = 1000;
    var msPerMinute = msPerSecond * 60;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerWeek = msPerDay * 7;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
      return 'Now'
    }
    var ago = withAgo ? ' ago' : '';

    if (elapsed < msPerHour) {
      var num = Math.round(elapsed/msPerMinute)
      var tag = num > 1 ? 'minutes' : 'minute';
      return `${num} ${tag}${ago}`;
    }

    else if (elapsed < msPerDay ) {
      var num = Math.round(elapsed/msPerHour)
      var tag = num > 1 ? 'hours' : 'hour';
      return `${num} ${tag}${ago}`;
    }

    else if (elapsed < msPerWeek) {
      var num = Math.round(elapsed/msPerDay)
      var tag = num > 1 ? 'days' : 'day';
      return `${num} ${tag}${ago}`;
    }

    else {
      var num = Math.round(elapsed/msPerWeek)
      var tag = num > 1 ? 'weeks' : 'week';
      return `${num} ${tag}${ago}`;
    }
  }
}

this.TimeDifferenceCalculator = TimeDifferenceCalculator;
