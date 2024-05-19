'use client';

import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [url, setUrl] = useState('');
  const urlOutputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUrls = async () => {
      const res = await fetch('/api');
      if (res.ok) {
        const resJson = await res.json();
        console.log(resJson);
      }
    }

    fetchUrls();
  }, [])

  const handleGenerateUrl = async () => {
    const res = await fetch('/api', { method: "POST", body: JSON.stringify({ url: url }) });
    if (res.ok) {
      const resJson = await res.json();
      urlOutputRef.current && (urlOutputRef.current.innerText = `https://antojoy.com/a/${resJson.hash}`)
    }
  }

  return (
    <main className="">
      URL SHORTNER PAGE
      <div>
        <input type="text" style={{ border: "1px solid #000" }} value={url} onChange={(e) => setUrl(e.target.value)} />
        <input type="button" style={{ marginLeft: "5px", cursor: "pointer", border: "1px solid #000" }} value={"Generate"} onClick={handleGenerateUrl} />
      </div>
      <p ref={urlOutputRef}></p>
    </main>
  );
}
