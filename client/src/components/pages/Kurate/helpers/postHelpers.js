const totalPayout =
  parseFloat(post.pending_payout_value) +
  parseFloat(post.total_payout_value) +
  parseFloat(post.curator_payout_value);
const totalRShares = post.active_votes.reduce((a, b) => a + parseFloat(b.rshares), 0);
const ratio = totalRShares === 0 ? 0 : totalPayout / totalRShares;
