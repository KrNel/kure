import moment from 'moment';

const TimeAgo = ({date}) => (
  moment.utc(date).fromNow()
)

export default TimeAgo;
