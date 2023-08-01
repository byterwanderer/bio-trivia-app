import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { createClient } from '@supabase/supabase-js';
import logo from './images/apple-touch-icon-1.png';
import logoText from './images/EASTWOOD_logos_2022--05.png';
import './App.css';
import { Container } from 'react-bootstrap';

const SUPABASE_URL = `https://${process.env.REACT_APP_SUPABASE_URL_KEY}.${process.env.REACT_APP_SUPABASE_URL}`;
const SUPABASE_KEY = `${process.env.REACT_APP_SUPABASE_ANON_KEY}`;
const cconn = createClient(SUPABASE_URL, SUPABASE_KEY);

function App() {
  const [selectedGrade, setSelectedGrade] = useState('');
  const [question, setQuestion] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const [hintModalIsOpen, setHintModalIsOpen] = useState(false);
  const [hintModalContent, setHintModalContent] = useState('');

  useEffect(() => {
    closeModal();
  }, [selectedGrade]);

  const getQuestion = async () => {
    if (selectedGrade !== '') {
      const { data, error } = await cconn
        .from(`grade${selectedGrade}`)
        .select('Question, Answer, Hint');

      if (error) {
        console.error('Error fetching question:', error.message);
        return;
      }

      if (data && data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        setQuestion(data[randomIndex]);
      }
    } else {
      setQuestion(null);
    }
  };

  useEffect(() => {
    getQuestion();
  }, [selectedGrade]);

  const handleGradeChange = (event) => {
    setSelectedGrade(event.target.value);
    closeModal();
    closeHintModal();
  };

  const openModal = (content) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleButtonClick = (buttonName) => {
    if (buttonName === 'hint') {
      openHintModal(question.Hint);
    } else if (buttonName === 'solution') {
      openModal(question.Answer);
      closeHintModal();
    }
  };

  const openHintModal = (content) => {
    setHintModalContent(content);
    setHintModalIsOpen(true);
  };

  const closeHintModal = () => {
    setHintModalIsOpen(false);
  };

  const handleGenerateClick = () => {
    getQuestion();
  };

  return (
    <div className="App">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="logoText-container">
        <img src={logoText} alt="LogoText" className="logoText" />
      </div>
      <h1 className="app-title">Biology/Science Trivia</h1>
      <br />

      <div className="grade-container">
        <select
          value={selectedGrade}
          onChange={handleGradeChange}
          className="grade-select"
        >
          <option value="">--Choose a Grade--</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
            <option key={grade} value={grade}>
              Grade {grade}
            </option>
          ))}
        </select>
        <br />
        <button
          onClick={handleGenerateClick}
          disabled={!selectedGrade}
          className="generate-button"
        >
          Generate
        </button>
      </div>

      <Container className='container-question-container'>
        <div className="question-container">
          {question && (
            <div className="question">
              <h2>{question.Question}</h2>
              <div className="button-group">
                <button
                  onClick={() => handleButtonClick('hint')}
                  className="action-button-hint"

                >
                  Hint
                </button>
                <span className='space' />
                <button
                  onClick={() => handleButtonClick('solution')}
                  className="action-button-solution"
                >
                  Solution
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div>{modalContent}</div>
        <span className='space' />
        <button className='close-modal-btn' onClick={closeModal}>Close</button>
      </Modal>

      <Modal
        isOpen={hintModalIsOpen}
        onRequestClose={closeHintModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <div>{hintModalContent}</div>
        <span className='space' />
        <button className='close-modal-btn' onClick={closeHintModal}>Close</button>
      </Modal>
    </div>
  );
}

export default App;
