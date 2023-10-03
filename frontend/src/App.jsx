import React from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import { Home, Movies, Categories, Login, Registration } from './components/pages';
import Footer from './components/footer/Footer';
import './App.css';


class App extends React.Component {
    state = {
        details: [],
    };

    componentDidMount() {
        axios
            .get('http://localhost:8000/')
            .then((res) => {
                const data = res.data;
                this.setState({
                    details: data,
                });
            })
            .catch((err) => {
                console.error('Error fetching data:', err);
            });
    }

    render() {
        return (
            <div className="app-container">
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/Categories" element={<Categories />}></Route>
                    <Route path="/Movies" element={<Movies />}></Route>
                    <Route path="/Sign-in" element={<Login />}></Route>
                    <Route path='/Registration' element={<Registration/>}></Route>
                </Routes>

                {Array.isArray(this.state.details) ? (
                    this.state.details.map((movie, id) => (
                        <div key={id}>
                            <h2>{movie.title}</h2>
                            <p>{movie.description}</p>
                            <p>Category: {movie.category.name}</p>
                            <p>Release Date: {movie.release_date}</p>
                            <img
                                src={movie.image}
                                alt={movie.title}
                                style={{ maxWidth: '100%' }}
                            />
                        </div>
                    ))
                ) : (
                    <div></div>
                )}

                <Footer />
            </div>
        );
    }
}

export default App;
