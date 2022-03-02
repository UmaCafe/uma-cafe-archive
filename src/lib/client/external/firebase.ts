import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, inMemoryPersistence } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyB8amSNI9864dIGdVe6bU3Y8I-Ath4E2oY',
	authDomain: 'uma-cafe.firebaseapp.com',
	projectId: 'uma-cafe',
	storageBucket: 'uma-cafe.appspot.com',
	messagingSenderId: '993127844782',
	appId: '1:993127844782:web:357344bf5021f57269d63f'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
setPersistence(auth, inMemoryPersistence);

export const FIREBASE_APP = app;
