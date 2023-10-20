import React from "react";

const Pagination = ({ pageNumbers, currentPage, goToPage }) => {
    return(
        <div className="pagination">
            <ul className="page-numbers">
              {pageNumbers.map((pageNumber) => (
                <li key={pageNumber}>
                  <button onClick={() => goToPage(pageNumber)} className={pageNumber === currentPage ? 'active' : ''}>
                    {pageNumber}
                  </button>
                </li>
              ))}
            </ul>
        </div>
    )
}


export default Pagination;