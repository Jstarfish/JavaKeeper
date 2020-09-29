var typeToPos = {
  year: 0,
  month: 1,
  day: 2,
  hour: 3,
  minute: 4,
  second: 5
};
var ms = 'ms';
export default (function (o, c, d) {
  var localUtcOffset = d().utcOffset();

  var tzOffset = function tzOffset(timestamp, timezone) {
    var date = new Date(timestamp);
    var dtf = new Intl.DateTimeFormat('en-US', {
      hour12: false,
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    var formatResult = dtf.formatToParts(date);
    var filled = [];

    for (var i = 0; i < formatResult.length; i += 1) {
      var _formatResult$i = formatResult[i],
          type = _formatResult$i.type,
          value = _formatResult$i.value;
      var pos = typeToPos[type];

      if (pos >= 0) {
        filled[pos] = parseInt(value, 10);
      }
    }

    var utcString = filled[0] + "-" + filled[1] + "-" + filled[2] + " " + filled[3] + ":" + filled[4] + ":" + filled[5] + ":000";
    var utcTs = d.utc(utcString).valueOf();
    var asTS = +date;
    var over = asTS % 1000;
    asTS -= over;
    return (utcTs - asTS) / (60 * 1000);
  };

  var fixOffset = function fixOffset(localTS, o0, tz) {
    var utcGuess = localTS - o0 * 60 * 1000;
    var o2 = tzOffset(utcGuess, tz);

    if (o0 === o2) {
      return [utcGuess, o0];
    }

    utcGuess -= (o2 - o0) * 60 * 1000;
    var o3 = tzOffset(utcGuess, tz);

    if (o2 === o3) {
      return [utcGuess, o2];
    }

    return [localTS - Math.min(o2, o3) * 60 * 1000, Math.max(o2, o3)];
  };

  var proto = c.prototype;

  proto.tz = function (timezone) {
    var target = this.toDate().toLocaleString('en-US', {
      timeZone: timezone
    });
    var diff = Math.round((this.toDate() - new Date(target)) / 1000 / 60);
    return d(target).utcOffset(localUtcOffset - diff, true).$set(ms, this.$ms);
  };

  d.tz = function (input, timezone) {
    var previousOffset = tzOffset(+d(), timezone);
    var localTs;

    if (typeof input !== 'string') {
      // timestamp number || js Date || Day.js
      localTs = d(input) + previousOffset * 60 * 1000;
    }

    localTs = localTs || d.utc(input).valueOf();

    var _fixOffset = fixOffset(localTs, previousOffset, timezone),
        targetTs = _fixOffset[0],
        targetOffset = _fixOffset[1];

    var ins = d(targetTs).utcOffset(targetOffset);
    return ins;
  };

  d.tz.guess = function () {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };
});