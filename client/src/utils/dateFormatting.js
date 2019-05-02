import React  from 'react';
import Moment from 'react-moment';
import moment from 'moment';

const CONFIG_ORIG = moment().locale("en").localeData()._relativeTime;

export const standard = date => {
  moment.updateLocale("en", { relativeTime: CONFIG_ORIG });
  return moment.utc(date).local().format("YYYY/MM/DD HH:mm:ss");
}

/*export const StandardDate = ({date}) => (
  <Moment format="YYYY/MM/DD HH:mm:ss">{date}</Moment>
)*/

export const LongNowDate = ({date}) => (
  <Moment fromNow>{date}</Moment>
)

export const ShortNowDate = ({date}) => (
  <Moment fromNow ago>{date}</Moment>
)

export default LongNowDate;
