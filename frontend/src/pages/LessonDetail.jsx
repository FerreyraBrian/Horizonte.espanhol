import React from 'react';
import { useParams } from 'react-router-dom';
import LessonClientPage from '../components/lessons/LessonClientPage';

const LessonDetail = ({ lessons, onComplete }) => {
  const { slug } = useParams();
  const lesson = lessons.find((item) => item.slug === slug);

  return (
    <div>
      {lesson ? <LessonClientPage lesson={lesson} onComplete={onComplete} /> : <p>Lección no encontrada.</p>}
    </div>
  );
};

export default LessonDetail;
