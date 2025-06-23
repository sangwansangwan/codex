// Importing necessary modules from express and dotenv
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
// Importing the Supabase client instance from local setup
import { supabase } from './supabaseClient';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies
const PORT = 3000; // Port number on which the server will run

/**
 * Route: POST /addUser
 * Purpose: Adds a new user to the 'users' table in Supabase.
 * Expected Body: { name: string, mail: string }
 */
app.post('/addUser', async (req: Request, res: Response) => {
  try {
    const { name, mail } = req.body; // Extract user input from request body

    // Insert the new user into the Supabase 'users' table
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, mail }])
      .select(); // Return the inserted row(s)

    // If there's an error, throw it to be caught below
    if (error) throw error;

    // Respond with success message and inserted data
    res.status(201).json({ message: '✅ User inserted successfully!', data });
  } catch (err) {
    // Catch and return error if insertion fails (e.g., RLS restriction)
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * Route: GET /getUsers
 * Purpose: Fetches up to one user from the 'users' table in Supabase.
 * Useful for connection or query testing.
 */
app.get('/getUsers', async (_req: Request, res: Response) => {
  try {
    // Fetch at most one user row from the 'users' table
    const { data, error } = await supabase.from('users').select('*').limit(1);

    // Handle any query error
    if (error) throw error;

    // Return the fetched user
    res.status(200).json({
      sampleUser: data,
    });
  } catch (err) {
    // Handle and return query failure
    res.status(500).json({
      message: '❌ Supabase query failed',
      error: (err as Error).message,
    });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
