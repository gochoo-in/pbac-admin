import { describe, expect, it } from '@jest/globals';
import axios from 'axios'; 

let userId;
let token;

describe('User, Destinations, and Cities API with Casbin Middleware', () => {

  it('should add a user and return a token', async () => {
    const url = 'http://127.0.0.1:3000/api/v1/users';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        name: 'Test User',
        department: 'IT',
        email: 'testuser@example.com',
      },
    };
  
    try {
      const response = await axios(url, options);
      const data = response.data;
      console.log('POST user data:', data);
  
      userId = data.data.newUser._id;
      token = data.data.token;
      expect(response.status).toBe(201);
      expect(data.message).toBe('User added successfully');
    } catch (error) {
      console.log('Error during user creation:', error.response ? error.response.data : error.message);
    }
  }, 50000);
  

  it('should assign access policy to allow adding destinations and getting cities', async () => {
    if (!token) {
      throw new Error('Token not defined, skipping test');
    }

    const url = 'http://127.0.0.1:3000/api/v1/policy';
 
    await axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      data: {
        ptype: 'p',
        v0: userId,
        v1: '/api/v1/destinations',
        v2: 'POST',
      },
      url,
    });

    await axios({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      data: {
        ptype: 'p',
        v0: userId,
        v1: '/api/v1/cities',
        v2: 'GET',
      },
      url,
    });

    console.log('Policies assigned successfully.');
  }, 50000);

  it('should allow adding a destination (POST)', async () => {
    if (!token) {
      throw new Error('Token not defined, skipping test');
    }

    const url = 'http://127.0.0.1:3000/api/v1/destinations';
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: 'Vietnam',
        description: 'Vietnam is a country located in Southeast Asia, known for its rich cultural heritage, stunning landscapes, and vibrant cities.',
        visaType: 'e-visa',
        country: 'Vietnam',
        continent: 'Asia',
        latitude: 14.0583,
        longitude: 108.2772,
        currency: 'VND',
        timezone: 'UTC+07:00',
        tripDuration: ['3-5 days', '4-8 days', '7-10 days', 'more than 12 days'],
      },
    };

    const response = await axios(url, options);
    const data = response.data;
    console.log('POST destination data:', data);

    expect(response.status).toBe(201);
  }, 50000);

  it('should deny access to get destinations (GET)', async () => {
    if (!token) {
      throw new Error('Token not defined, skipping test');
    }

    const url = 'http://127.0.0.1:3000/api/v1/destinations';
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    try {
      const response = await axios(url, options);
    } catch (error) {
      expect(error.response.status).toBe(403);
      expect(error.response.data.message).toBe('Access denied');
    }
  }, 50000);

  it('should allow getting cities (GET)', async () => {
    if (!token) {
      throw new Error('Token not defined, skipping test');
    }

    const url = 'http://127.0.0.1:3000/api/v1/cities';
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };

    const response = await axios(url, options);
    const data = response.data;
    console.log('GET city data:', data);

    expect(response.status).toBe(200);
  }, 50000);

  it('should deny access to add cities (POST)', async () => {
    if (!token) {
      throw new Error('Token not defined, skipping test');
    }
  
    const url = 'http://127.0.0.1:3000/api/v1/cities';
    const options = {
      method: 'POST', 
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
      },
      data: {
        name: 'Ho Chi Minh City',
        iataCode: 'SGN',
        destinationName: 'Vietnam',
        country: 'Vietnam',
        latitude: 10.8231,
        longitude: 106.6297,
        languageSpoken: 'Vietnamese'
      },
    };
  
    try {
      const response = await axios(url, options);
    } catch (error) {
      expect(error.response.status).toBe(403);
      expect(error.response.data.message).toBe('Access denied');
    }
  }, 50000);
});
