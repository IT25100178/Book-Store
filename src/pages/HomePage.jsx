import "./home.css";

const HomePage = () => {
  return (
    <div className="home">

      {/* HERO SECTION */}
      <div className="hero">
        <div className="overlay">
          <h1>
            Welcome to <span>Luxury Books</span>
          </h1>

          <p>
            Discover your next favorite book from our curated collection
          </p>

          <div className="stats">
            <div>
              <h2>10,000+</h2>
              <p>Books</p>
            </div>
            <div>
              <h2>500+</h2>
              <p>Authors</p>
            </div>
            <div>
              <h2>50,000+</h2>
              <p>Readers</p>
            </div>
          </div>

          <button className="explore-btn">
            Explore Collection →
          </button>
        </div>
      </div>

    </div>
  );
};

export default HomePage;