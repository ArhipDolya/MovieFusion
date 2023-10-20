import React from "react";
import { Route, Routes, Navigate } from 'react-router-dom';
import { Home, Movies, Categories, AuthenticationForm } from './index'
import MovieDetails from "../MovieDetails/MovieDetails";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Categories" element={<Categories />} />
            <Route path="/Movies" element={<Movies />} />
            <Route path="/Authentication" element={<AuthenticationForm />} />
            <Route path="/movie/:id" element={<MovieDetails />} />

            <Route path="*" element={<Navigate to="/" />} /> 
        </Routes>
    )
}

export default AppRouter;