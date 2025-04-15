import React, { useState, useEffect } from 'react';

import './App.css';

const PhotoCompetitionApp = () => {
    const [photos, setPhotos] = useState([]);
    const [selectedTab, setSelectedTab] = useState('upload');
    const judges = ['Alice', 'Bob', 'Charlie', 'Diana', 'Ethan'];

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result); // base64 string
          reader.onerror = (error) => reject(error);
        });
      };
      
      
      const handlePhotoUpload = async (event) => {
        const files = Array.from(event.target.files);
      
        const newPhotos = await Promise.all(
          files.map(async (file) => {
            const base64 = await fileToBase64(file);
            return {
              id: base64, // using base64 string as ID and src
              name: file.name,
              district: prompt(`Enter district for ${file.name}`),
              scores: [0, 0, 0, 0, 0], // 5 judges
            };
          })
        );
      
        const updatedPhotos = [...photos, ...newPhotos];
        setPhotos(updatedPhotos);
        localStorage.setItem('photoCompetitionPhotos', JSON.stringify(updatedPhotos));
      };
      

      const handleScoreChange = (photoId, judgeIndex, score) => {
        const updated = photos.map((photo) =>
          photo.id === photoId
            ? {
                ...photo,
                scores: photo.scores.map((s, i) =>
                  i === judgeIndex ? Number(score) : s
                ),
              }
            : photo
        );
        setPhotos(updated);
        localStorage.setItem('photoCompetitionPhotos', JSON.stringify(updated));
      };
      

    const getAverageScore = (scores) => {
        const total = scores.reduce((acc, score) => acc + score, 0);
        return (total / scores.length).toFixed(2);
    };

    const sortedPhotos = [...photos].sort(
        (a, b) => getAverageScore(b.scores) - getAverageScore(a.scores)
    );

    useEffect(() => {
        const stored = localStorage.getItem('photoCompetitionPhotos');
        if (stored) {
          setPhotos(JSON.parse(stored));
        }
      }, []);
      

    return (
        <div className="photo-app">
            <h1>Photo Competition</h1>
            <div className="tabs">
                <button onClick={() => setSelectedTab('upload')}>Upload Photos</button>
                <button onClick={() => setSelectedTab('judge')}>Judge Panel</button>
                <button onClick={() => setSelectedTab('leaderboard')}>Leaderboard</button>
            </div>

            {selectedTab === 'upload' && (
                <div className="upload-section">
                    <label htmlFor="photo-upload">Select photos to upload:</label>
                    <input type="file" id="photo-upload" multiple onChange={handlePhotoUpload} />
                </div>
            )}

            {selectedTab === 'judge' && (
                <div className="photo-grid">
                    {photos.map((photo) => (
                        <div className="card" key={photo.id}>
                            <img src={photo.id} alt={photo.name} className="photo-large" />
                            <p><strong>Name:</strong> {photo.name}</p>
                            <p><strong>District:</strong> {photo.district}</p>
                            {judges.map((judgeName, index) => (
                                <div key={judgeName} className="judge-score">
                                    <label>{judgeName}'s Score:</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="10"
                                        value={photo.scores[index]}
                                        onChange={(e) =>
                                            handleScoreChange(photo.id, index, Math.min(10, Math.max(0, e.target.value)))
                                        }
                                    />
                                </div>
                            ))}

                        </div>
                    ))}
                </div>
            )}

            {selectedTab === 'leaderboard' && (
                <div className="photo-grid">
                    {sortedPhotos.map((photo, index) => (
                        <div className="card highlight" key={photo.id}>
                            <img src={photo.id} alt={photo.name} className="photo-large" />
                            <p><strong>Name:</strong> {photo.name}</p>
                            <p><strong>District:</strong> {photo.district}</p>
                            <p><strong>Average Score:</strong> {getAverageScore(photo.scores)}</p>
                            <p className={`rank rank-${index + 1}`}>Rank #{index + 1}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PhotoCompetitionApp;
