// src/FullLeaderboard.js
import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const FullLeaderboard = ({ title, collectionName }) => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      const snapshot = await getDocs(collection(db, collectionName));
      const photoList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const sorted = photoList.sort((a, b) => {
        const avgA = a.scores.reduce((sum, s) => sum + Number(s), 0) / a.scores.length;
        const avgB = b.scores.reduce((sum, s) => sum + Number(s), 0) / b.scores.length;
        return avgB - avgA;
      });

      setPhotos(sorted);
    };

    fetchPhotos();
  }, [collectionName]);

  const getAverage = (scores = []) =>
    (scores.reduce((sum, s) => sum + Number(s), 0) / scores.length).toFixed(2);

  return (
    <div className="leaderboard-preview">
      <h2>{title}</h2>
      {photos.map((photo, index) => (
        <div key={photo.id} className="leaderboard-card">
          <img src={photo.imageBase64} alt={photo.name} className="photo-large" />
          <p><strong>Name:</strong> {photo.name}</p>
          <p><strong>District:</strong> {photo.district}</p>
          <p><strong>Average Score:</strong> {getAverage(photo.scores)}</p>
          <p className={`rank rank-${index + 1}`}>Rank #{index + 1}</p>
        </div>
      ))}
    </div>
  );
};

export default FullLeaderboard;
