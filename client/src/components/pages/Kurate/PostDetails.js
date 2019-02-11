import React from 'react';
import Remarkable from 'remarkable';

const createMarkup = (html) => {
  return {__html: html};
}

const PostDetails = ({post, onPostClose}) => {
  const md = new Remarkable({
    html: true,
    linkify: true
  });
  const body = md.render(post.body);
  return (
    <React.Fragment>
      <div>
        <button type="button" onClick={onPostClose}>Close</button>
      </div>
      <br />
      <h2>
        {post.title}
      </h2>
      <br />
      <div dangerouslySetInnerHTML={createMarkup(body)} />
      <br />
    </React.Fragment>
  )
}

export default PostDetails;
