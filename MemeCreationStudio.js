import React, { useState, useEffect } from 'react';

const templates = [
  { id: 1, name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg' },
  { id: 2, name: 'Drake Hotline Bling', url: 'https://i.imgflip.com/30b1gx.jpg' },
  { id: 3, name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg' },
];

function MemeCreationStudio() {
  const [image, setImage] = useState(null);
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [fontStyle, setFontStyle] = useState('Impact');
  const [fontSize, setFontSize] = useState(40);
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [fontAlign, setFontAlign] = useState('center');
  const [aiCaption, setAiCaption] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Select template image
  const selectTemplate = (url) => {
    setImage(url);
  };

  // Placeholder AI caption generator
  const generateAiCaption = () => {
    // For demo, just set a static caption
    setAiCaption('When you realize AI can generate memes!');
  };

  // Save draft placeholder
  const saveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  // Publish placeholder
  const publishMeme = () => {
    alert('Meme published!');
  };

  return (
    <div>
      <h2>Meme Creation Studio</h2>

      <div>
        <label>
          Upload Image:
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
      </div>

      <div>
        <h3>Or pick a template:</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {templates.map((template) => (
            <img
              key={template.id}
              src={template.url}
              alt={template.name}
              width={100}
              style={{ cursor: 'pointer', border: image === template.url ? '2px solid blue' : 'none' }}
              onClick={() => selectTemplate(template.url)}
            />
          ))}
        </div>
      </div>

      <div>
        <label>
          Top Text:
          <input type="text" value={topText} onChange={(e) => setTopText(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Bottom Text:
          <input type="text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Font Style:
          <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
            <option value="Impact">Impact</option>
            <option value="Arial">Arial</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Courier New">Courier New</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Font Size:
          <input
            type="number"
            min="10"
            max="100"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
          />
        </label>
      </div>

      <div>
        <label>
          Font Color:
          <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
        </label>
      </div>

      <div>
        <label>
          Font Alignment:
          <select value={fontAlign} onChange={(e) => setFontAlign(e.target.value)}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </label>
      </div>

      <div>
        <button onClick={generateAiCaption}>AI Caption Generator</button>
        {aiCaption && <p><em>Suggested Caption: {aiCaption}</em></p>}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button onClick={saveDraft}>Save as Draft</button>
        <button onClick={publishMeme} style={{ marginLeft: '10px' }}>Publish to Feed</button>
        {draftSaved && <p style={{ color: 'green' }}>Draft saved!</p>}
      </div>

      <div style={{ position: 'relative', marginTop: '20px', width: '500px', height: '500px' }}>
        {image ? (
          <div style={{ position: 'relative' }}>
            <img src={image} alt="Meme" style={{ width: '100%', height: 'auto' }} />
            <div
              style={{
                position: 'absolute',
                top: '10px',
                width: '100%',
                textAlign: fontAlign,
                fontFamily: fontStyle,
                fontSize: fontSize,
                color: fontColor,
                textShadow: '2px 2px 4px #000000',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {topText}
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                width: '100%',
                textAlign: fontAlign,
                fontFamily: fontStyle,
                fontSize: fontSize,
                color: fontColor,
                textShadow: '2px 2px 4px #000000',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {bottomText}
            </div>
          </div>
        ) : (
          <p>No image selected</p>
        )}
      </div>
    </div>
  );
}

export default MemeCreationStudio;
