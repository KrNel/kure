import moment from 'moment';

const CONFIG_ORIG = moment().locale("en").localeData()._relativeTime;
const CONFIG_NEW = {
  future: "in %s",
  past: "%s ago",
  s: "secs",
  ss: "%ss",
  m: "a min",
  mm: "%dm",
  h: "1h",
  hh: "%dh",
  d: "a day",
  dd: "%dd",
  M: "month",
  MM: "%dM",
  y: "year",
  yy: "%dY"
};

export const long = date => {
  moment.updateLocale("en", { relativeTime: CONFIG_ORIG });
  return moment.utc(date).fromNow();
}

export const standard = date => {
  moment.updateLocale("en", { relativeTime: CONFIG_ORIG });
  return moment.utc(date).local().format("YYYY/MM/DD HH:mm:ss");
}

export const short = date => {
  moment.updateLocale("en", { relativeTime: CONFIG_NEW });
  return moment.utc(date).fromNow();
}

export default long;
