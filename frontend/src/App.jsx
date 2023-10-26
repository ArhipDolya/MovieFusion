import React from 'react';
import axios from 'axios';
import Navbar from './components/navbar/navbar'
import Footer from './components/footer/Footer';
import AppRouter from './components/pages/appRouter';
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
                
                <AppRouter />
            
                <Footer />
    
            </div>
        );
    }
    
}

export default App;
