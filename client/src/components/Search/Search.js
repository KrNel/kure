import React, { Component } from 'react'
import { Search } from 'semantic-ui-react'

const SearchComponent = () => {
  <Search
    onResultSelect={this.handleResultSelect}
    onSearchChange={this.handleSearchChange}
    results={searchResults}
    value={searchValue}
  />
}

export default SearchComponent;
