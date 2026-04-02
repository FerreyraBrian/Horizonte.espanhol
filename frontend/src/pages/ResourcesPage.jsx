import React from 'react';

const ResourcesPage = ({ lessons }) => (
  <div>
    <h1>Recursos</h1>
    <p>Descarga material de cada lección</p>
    {lessons.map((lesson) => (
      <article key={lesson.id} className='card' style={{ marginBottom: '0.75rem' }}>
        <h3>{lesson.title}</h3>
        {lesson.resources.map((resource, idx) => (
          <a key={idx} className='btn btn-secondary' href={resource.url}>{resource.name}</a>
        ))}
      </article>
    ))}
  </div>
);

export default ResourcesPage;
