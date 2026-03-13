import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBOynwy9xaGucB6Dv6rir2b_rkT5bNH5rA",
  authDomain: "fir-project-f516f.firebaseapp.com",
  databaseURL: "https://fir-project-f516f-default-rtdb.firebaseio.com",
  projectId: "fir-project-f516f",
  messagingSenderId: "918945614872",
  appId: "1:918945614872:web:617189d8884f0eac6e076d"
};

const app = initializeApp(firebaseConfig);

// IMPORTANT
export const database = getDatabase(app);