'use client';

import React, { useState, useEffect } from 'react';

interface CodeFetcherProps {
  repository: string;
  file: string;
  token?: string;
}

export default function CodeFetcher({ repository, file, token }: CodeFetcherProps) {
  const [code, setCode] = useState('');

  useEffect(() => {
    fetchCode();
  }, [repository, file]);

  async function fetchCode() {
    try {
      const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};
      const response = await fetch(
        `https://api.github.com/repos/${repository}/${file}`,
        { headers }
      );

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.content) {
          const codeText = atob(responseData.content);
          setCode(codeText);
        }
      } else {
        throw new Error('Failed to fetch code');
      }
    } catch (error) {
      console.error('Failed to fetch code:', error);
    }
  }

  return <pre>{code}</pre>;
}
