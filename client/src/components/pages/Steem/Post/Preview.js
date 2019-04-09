import React from 'react';

import PostBody from './PostBody';

const Preview = ({body}) => (
  body && (
    <div className='writingPreviewHeader'>
      <span className='left'>Preview</span>
      <span className='right'>
        <a
          href='https://guides.github.com/features/mastering-markdown/'
        >
          {'Markdown Help'}
        </a>
      </span>
      <div className='clear' />
      <div className='writingPreview'>
        <PostBody
          full
          rewriteLinks={false}
          body={body}
        />
      </div>
    </div>
  )
)

export default Preview;
