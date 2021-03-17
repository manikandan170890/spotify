import React, { Component } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';
import * as config from '../../../config';
import axios from 'axios';

export default class Discover extends Component {
  constructor() {
    super();

    this.state = {
      newReleases: [],
      playlists: [],
      categories: [],
      token:'',
    };
  }
  componentDidMount () {
    const {api } = config.default;
    axios(api.authUrl, {
      headers: {
        'Content-Type' : 'application/x-www-form-urlencoded',
        'Authorization' : 'Basic ' + btoa(api.clientId + ':' + api.clientSecret)      
      },
      data: 'grant_type=client_credentials',
      method: 'POST'
    })
    .then(tokenResponse => {      
      this.setState({token:tokenResponse.data.access_token});

      axios(`${api.baseUrl}/browse/categories?locale=sv_US`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (genreResponse => { 
      this.setState({categories:genreResponse.data.categories.items});
      console.log('genreResponse',genreResponse);
      });

      axios(`${api.baseUrl}/browse/new-releases?locale=sv_US`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (genreResponse => {        
        console.log('genreResponse-newReleases',genreResponse);
      this.setState({newReleases:genreResponse.data.albums.items});
      
      });

      axios(`${api.baseUrl}/browse/featured-playlists?locale=sv_US`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + tokenResponse.data.access_token}
      })
      .then (genreResponse => {        
        console.log('genreResponse-newReleases',genreResponse);
      this.setState({playlists:genreResponse.data.playlists.items});
      
      });
      
    });
}
  render() {
    
    const { newReleases, playlists, categories } = this.state;

    return (
      <div className="discover">
        
        <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases} />
        <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists} />
        <DiscoverBlock text="BROWSE" id="browse" data={categories} imagesKey="icons" />
      </div>
    );
  }
}
