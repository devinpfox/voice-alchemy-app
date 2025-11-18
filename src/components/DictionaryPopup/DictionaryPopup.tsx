'use client';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

interface Word {
  id: number;
  word: string;
  definition: string;
}

interface DictionaryPopupProps {
  onClose: () => void;
}

export default function DictionaryPopup({ onClose }: DictionaryPopupProps) {
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [words, setWords] = useState<Word[]>(() => {
    // Load saved words from localStorage
    if (typeof window !== 'undefined') {
      const savedWords = localStorage.getItem('dictionaryWords');
      return savedWords ? JSON.parse(savedWords) : [];
    }
    return [];
  });
  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [currentPage, setCurrentPage] = useState(1); // Pagination state

  const wordsPerPage = 10; // Number of words to display per page

  useEffect(() => {
    // Save words to localStorage whenever they change
    if (typeof window !== 'undefined') {
      localStorage.setItem('dictionaryWords', JSON.stringify(words));
    }
  }, [words]);

  const handleWordClick = (wordId: number) => {
    setSelectedWord(selectedWord === wordId ? null : wordId);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: false, // CSV doesn't have column headers
        skipEmptyLines: true, // Skip blank lines
        complete: (result: any) => {
          const rows = result.data;

          // Convert rows into word objects
          const parsedWords: Word[] = rows.map(([word, definition]: [string, string], index: number) => ({
            id: index + 1,
            word: word.trim(),
            definition: definition ? definition.trim() : '', // Handle missing definitions
          }));

          setWords(parsedWords);
          setSearchQuery(''); // Clear any previous search query
          setCurrentPage(1); // Reset to the first page when new words are uploaded
        },
        error: (error: Error) => {
          alert('Error reading the file: ' + error.message);
        },
      });
    }
  };

  // Handle search input changes
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when starting a search
  };

  // Filtered words based on search query
  const filteredWords = words.filter((word) =>
    word.word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastWord = currentPage * wordsPerPage;
  const indexOfFirstWord = indexOfLastWord - wordsPerPage;
  const currentWords = filteredWords.slice(indexOfFirstWord, indexOfLastWord);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredWords.length / wordsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="popup-overlay" onClick={onClose}></div>
      <div className="dictionary-popup">
        <div className="dictionary-header">
          <div className="dictionary-header-left">
            <h2>Library</h2>
            <div className="library-link">
              Check our full library <a href="#">here</a>
            </div>

            <div className="input-section">
              <div className="upload-section">
                <label htmlFor="csvUpload">Upload CSV: </label>
                <input
                  className="dictionary-input"
                  type="file"
                  id="csvUpload"
                  accept=".csv"
                  onChange={handleFileUpload}
                />
              </div>
              <div className="search-section">
                <label htmlFor="searchInput">Search: </label>
                <input
                  className="dictionary-input"
                  type="text"
                  id="searchInput"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search for a word..."
                />
              </div>
            </div>
          </div>
          <div className="dictionary-header-right">
            <div className="close-icon" onClick={onClose}>
              x
            </div>
          </div>
        </div>
        <div className="header-left dictionary-header">
          <h2>Dictionary</h2>
        </div>
        <div className="dictionary-content">
          {currentWords.length > 0 ? (
            currentWords.map((word) => (
              <div
                key={word.id}
                className={`word-item ${selectedWord === word.id ? 'active' : ''}`}
                onClick={() => handleWordClick(word.id)}
              >
                <div className="word-label">{word.word}</div>
                {selectedWord === word.id && (
                  <div className="definition">{word.definition}</div>
                )}
              </div>
            ))
          ) : (
            <div className="no-words">
              {filteredWords.length === 0
                ? 'No matching words found.'
                : 'No words loaded. Upload a CSV to get started.'}
            </div>
          )}
        </div>
        {filteredWords.length > wordsPerPage && (
          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === Math.ceil(filteredWords.length / wordsPerPage)}
              className="pagination-button"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
