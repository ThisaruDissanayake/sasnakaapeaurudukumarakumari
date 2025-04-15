import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { db } from './firebaseConfig';
import { ref, deleteObject } from 'firebase/storage';
import logo1 from './assets/Bg.png';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import imageCompression from 'browser-image-compression';

const judges = [
  'Mr.Hasitha Wijesundara',
  'Mrs.Dilanjali Wijesundara',
  'Mrs.Hiruni Tharaka',
  'Mr. Charith Weerasinghe',
  'Ms.Pavithra Nilmini'
];

const PhotoCompetitionApp = ({ competition }) => {
  const [photos, setPhotos] = useState([]);
  const [selectedTab, setSelectedTab] = useState('upload');

  const getCollectionName = useCallback(() => {
    return competition === 'kumara' ? 'photos_kumara' : 'photos_kumari';
  }, [competition]);
  
  const fetchPhotos = useCallback(async () => {
    const snapshot = await getDocs(collection(db, getCollectionName()));
    const photoList = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data()
    }));
    setPhotos(photoList);
  }, [getCollectionName]);
  

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const readFileAsBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files);

    for (let file of files) {
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1000,
          useWebWorker: true,
        });

        const base64 = await readFileAsBase64(compressedFile);
        const name = file.name;
        const district = prompt(`Enter district for ${name}`);
        const scores = Array(judges.length).fill(0);

        await addDoc(collection(db, getCollectionName()), {
          name,
          district,
          scores,
          imageBase64: base64,
          timestamp: Date.now(),
        });

        alert(`${name} uploaded successfully!`);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        alert(`Failed to upload ${file.name}. Check console for details.`);
      }
    }

    fetchPhotos();
  };

  const handleScoreChange = async (photoId, judgeIndex, score) => {
    const updatedPhotos = photos.map((photo) =>
      photo.id === photoId
        ? {
            ...photo,
            scores: photo.scores.map((s, i) => (i === judgeIndex ? Number(score) : s))
          }
        : photo
    );
    setPhotos(updatedPhotos);

    const updatedPhoto = updatedPhotos.find((p) => p.id === photoId);
    try {
      await addDoc(collection(db, 'score_updates'), {
        photoId,
        scores: updatedPhoto.scores,
        updatedAt: Date.now()
      });

      await updateDoc(doc(db, getCollectionName(), photoId), {
        scores: updatedPhoto.scores
      });
    } catch (error) {
      console.error("Failed to save score:", error);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    const photo = photos.find((p) => p.id === photoId);
    if (!photo) return;

    try {
      if (photo.imagePath) {
        const imageRef = ref(db, photo.imagePath);
        await deleteObject(imageRef);
      }

      await deleteDoc(doc(db, getCollectionName(), photoId));
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      alert('Photo deleted!');
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Failed to delete photo.');
    }
  };

  const getAverageScore = (scores = []) => {
    const total = scores.reduce((sum, s) => sum + Number(s), 0);
    return (total / judges.length).toFixed(2);
  };

  return (
    <div
      className="photo-app"
      style={{
        position: 'relative',
        backgroundImage: `url(${logo1})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        minHeight: '100vh',
      }}
    >
      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: '10px', padding: '20px' }}>
        <h1 style={{ color: 'white' }}>
          {competition === 'kumara'
            ? 'සස්නක සංසද "අවුරුදු කුමරා - 2025"'
            : 'සස්නක සංසද "අවුරුදු කුමාරි - 2025"'}
        </h1>

        <div className="tabs">
          <button onClick={() => setSelectedTab('upload')}>Upload Photos</button>
          <button onClick={() => setSelectedTab('judge')}>Judge Panel</button>
          <button onClick={() => setSelectedTab('leaderboard')}>Leaderboard</button>
        </div>

        {selectedTab === 'upload' && (
          <div className="upload-section">
            <label htmlFor="photo-upload" style={{ color: 'white' }}>Select photos to upload:</label>
            <input type="file" id="photo-upload" multiple onChange={handlePhotoUpload} />
          </div>
        )}

        {(selectedTab === 'judge' || selectedTab === 'leaderboard') && (
          <div className="photo-grid">
            {(selectedTab === 'leaderboard' ? [...photos].sort(
              (a, b) => getAverageScore(b.scores) - getAverageScore(a.scores)
            ) : photos).map((photo, index) => (
              <div
                key={photo.id}
                className={`card ${selectedTab === 'leaderboard' ? 'highlight' : ''}`}
              >
                <img src={photo.imageBase64} alt={photo.name} className="photo-large" />

                <p><strong>Name:</strong> {photo.name}</p>
                <p><strong>District:</strong> {photo.district}</p>

                {selectedTab === 'judge' &&
                  judges.map((judgeName, idx) => (
                    <div key={idx} className="judge-score">
                      <label>{judgeName}'s Score:</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={photo.scores?.[idx] || 0}
                        onChange={(e) =>
                          handleScoreChange(
                            photo.id,
                            idx,
                            Math.min(10, Math.max(0, e.target.value))
                          )
                        }
                      />
                    </div>
                  ))}

                {selectedTab === 'leaderboard' && (
                  <>
                    <p><strong>Average Score:</strong> {getAverageScore(photo.scores)}</p>
                    <p className={`rank rank-${index + 1}`}>Rank #{index + 1}</p>
                  </>
                )}

                <button className="delete-btn" onClick={() => handleDeletePhoto(photo.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoCompetitionApp;
