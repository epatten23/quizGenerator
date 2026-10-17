# Quiz Generator – Program Plan

A simple terminal program where you can create quizzes, edit them, and take them.

**Language:** TypeScript, run with `node src/index.ts`
**Rule for whoever writes this:** Keep it very simple. Use plain classes, plain functions, and short files. No fancy TypeScript features. If something here is unclear, ask Ella before guessing.

## Decisions Already Made

- The program runs in the terminal with numbered menus. Anyone using it types a number and presses Enter.
- There is **no password and no admin/user roles**. Anyone can create, edit, and take quizzes.
- Quizzes are **not saved**. They only exist while the program is running.
- Two question types: **multiple choice** and **true/false**.
- The code must be **object oriented** (see the classes below).

## Main Menu

When the program starts, show:

```
=== Quiz Generator ===
1. Create a new quiz
2. Edit a quiz
3. Take a quiz
4. Quit
```

After each action, return to this menu. Quit ends the program.

## What Each Menu Option Does

### 1. Create a new quiz
1. Ask for a quiz title.
2. Let the user add questions one at a time (see "Adding a question").
3. Stop when the user chooses "Done adding questions".
4. Add the quiz to the list of quizzes and return to the main menu.

### 2. Edit a quiz
1. Show a numbered list of quizzes. If there are none, say so and go back.
2. The user picks one. Then show:
   ```
   1. Add a question
   2. Change a question
   3. Delete a question
   4. Change the title
   5. Back
   ```
3. "Change a question" shows the numbered questions, the user picks one, then re-enters it.

### 3. Take a quiz
1. Show a numbered list of quizzes. If there are none, say so and go back.
2. The user picks one.
3. Ask each question in order. The user types the number of their answer.
4. After each answer, say "Correct!" or "Wrong. The answer was ...".
5. The user can **not** go back to a question they already answered.
6. At the end, show the score, like `You got 3 out of 4 (75%)`.
7. Then show a review of **every** question, with the answer the user chose and the correct answer:
   ```
   Question 1: What does TypeScript compile to?
     Your answer: Java
     Correct answer: JavaScript
   ```
8. Ask "Retry this quiz? 1. Yes  2. No". Yes starts the quiz over from question 1. No returns to the main menu.

### Adding a question
- **Multiple choice:** ask for the question text, then each option, then which option number is correct.
- **True/false:** ask for the statement, then whether it is true or false.

## Classes (Object Oriented Design)

All classes live together in one file, `src/index.ts`.

| Class | What it holds | What it can do |
|---|---|---|
| `Question` | The question text | `ask()` shows the question, `isCorrect(answer)` checks an answer |
| `MultipleChoiceQuestion` | Extends `Question`. Adds the list of options and the correct option number | Shows the options when asked |
| `TrueFalseQuestion` | Extends `Question`. Adds whether the answer is true or false | Shows True/False as the two options |
| `Quiz` | A title and a list of questions | Add, change, and delete questions; `take()` runs the quiz, remembers the user's answers, and shows the score and review |
| `QuizManager` | The list of all quizzes | Create, find, and list quizzes |
| `Menu` | Nothing | Prints menus and reads what the user types |

## Input Rules

- Reading what the user types uses Node's built-in `readline` module.
- If the user types something that is not a valid number, say "Please enter a number from 1 to X" and ask again.
- A blank quiz title or blank question text is not allowed. Ask again.
- A quiz with no questions cannot be taken. Say so and go back.

## File Layout

```
src/
  index.ts     every class, then the code that shows the main menu
```

Inside `index.ts`, put the classes in this order (a class must be written before it is used):
`Question`, `MultipleChoiceQuestion`, `TrueFalseQuestion`, `Menu`, `Quiz`, `QuizManager`, then the main menu code at the bottom.

## Not Included

- Questions are **not** shuffled. They always appear in the order they were added.
- There is **no** time limit.

## Open Questions (ask Ella before deciding)

- None right now. If something is unclear while building, ask Ella.

## Done When

- A quiz can be created, edited (add, change, delete questions), and taken from the menus.
- Both question types work.
- Bad input never crashes the program.
- Every piece of logic lives inside a class.
