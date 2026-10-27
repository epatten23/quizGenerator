# Overview

For this project I wanted to learn TypeScript. I created an application that is a quiz generator and runs in the terminal. The user can create a quiz, add multiple choice and true/false questions to it, edit or delete questions after the fact, and then take any quiz they have made. After each attempt the program shows a score and a review listing every question with the answer the user gave and the correct one, and then sees if the user wants to retry.

I wanted to learn TypeScript, but I also wanted a program I would use. I am taking several classes that involve memorization, and I wanted a study tool I could write my own questions into.

[Software Demo Video](https://youtu.be/Y6WIY7doXrY)

# Development Environment

I developed this software in Visual Studio Code and used Git for version control, publishing the project to GitHub. I used npm to manage the project's dependencies and ran the program with Node.js.

The program is written in TypeScript and runs on Node.js. It uses Node's built-in readline/promises module to read user input from the terminal. The only package the project installs is @types/node, which provides the type definitions for Node's built-in modules. The TypeScript compiler is configured with strict mode turned on.

# Useful Websites

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TypeScript Handbook - Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [Node.js Documentation - Readline](https://nodejs.org/api/readline.html)
- [How To Set Up a New TypeScript Project](https://www.digitalocean.com/community/tutorials/typescript-new-project)

# Future Work

If I were to spend more time on this project, I would improve it by:

- Retrying only the questions the user missed instead of the whole quiz
- Saving quizzes to a file so they are not lost when the program closes
- Adding an admin password so only an admin can see and edit the answers, while anyone can take a quiz
- Making the Question base class abstract so a question with no type cannot be created by mistake
- Adding more question types, such as short answer and matching
- Shuffling the question and answer order so a quiz is not memorized by position
- Splitting the program into multiple files instead of keeping every class in one file

# AI Disclosure

I used Claude (Anthropic) as a learning and reference tool during this project. The help I received fell into three areas: defning and planning the project, resolving development environment problems, and reviewing the finished code.

Before starting, I had AI help me build a markdown file with the steps I would need to take to complete the project. I was then able to follow those steps and know exactly what I needed to search to find the information for each one. 

Most of the direct assistance was with the development environment, which was new to me since TypeScript needs a build setup and my last project did not. I was given the command to install the Node type definitions, and given complete config json files to add to my project. I did not change these, because they are configuration rather than program logic, but I made sure I understood what each setting does before accepting it.

AI helped me determine the classes I would need and some of the details for implementing those classes. It gave me helpful resources to learn more, especially about node:readline/promises. 

After my program was working, I asked for a code review, and AI helped me tighten up some of my code and find where I was missing essential comments, or where my comments didn't quite make sense. 

I learned a lot about the set up for a typescript program. I wasn't familiar with that before I started this project and AI really helped me understand how to set it up and the importance of having it set up the right way. 