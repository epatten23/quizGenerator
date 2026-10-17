// index.ts
// Run with: node src/index.ts

// Node's built-in tool for reading what the user types. Nothing to install.
// The "promises" version lets us use "await" (explained in the Menu class).
import * as readline from "node:readline/promises";

// CLASS Question
// The parent class for every question.
// MultipleChoiceQuestion and TrueFalseQuestion will extend it later,
class Question {
  // A property is a piece of data that belongs to the object.
  // ": string" is the TypeScript part. It says this property must always be text.
  text: string;

  // The constructor runs, receives the text and stores it.
  constructor(text: string) {
    this.text = text;
  }

  // Prints the question to the screen.
  ask(): void {
    console.log(this.text);
  }

  // Checks if an answer is right. Right now, a question has no answer, so it is always false.
  // But the child classes will replace  this with real checking.
  isCorrect(answer: number): boolean {
    return false;
  }

  // How many options the user can pick from. Needed so we know what numbers are allowed.
  // The child classes replace this too.
  getOptionCount(): number {
    return 0;
  }

  // The text of the option with this number (starting at 1). Used for the final review.
  getOptionText(number: number): string {
    return "";
  }

  // The text of the correct option. Also used for the final review.
  getCorrectText(): string {
    return "";
  }
}

// CLASS MultipleChoiceQuestion
// The multiple choice child class. It has a list of options and one correct answer.
// A question with a list of options where exactly one is correct.
class MultipleChoiceQuestion extends Question {
  // list of text values that students will have to choose from.
  options: string[];

  // The number of the correct option, starting at 1
  correctNumber: number;
  
  // "runs the parent class, storing all the text
  constructor(text: string, options: string[], correctNumber: number) {
    super(text);
    this.options = options;
    this.correctNumber = correctNumber;
  }
  
  // Same ask() as the parent, but now lists the options as well
  ask(): void {
    // this is the parents version, and prints the questions text.
    super.ask();
    // This loop goes through the list and prints the options, starting at 1
    for (let i = 0; i < this.options.length; i++) {
      console.log(`  ${i + 1}. ${this.options[i]}`);
    }
  }

  // Replaces isCorrect() from parent
  isCorrect(answer: number): boolean {
    return answer === this.correctNumber;
  }

  getOptionCount(): number {
    return this.options.length;
  }

  // Option 1 is at spot 0 in the list, so we subtract 1.
  getOptionText(number: number): string {
    return this.options[number - 1];
  }

  getCorrectText(): string {
    return this.options[this.correctNumber - 1];
  }
}

// CLASS TrueFalseQuestion
// The True or False child class. It has a boolean value for the correct answer.
// Runs almost the exact same as Multiple Choice, just different options for correct answers
class TrueFalseQuestion extends Question {
  // this is the correct answer, true or false.
  statementIsTrue: boolean;


  constructor(text: string, statementIsTrue: boolean) {
    super(text); 
    this.statementIsTrue = statementIsTrue;
  }

  ask(): void {
    super.ask();
    console.log("  1. True");
    console.log("  2. False");
  }

  isCorrect(answer: number): boolean {
    const pickedTrue = answer === 1;
    return pickedTrue === this.statementIsTrue;
  }

  // True/False always has exactly 2 options
  getOptionCount(): number {
    return 2;
  }

  // Option 1 is "True", anything else is "False"
  getOptionText(number: number): string {
    return number === 1 ? "True" : "False";
  }

  // "? :" is a short if/else: if statementIsTrue then "True", otherwise "False"
  getCorrectText(): string {
    return this.statementIsTrue ? "True" : "False";
  }
}

// CLASS Menu
// Handels asking for user input and ensuring the data input is valid
// Prints the menu and options to the screen.
class Menu {
  // This is node's tool for reading lines the user types.
  reader: readline.Interface;
  constructor() {
    this.reader = readline.createInterface({
      input: process.stdin, 
      output: process.stdout, 
    });
  }

  // Asks for text and waits for the user to type, so it does not give the answer right away. 
  async askText(prompt: string): Promise<string> {
    while (true) {
      const answer = await this.reader.question(prompt + " ");
      const cleaned = answer.trim();
      if (cleaned !== "") {
        return cleaned;
      }
      console.log("Please type something.");
    }
  }

  // Asks for a number for their answer until the user gives a valid one.
  async askNumber(prompt: string, min: number, max: number): Promise<number> {
    while (true) {
      const answer = await this.reader.question(prompt + " ");
      // Turns text into a number and makes sure it's a valid int 
      const number = Number(answer.trim());
      if (answer.trim() !== "" && Number.isInteger(number) && number >= min && number <= max) {
        return number;
      }
      console.log(`Please enter a number from ${min} to ${max}.`);
    }
  }

  // Prints a title and a numbered list of choices, then asks the user for thier input.
  async showMenu(title: string, choices: string[]): Promise<number> {
    console.log("");
    console.log(`=== ${title} ===`);
    for (let i = 0; i < choices.length; i++) {
      console.log(`${i + 1}. ${choices[i]}`);
    }
    return await this.askNumber("Choose:", 1, choices.length);
  }

  // Stops listening to input for when it's finished
  close(): void {
    this.reader.close();
  }

  // Asks the user to type in a brand new question and gives it back.
  // kind is 1 for multiple choice, 2 for true/false.
  // The return type is Question, which works for both kinds because
  // MultipleChoiceQuestion and TrueFalseQuestion are both kinds of Question.
  // This lives in Menu because it is all about talking to the user.
  async askForQuestion(kind: number): Promise<Question> {
    const text = await this.askText("Question text:");

    if (kind === 1) {
      // Multiple choice: ask how many options, then the text of each one.
      const count = await this.askNumber("How many options (2 to 6)?", 2, 6);
      const options: string[] = [];
      for (let i = 1; i <= count; i++) {
        options.push(await this.askText(`Option ${i}:`));
      }
      const correct = await this.askNumber("Which option number is correct?", 1, count);
      return new MultipleChoiceQuestion(text, options, correct);
    }

    // True/false: just ask if the statement is true or false.
    const choice = await this.showMenu("Is the statement true or false?", ["True", "False"]);
    return new TrueFalseQuestion(text, choice === 1);
  }
}

// ---------------------------------------------------------------
// CLASS Quiz
// Keeps track of the title and list of questions
// ---------------------------------------------------------------
class Quiz {
  title: string;

  // The list of questions
  questions: Question[];

  constructor(title: string) {
    this.title = title;
    this.questions = []; 
  }

  // Adds a question to the list.
  addQuestion(question: Question): void {
    this.questions.push(question); 
  }

  // Replaces a question
  replaceQuestion(number: number, newQuestion: Question): void {
    this.questions[number - 1] = newQuestion;
  }

  // Removes a question
  deleteQuestion(number: number): void {
    this.questions.splice(number - 1, 1);
  }

  // Prints every question's text with its number
  listQuestions(): void {
    if (this.questions.length === 0) {
      console.log("(This quiz has no questions yet.)");
      return;
    }
    for (let i = 0; i < this.questions.length; i++) {
      console.log(`${i + 1}. ${this.questions[i].text}`);
    }
  }

  // Runs the whole quiz: ask every question and show the score and answers
  async take(menu: Menu): Promise<void> {
    if (this.questions.length === 0) {
      console.log("This quiz has no questions yet, so it can't be taken.");
      return;
    }

    // Keep going until the user says they don't want to retry.
    let retry = true;
    while (retry) {
      const answers = await this.askAllQuestions(menu);
      this.showResults(answers);
      const choice = await menu.showMenu("Retry this quiz?", ["Yes", "No"]);
      retry = choice === 1; // true only if they picked Yes
    }
  }

  // Asks each question and returns the list of answers. The loop only moves forward
  async askAllQuestions(menu: Menu): Promise<number[]> {
    const answers: number[] = [];
    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions[i];
      console.log("");
      console.log(`Question ${i + 1} of ${this.questions.length}`);
      question.ask();

      const answer = await menu.askNumber("Your answer:", 1, question.getOptionCount());
      answers.push(answer);

      if (question.isCorrect(answer)) {
        console.log("Correct!");
      } else {
        console.log(`Wrong. The answer was ${question.getCorrectText()}.`);
      }
    }
    return answers;
  }

  // Shows the score, then every question with the user's answer and the right one.
  showResults(answers: number[]): void {
    // Count how many answers were correct.
    let score = 0;
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i].isCorrect(answers[i])) {
        score++; // ++ adds 1
      }
    }
    const total = this.questions.length;
    const percent = Math.round((score / total) * 100);
    console.log("");
    console.log(`You got ${score} out of ${total} (${percent}%)`);

    console.log("");
    console.log("--- Review ---");
    for (let i = 0; i < this.questions.length; i++) {
      const question = this.questions[i];
      console.log(`Question ${i + 1}: ${question.text}`);
      console.log(`  Your answer: ${question.getOptionText(answers[i])}`);
      console.log(`  Correct answer: ${question.getCorrectText()}`);
    }
  }
}

// CLASS QuizManager
// Keeps the list of every quiz in the program -- restarts with the program
class QuizManager {
  // A list where every item is a Quiz.
  quizzes: Quiz[];

  constructor() {
    this.quizzes = []; 
  }

  // Makes a new quiz with this title, adds it to the list, and returns it to the user
  createQuiz(title: string): Quiz {
    const quiz = new Quiz(title);
    this.quizzes.push(quiz);
    return quiz;
  }

  // Finds a quiz by the number the user sees 
  getQuiz(number: number): Quiz {
    return this.quizzes[number - 1];
  }

  // Prints every quiz's title with its number, and how many questions it has.
  listQuizzes(): boolean {
    if (this.quizzes.length === 0) {
      console.log("There are no quizzes yet. Create one first!");
      return false;
    }
    for (let i = 0; i < this.quizzes.length; i++) {
      const quiz = this.quizzes[i];
      console.log(`${i + 1}. ${quiz.title} (${quiz.questions.length} questions)`);
    }
    return true;
  }
}

// PROGRAM
// Where the actual program starts.
const menu = new Menu();
const manager = new QuizManager();

let running = true;
while (running) {
  const choice = await menu.showMenu("Quiz Generator", [
    "Create a new quiz",
    "Edit a quiz",
    "Take a quiz",
    "Quit",
  ]);


  if (choice === 1) {
    // ----- Create a new quiz -----
    const title = await menu.askText("Quiz title:");
    const quiz = manager.createQuiz(title);

    // Keep adding questions until the user says they're done.
    let adding = true;
    while (adding) {
      const kind = await menu.showMenu(`Add a question to "${quiz.title}"`, [
        "Multiple choice",
        "True / False",
        "Done adding questions",
      ]);

      if (kind === 3) {
        adding = false; // makes it so the user can't add any more questions.
      } else {
        const question = await menu.askForQuestion(kind);
        quiz.addQuestion(question);
        console.log("Question added!");
      }
    }
    console.log(`Quiz "${quiz.title}" saved with ${quiz.questions.length} question(s).`);
  } else if (choice === 2) {
    // ----- Edit a quiz -----
    console.log("");
    console.log("Which quiz do you want to edit?");
    const hasQuizzes = manager.listQuizzes();
    if (hasQuizzes) {
      const number = await menu.askNumber("Quiz number:", 1, manager.quizzes.length);
      const quiz = manager.getQuiz(number);

      // Keep showing the edit menu until the user chooses Back.
      let editing = true;
      while (editing) {
        const action = await menu.showMenu(`Editing "${quiz.title}"`, [
          "Add a question",
          "Change a question",
          "Delete a question",
          "Change the title",
          "Back",
        ]);

        if (action === 1) {
          // Add: Same as when creating, makes a new question
          const kind = await menu.showMenu("What kind of question?", [
            "Multiple choice",
            "True / False",
          ]);
          quiz.addQuestion(await menu.askForQuestion(kind));
          console.log("Question added!");
        } else if (action === 2 || action === 3) {
          // Show the questions and pick one.
          if (quiz.questions.length === 0) {
            console.log("This quiz has no questions yet.");
          } else {
            console.log("");
            quiz.listQuestions();
            const questionNumber = await menu.askNumber("Question number:", 1, quiz.questions.length);

            if (action === 2) {
              // Change-- asks for a new question to replace the old one
              const kind = await menu.showMenu("What kind of question is the new version?", [
                "Multiple choice",
                "True / False",
              ]);
              quiz.replaceQuestion(questionNumber, await menu.askForQuestion(kind));
              console.log("Question changed!");
            } else {
              quiz.deleteQuestion(questionNumber);
              console.log("Question deleted!");
            }
          }
        } else if (action === 4) {
          // Overwrite the title
          quiz.title = await menu.askText("New title:");
          console.log(`Title changed to "${quiz.title}".`);
        } else {
          editing = false; // Back
        }
      }
    }
  } else if (choice === 3) {
    // ----- Take a quiz -----
    console.log("");
    console.log("Which quiz do you want to take?");
    // Prints the quizzes available
    const hasQuizzes = manager.listQuizzes();
    if (hasQuizzes) {
      const number = await menu.askNumber("Quiz number:", 1, manager.quizzes.length);
      const quiz = manager.getQuiz(number);
      // Asks the questions, shows the score and review, and offers a retry.
      await quiz.take(menu);
    }
  } else {
    running = false; // Quit
  }
}

console.log("Goodbye!");
menu.close();
