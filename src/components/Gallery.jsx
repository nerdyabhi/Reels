"use client"

import React from 'react';
import { IKVideo, ImageKitProvider } from 'imagekitio-next';

const Gallery = () => {

    const [items, setItems] = React.useState([]);

    React.useEffect(() => {
        fetch('/api/videos')
            .then(response => response.json())
            .then(data => Array.isArray(data) ? setItems(data) : setItems([]))
            .catch(error => console.error('Error fetching videos:', error));
    }, []);
    if (items.length === 0) {
        return <div>No items found.</div>;
    }
    const renderMedia = (item) => {
        // Determine if the media is a video based on file extension, e.g. .mp4
        const isVideo = item.fileType === "non-image";
        const url = new URL(item.videoUrl);
        
        if (isVideo) {
            console.log(item.videoUrl);
            
            const filePath = url.pathname.substring(11);
            console.log(filePath);
            
            return (
                
                <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}>
                <IKVideo
                  path={filePath}
                  transformation={[{ height: 200, width: 600, b: '5_red', q: 95 }]}
                  controls={true}
                />
              </ImageKitProvider>
            );
        } else {
            return (
                <img
                    src={item.videoUrl || item.thumbnailUrl  }
                    alt={item.title}
                    style={{ maxWidth: '100%' }}
                />
            );
        }
    };

    return (

        <div className="gallery" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem',
            padding: '2rem'
        }}>

            {items.map(item => (
                <div key={item._id} className="gallery-item" style={{
                    background: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s',
                    cursor: 'pointer'
                }}>
                    {renderMedia(item)}
                    <div style={{ padding: '1rem' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{item.title}</h3>
                        <p style={{ margin: '0', color: '#666' }}>{item.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Gallery;