import PocketBase from 'pocketbase';

// const pb = new PocketBase(process.env.PB_API); // Replace with your PocketBase URL
const pb = new PocketBase('http://localhost:8090'); // Replace with your PocketBase URL

export default pb;
