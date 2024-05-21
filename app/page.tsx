'use client';

import { useEffect, useState, useRef } from "react";
import { Urls } from "./lib/db/database";
import { URL_SHORTNER_BASEPATH } from "./api/constants";

export default function Home() {
  const [url, setUrl] = useState('');
  const [previousUrls, setPreviousUrls] = useState<Urls[]>([]);
  const urlOutputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUrls = async () => {
      const res = await fetch('/api');
      if (res.ok) {
        const resJson = await res.json();
        setPreviousUrls(resJson.urls);
      }
    }

    fetchUrls();
  }, [])

  const handleGenerateUrl = async () => {
    const res = await fetch('/api', { method: "POST", body: JSON.stringify({ url: url }) });
    if (res.ok) {
      const resJson = await res.json();
      let urlHash = resJson.hash || resJson.url.url_hash;
      urlHash &&
        urlOutputRef.current &&
        (urlOutputRef.current.innerHTML = `Genrated Url : <a href="${location.origin}${URL_SHORTNER_BASEPATH}${urlHash}" target="_blank">${location.origin}${URL_SHORTNER_BASEPATH}${urlHash}</a>`)
      if (resJson.status == "error") {
        resJson.error = "duplicate_entry" ? alert('Duplicate entry') : alert('Unknown error');
      }
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
      <div>
        <h4>Previous Urls</h4>
        {
          previousUrls.map((previousUrl) => {
            return (
              <div key={previousUrl.id}>
                <div>=========================================================================</div>
                <p>Original Url: <a href={`${previousUrl.url}`} target="_blank">{`${previousUrl.url}`}</a></p>
                <p>Redirected Url: <a href={`${location.origin}${URL_SHORTNER_BASEPATH}${previousUrl.url_hash}`} target="_blank">{`${location.origin}${URL_SHORTNER_BASEPATH}${previousUrl.url_hash}`}</a></p>
                <p>Visits: {previousUrl.visits}</p>
                <div>=========================================================================</div>
              </div>
            )
          })
        }
      </div>
    </main>
  );
}
