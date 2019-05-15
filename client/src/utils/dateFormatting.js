import React  from 'react';
import Moment from 'react-moment';
import moment from 'moment';
import PropTypes from 'prop-types';

const CONFIG_ORIG = moment().locale("en").localeData()._relativeTime;

export const standard = date => {
  moment.updateLocale("en", { relativeTime: CONFIG_ORIG });
  return moment.utc(date).local().format("YYYY/MM/DD hh:mm:ss A");
}

export const LongNowDate = ({date}) => (
  <Moment fromNow>{date}</Moment>
)

LongNowDate.propTypes = {
  date: PropTypes.string,
};

LongNowDate.defaultProps = {
  date:'',
};

export const ShortNowDate = ({date}) => (
  <Moment fromNow ago>{date}</Moment>
)

ShortNowDate.propTypes = {
  date: PropTypes.string,
};

ShortNowDate.defaultProps = {
  date:'',
};

export default LongNowDate;
