import moment from 'moment';

moment.updateLocale('en', { relativeTime: {
  future: 'in %s',
  past: '%s ago',
  s:  'secs',
  ss: '%ss',
  m:  'a min',
  mm: '%dm',
  h:  '1h',
  hh: '%dh',
  d:  'a day',
  dd: '%dd',
  M:  'month',
  MM: '%dM',
  y:  'year',
  yy: '%dY'
}});

const DateFromNow = ({ date }) => (
  moment.utc(date).fromNow()
)

export default DateFromNow;
