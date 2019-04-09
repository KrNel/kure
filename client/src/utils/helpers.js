export const getUpvotes = activeVotes => activeVotes.filter(vote => vote.percent > 0);
export const getDownvotes = activeVotes => activeVotes.filter(vote => vote.percent < 0);
export const sortVotes = (votes, sortBy) => votes.sort((a, b) => a[sortBy] - b[sortBy]);
export const sumPayout = content => (
  parseFloat(content.pending_payout_value) +
  parseFloat(content.total_payout_value) +
  parseFloat(content.curator_payout_value)
);

export const hasLength = (obj) => (
  Object.getOwnPropertyNames(obj).length > 0
);

export default hasLength;
