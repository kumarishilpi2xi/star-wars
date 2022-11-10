import React, { useEffect } from "react";

export default function Card({ filmInfo }) {
  return (
    <div className="movieCard">
      <h2>{filmInfo?.title}</h2>
      <p>
        <b>Release Date:</b> {filmInfo?.releaseDate}
      </p>
      <p>
        <b>Director:</b> {filmInfo?.director}
      </p>
      <p>
        <b>Producers: </b>
        {filmInfo?.producers?.map((producer, index) => (
          <span key={producer + index}>
            {producer}
            {filmInfo?.producers?.length > 1 &&
              index < filmInfo?.producers?.length-1? ", ":""}
          </span>
        ))}
      </p>

      <p>{filmInfo?.openingCrawl}</p>
    </div>
  );
}
