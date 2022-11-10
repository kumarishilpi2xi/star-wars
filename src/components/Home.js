import React, { useEffect, useState } from "react";
import { SWAPI_API_ENDPOINT } from "../constants/api";
import Card from "./Card";
import Header from "./Header";

const UP = <span>&uarr;</span>;
const DOWN = <span>&darr;</span>;

export default function Home() {
  const [allFilms, setAllFilms] = useState([]);
  const [allFilmsRaw, setAllFilmsRaw] = useState([]);
  const [directors, setDirectors] = useState([]);
  const [sortingInfo, setSortingInfo] = useState({
    order: true,
    orderBy: "title",
  });

  const query = `query FetchData{
        allFilms{
                pageInfo{
                    hasNextPage
                    hasPreviousPage
                }
              films{
                    id
                    title
                    releaseDate
                    producers
                    director
                    openingCrawl
              }
          }
    }
    `;
  useEffect(() => {
    getAllFilms();
  }, []);

  const getAllFilms = () => {
    fetch(SWAPI_API_ENDPOINT, {
      method: "POST",
      mode: "cors",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        let sortedFilms = data?.data?.allFilms?.films;
        sortedFilms = sortedFilms?.sort(sortObj(sortingInfo));
        setAllFilms(sortedFilms);
        setAllFilmsRaw(sortedFilms);
        let allDirectors = [];
        data?.data?.allFilms?.films?.map(
          (film) =>
            !allDirectors?.includes(film?.director) &&
            allDirectors.push(film?.director)
        );
        setDirectors(allDirectors);
      })
      .catch((error) => console.log(error));
  };
  const sortObj = (sorting) => {
    return function (a, b) {
      if (a[sorting?.orderBy] < b[sorting?.orderBy]) {
        return sorting?.order === true ? -1 : 1;
      }
      if (a[sorting?.orderBy] > b[sorting?.orderBy]) {
        return sorting?.order === false ? -1 : 1;
      }
      return 0;
    };
  };
  const handleSorting = (key) => {
    let newSorting =
      sortingInfo?.orderBy === key
        ? { ...sortingInfo, order: !sortingInfo?.order }
        : { ...sortingInfo, order: true };
    newSorting = { ...newSorting, orderBy: key };
    setSortingInfo(newSorting);
    let sortedFilms = allFilms.sort(sortObj(newSorting));
    setAllFilms(sortedFilms);
  };

  const handleFilters = (value, type = "search") => {
    let filteredFilms = [...allFilmsRaw];
    if (type === "search") {
      if (value?.length > 2) {
        filteredFilms = allFilmsRaw?.filter((film) =>
          film.title?.toLowerCase().includes(value.toLowerCase())
        );
      }
    } else {
      if (value !== "")
        filteredFilms = allFilmsRaw?.filter((film) =>
          film.director?.toLowerCase().includes(value.toLowerCase())
        );
    }

    setAllFilms(filteredFilms);
  };

  return (
    <div className="container">
      <Header />
      <div className="notch-contain notch-top"></div>
      <div className="filmContainer">
        <div className="filmHeader">
          <div className="search-container">
            <input
              type={"search"}
              placeholder="Search Movie"
              onChange={(e) => handleFilters(e.target.value)}
            />
          </div>
          <div className="filmHeaderRight">
            <div className="filter">
              <select
                onChange={(e) => handleFilters(e?.target?.value, "director")}
                defaultValue=""
              >
                <option value="">All</option>

                {directors?.map((director, index) => (
                  <option key={director + index} value={director}>
                    {director}
                  </option>
                ))}
              </select>
            </div>
            <div className="sorting-wrapper">
              <button onClick={() => handleSorting("title")}>
                Movie Name{" "}
                {sortingInfo?.orderBy === "title"
                  ? sortingInfo?.order
                    ? UP
                    : DOWN
                  : null}
              </button>
              <button onClick={() => handleSorting("releaseDate")}>
                Release Date{" "}
                {sortingInfo?.orderBy === "releaseDate"
                  ? sortingInfo?.order
                    ? UP
                    : DOWN
                  : null}
              </button>
            </div>
          </div>
        </div>
        <div className="filmBody">
          {allFilms?.map((film) => (
            <Card filmInfo={film} key={film?.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
