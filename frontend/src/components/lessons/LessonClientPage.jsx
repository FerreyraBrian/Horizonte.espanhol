import React from 'react';

const LessonClientPage = ({ lesson, onComplete }) => {
  if (!lesson) return <p>Lección no encontrada.</p>;

  return (
    <div>
      <article className='card'>
        <h2>{lesson.title}</h2>
        <p>{lesson.fullSummary}</p>
        <div style={{ margin: '1rem 0' }}>
          <iframe width='100%' height='360' src={lesson.videoUrl} title={lesson.title} frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen />
        </div>
        <h3>Slides</h3>
        {lesson.slides.map((slide, index) => (
          <div key={index} className='card' style={{ marginBottom: '0.5rem' }}>
            <h4>{slide.title}</h4>
            <p>{slide.content}</p>
          </div>
        ))}
      </article>

      <article className='card' style={{ marginTop: '1rem' }}>
        <h3>Recursos</h3>
        {lesson.resources.map((resource, index) => (
          <a key={index} className='btn btn-secondary' href={resource.url} style={{ marginRight: '0.5rem', marginBottom: '0.5rem', display: 'inline-block' }}>
            {resource.name}
          </a>
        ))}
      </article>

      <article className='card' style={{ marginTop: '1rem' }}>
        <h3>Cuestionario</h3>
        <ul>
          {lesson.quiz.questions.map((q, idx) => (
            <li key={idx}><strong>{q.question}</strong><br />Opciones: {q.options.join(', ')}</li>
          ))}
        </ul>
      </article>

      <article className='card' style={{ marginTop: '1rem' }}>
        <h3>Ejercicio de escucha</h3>
        <p>Audio: {lesson.listeningExercise.audioUrl}</p>
        <ul>
          {lesson.listeningExercise.questions.map((q, idx) => (
            <li key={idx}><strong>{q.question}</strong><br />Opciones: {q.options.join(', ')}</li>
          ))}
        </ul>
      </article>

      <button onClick={() => onComplete(lesson.id)} className='btn btn-primary' style={{ marginTop: '1rem' }}>
        Marcar como completado
      </button>
    </div>
  );
};

export default LessonClientPage;
