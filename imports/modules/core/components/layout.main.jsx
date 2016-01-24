import React from 'react';

export default ({content = () => null }) => (
    <main style={{
        marginLeft: 256,
      }}>
      <header>
        <span>Hello World</span>
      </header>
      <div>
        <article>
          <p>Lorem Ipsum</p>
        </article>
        <article>
          <p>Lorem Ipsum</p>
        </article>
        <article>
          <p>Lorem Ipsum</p>
        </article>
      </div>
    </main>
);
