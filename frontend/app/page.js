'use client';
import { useState } from 'react';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
import SummaryDisplay from './components/SummaryDisplay';
import Loader from './components/Loader';

// Global styles to apply Neue Haas Grotesk font
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Neue Haas Grotesk';
    src: url('/fonts/NeueHaasGrotesk-Regular.woff2') format('woff2'),
         url('/fonts/NeueHaasGrotesk-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Neue Haas Grotesk';
    src: url('/fonts/NeueHaasGrotesk-Bold.woff2') format('woff2'),
         url('/fonts/NeueHaasGrotesk-Bold.woff') format('woff');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  body {
    font-family: 'Neue Haas Grotesk', sans-serif;
  }
`;

const Container = styled.div`
  background-image: url('https://images.pexels.com/photos/7876051/pexels-photo-7876051.jpeg');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Navbar = styled.nav`
  background: linear-gradient(90deg, #1f2937 0%, #374151 100%);
  width: 100%;
  padding: 1.5rem 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid #4b5563;
`;

const NavTitle = styled.h1`
  color: #f3f4f6;
  font-size: 2.25rem;
  font-family: 'Neue Haas Grotesk', sans-serif;
  font-weight: 700;
  text-align: center;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
`;

const Card = styled.div`
  background-color: rgba(31, 41, 55, 0.9);
  max-width: 28rem;
  width: 100%;
  border-radius: 1rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
`;

const Title = styled.h2`
  color: #e5e7eb;
  font-size: 1.75rem;
  font-weight: 700;
  font-family: 'Neue Haas Grotesk', sans-serif;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: -0.25rem;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: #3b82f6;
    border-radius: 2px;
  }
`;

const Description = styled.p`
  color: #d1d5db;
  font-size: 1rem;
  font-family: 'Neue Haas Grotesk', sans-serif;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const DropZone = styled.label`
  border: 2px dashed #4b5563;
  background-color: #374151;
  border-radius: 0.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #9ca3af;
  &:hover {
    color: #818cf8;
    svg {
      color: #818cf8;
    }
  }
`;

const DropZoneText = styled.p`
  margin-top: 0.75rem;
  font-size: 1rem;
  color: #9ca3af;
  text-align: center;
`;

const FilePreview = styled.div`
  position: relative;
  border: 1px solid #4b5563;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #374151;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
`;

const ImageContainer = styled.div`
  position: relative;
  display: inline-block;
  width: auto;
  max-width: 100%;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  background-image: url('https://static.vecteezy.com/system/resources/previews/018/887/462/original/signs-close-icon-png.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  border-radius: 50%;
  padding: 0;
  cursor: pointer;
  z-index: 20;
  &:hover {
    opacity: 0.8;
  }
`;

const SummaryBox = styled.div`
  background: linear-gradient(145deg, #2d3748, #374151); /* Subtle gradient background */
  border: 1px solid #4b5563;
  border-radius: 0.75rem; /* Slightly larger border radius */
  padding: 1.5rem; /* Increased padding for better spacing */
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); /* Deeper shadow for depth */
  position: relative;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #60a5fa, #3b82f6); /* Gradient top border */
  }
`;

const SummaryTitle = styled.h3`
  font-size: 1.25rem; /* Smaller than a typical heading */
  font-weight: 400; /* Lighter weight for elegance */
  font-family: 'Neue Haas Grotesk', sans-serif;
  color: #60a5fa; /* Match the gradient color */
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
  &:after {
    content: '';
    position: absolute;
    bottom: -0.25rem;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 2px;
    background: #60a5fa; /* Decorative underline */
    border-radius: 1px;
  }
`;

const SummaryText = styled.p`
  color: #d1d5db;
  font-size: 0.95rem;
  line-height: 1.6;
  text-align: left;
  margin-bottom: 1.5rem;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #3b82f6, #60a5fa); /* Gradient background */
  color: white;
  padding: 0.5rem 1.5rem; /* Wider padding for better appearance */
  border-radius: 0.5rem;
  margin-top: 1rem;
  font-weight: 500;
  font-family: 'Neue Haas Grotesk', sans-serif;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    background: linear-gradient(90deg, #2563eb, #4b9cfa); /* Darker gradient on hover */
    transform: translateY(-2px); /* Slight lift effect */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Shadow on hover */
  }
`;

const ErrorMessage = styled.p`
  color: #ef4444;
  margin-top: 1rem;
`;


const Page = () => {
  const [summary, setSummary] = useState('');
  const [fullText, setFullText] = useState('');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [showText, setShowText] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');

  const handleFileUpload = async (selectedFile) => {
    setFile(selectedFile);
    setLoading(true);
    setSummary('');
    setFullText('');
    setPreviewImage(null);
    setError('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:5000/fetch-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'image/*',
        },
        responseType: 'blob',
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('Response is not an image');
      }

      const imageUrl = URL.createObjectURL(response.data);
      setPreviewImage(imageUrl);
      setShowText(true);
    } catch (err) {
      console.error('Detailed error:', err);
      setError(err.message || 'Failed to fetch preview image');
      if (err.response) {
        console.error('Error response:', err.response);
        setError(`Server error: ${err.response.status} - ${err.response.data}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/analyze-and-summarize-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSummary(response.data.summary);
      setFullText(response.data.full_text);
    } catch (err) {
      setError(err.message || 'Failed to analyze file');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    await handleNextStep();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileUpload(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setShowText(false);
    setSummary('');
    setFullText('');
    setPreviewImage(null);
    setError('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Container onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
      <GlobalStyle />
      <Navbar>
        <NavTitle>Legal Case Summarizer</NavTitle>
      </Navbar>
      <ContentWrapper>
        <Card>
          <Title>Summarize Legal Cases with Ease</Title>
          <Description>
            Upload your legal case documents and get concise, accurate summaries powered by advanced AI technology.
          </Description>

          {!loading && !showText && !summary && (
            <DropZone htmlFor="fileInput">
              <input
                type="file"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                style={{ display: 'none' }}
                id="fileInput"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <DropZoneText>Drag & Drop or Click to Select File</DropZoneText>
            </DropZone>
          )}

          {file && !summary && (
            <FilePreview>
              {loading ? (
                <LoaderContainer>
                  <Loader />
                </LoaderContainer>
              ) : (
                showText && (
                  <>
                    {previewImage && (
                      <ImageContainer>
                        <img
                          src={previewImage}
                          alt="File Preview"
                          className="w-full object-contain rounded-lg"
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                        <RemoveButton onClick={removeFile} />
                      </ImageContainer>
                    )}
                    <p className="text-gray-300 mt-2 truncate">{file.name}</p>
                    <Button onClick={handleNextStep}>Next Step</Button>
                  </>
                )
              )}
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </FilePreview>
          )}

          {summary && (
            <SummaryBox>
              {loading ? (
                <LoaderContainer>
                  <Loader />
                </LoaderContainer>
              ) : (
                <>
                  <SummaryDisplay summary={summary} fullText={fullText} />
                  <div className="flex justify-center gap-4">
                    <Button onClick={handleRegenerate}>Regenerate</Button>
                    <Button onClick={handleCopy}>Copy</Button>
                  </div>
                  {copied && <p className="text-green-500 mt-2">Copied to clipboard!</p>}
                  {error && <ErrorMessage>{error}</ErrorMessage>}
                </>
              )}
            </SummaryBox>
          )}
        </Card>
      </ContentWrapper>
    </Container>
  );
};

export default Page;