# PromptMD - Healthcare Professionals Prompt Sharing Platform

A platform for healthcare professionals to share, discover, and collaborate on AI prompts for medical applications.

## Features

- User authentication with email/password and Google
- Create, save, and rate prompts
- Browse prompts by category and specialty
- User profiles with prompt management
- Real-time updates

## Tech Stack

- React + TypeScript
- Supabase (Authentication, Database, Storage)
- Tailwind CSS
- Vite

## Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd promptmd
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel's project settings
4. Deploy!

## Environment Variables

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 