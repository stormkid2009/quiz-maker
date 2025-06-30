# Quiz Maker

A modern, interactive quiz application built with Next.js, TypeScript, and Prisma. This application provides a comprehensive platform for creating and taking various types of quizzes, including multiple-choice questions, open-ended questions, reading comprehension, and situation-based scenarios.

## 🚀 Features

- **Multiple Question Types**: Support for various question formats

  - Multiple Choice Questions (MCQ)
  - Multi-Multiple Choice Questions (Multi-MCQ)
  - Open-Ended Questions
  - Reading Comprehension with related questions
  - Situation-based scenarios

- **Interactive Training Mode**: Practice with individual question types

  - Grammar questions
  - Composition writing
  - Reading passages
  - Situation analysis

- **Modern UI/UX**: Clean, responsive design built with Tailwind CSS
- **Type Safety**: Full TypeScript implementation with Zod schema validation
- **Database Integration**: MongoDB with Prisma ORM
- **API-First Architecture**: RESTful API endpoints for all question types
- **Real-time Answer Validation**: Immediate feedback and answer checking

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: MongoDB with Prisma ORM
- **Validation**: Zod schema validation
- **Development**: ESLint, PostCSS, Autoprefixer

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB database (local or cloud instance)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd quiz-maker
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add the following variables:

```env
# Database Configuration
DATABASE_URL="mongodb://localhost:27017/quiz-maker"
# or for MongoDB Atlas
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/quiz-maker"

# Application Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 4. Database Setup

Generate and run Prisma migrations:

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (for development)
npx prisma db push

# Or run migrations (for production)
npx prisma migrate dev
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
quiz-maker/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/v1/            # API endpoints
│   │   │   ├── composition/   # Composition questions API
│   │   │   ├── grammaire/     # Grammar questions API
│   │   │   ├── passage/       # Reading passages API
│   │   │   ├── quiz/          # Quiz management API
│   │   │   └── situation/     # Situation questions API
│   │   ├── training/          # Training pages
│   │   └── quiz/              # Quiz pages
│   ├── components/            # React components
│   │   ├── buttons/           # Button components
│   │   ├── inputs/            # Input components
│   │   ├── quiz/              # Quiz-specific components
│   │   ├── server-questions/  # Server-side question components
│   │   └── wrappers/          # Component wrappers
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Library configurations
│   ├── prisma/                # Database schema
│   ├── shared/                # Shared schemas and types
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
├── prisma/
│   └── schema.prisma          # Database schema
└── package.json
```

## 🗄️ Database Schema

The application uses MongoDB with the following main models:

- **Grammaire**: Grammar questions with multiple choice options
- **Composition**: Writing composition questions with elements and answers
- **Passage**: Reading passages with embedded related questions
- **Situation**: Situation-based multiple choice questions
- **User**: User accounts (for future authentication features)

## 🔌 API Endpoints

### Question Endpoints

All endpoints return JSON responses and support GET requests.

#### Grammar Questions

```http
GET /api/v1/grammaire
```

Returns a random grammar question with options and correct answer.

#### Composition Questions

```http
GET /api/v1/composition
```

Returns a random composition question with writing elements and answer.

#### Reading Passages

```http
GET /api/v1/passage
```

Returns a random reading passage with related questions.

#### Situation Questions

```http
GET /api/v1/situation
```

Returns a random situation-based question with multiple choice options.

#### Quiz Management

```http
GET /api/v1/quiz
```

Returns a complete quiz with multiple question types.

### Response Format

```json
{
  "id": "question_id",
  "content": "Question content",
  "type": "MCQ",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "rightAnswer": ["correct_answer"],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## 🎯 Usage

### Training Mode

1. Navigate to `/training` to access individual question type practice
2. Choose from Grammar, Composition, Reading, or Situation questions
3. Practice with immediate feedback and answer checking

### Quiz Mode

1. Navigate to `/quiz` to take a comprehensive quiz
2. Answer questions across all types
3. Get scored results and performance feedback

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
npx prisma studio    # Open Prisma Studio
```

### Code Style

The project uses:

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Anwar Ahmed**

- Email: nileking2007@gmail.com
- GitHub: [@your-github-username]

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Tailwind CSS for the utility-first CSS framework
- The React community for continuous improvements

---

**Note**: This is a work in progress. Features and documentation will be updated as the project evolves.
