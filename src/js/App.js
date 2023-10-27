import React, { useState, useEffect } from "react";
import "../css/App.css";
import "tailwindcss/tailwind.css";
import axios from "axios";

const API_KEY = "CMUuMSOXH7gue1SFgwgbGON69pqMmm9FOXJzY0Vd2bs";

function App() {
  const [images, setImages] = useState([]);
  const [queryStr, setQueryStr] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const perPage = 16;

  const getImagesData = async () => {
    try {
      setLoading(true); // Bắt đầu quá trình tải ảnh
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?client_id=${API_KEY}&query=${queryStr}&page=${page}&per_page=${perPage}`
      );
      setImages((prevImages) => [...prevImages, ...response.data.results]);
      setPage(page + 1);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false); // Kết thúc quá trình tải ảnh
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setImages([]);
    getImagesData();
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      if (!loading) {
        getImagesData();
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  // first create the interface with the default parameters
  useEffect(() => {
    async function getFirstImages() {
      try {
        const firstState = await await axios.get(
          `https://api.unsplash.com/search/photos?client_id=${API_KEY}&query=animals&page=${page}&per_page=${perPage}`
        );
        setImages(firstState.data.results);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    }

    getFirstImages();
  }, []);

  return (
    <div>
      <div className="header">
        <h1 className="content-header font-mono">SEARCH IMAGES</h1>
        <h2 className="content-header">
          Over 4.2 million+ high-quality stock images shared by our talented
          community.
        </h2>

        <div className="form">
          <form onSubmit={handleSearch}>
            <input
              className=""
              placeholder="Search for images..."
              value={queryStr}
              onChange={(e) => setQueryStr(e.target.value)}
            />
            <button type="submit">🔎</button>
          </form>
        </div>
      </div>

      <div className="images-container">
        {images.map((image) => (
          <div className="item-image" key={image.id}>
            <img src={image.urls.small} alt={image.description} />
          </div>
        ))}
        {loading && <div className="loading-spinner"></div>}
      </div>
    </div>
  );
}

export default App;
