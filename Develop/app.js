const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const employees = [];

//questions to ask user for input on employee
//see ../Assets/cited.txt
const questions = [
  {
    type: "input",
    message: "What is the employee's name?",
    name: "name",
    validate: (answers) => {
      //see ../Assets/cited.txt
      if (!/^[a-zA-Z]+$/.test(answers)) {
        console.log("Please input alphabet characters only");
        return false;
      } else {
        return true;
      }
    },
  },
  {
    type: "input",
    message: "What is the employee's ID number?",
    name: "id",
  },
  {
    type: "input",
    message: "What is the employee's email?",
    name: "email",
    validate: (answers) => {
      if (answers.includes("@")) {
        return true;
      } else {
        console.log("Please enter a valid email");
      }
    },
  },
  {
    type: "list",
    message: "What is the employee's role?",
    choices: ["Manager", "Engineer", "Intern"],
    name: "role",
  },
  {
    type: "input",
    message: "What is the manager's office number?",
    name: "officeNumber",
    when: (answers) => answers.role === "Manager",
  },
  {
    type: "input",
    message: "What is the engineer's github username?",
    name: "github",
    when: (answers) => answers.role === "Engineer",
  },
  {
    type: "input",
    message: "What school does the intern attend?",
    name: "school",
    when: (answers) => answers.role === "Intern",
  },
  {
    type: "confirm",
    message: "Do you have another employee?",
    name: "again",
    default: true,
  },
];

//see ../Assets/cited.txt
function init() {
  const trackEmployee = () => {
    //prompt the questions about the employees
    inquirer.prompt(questions).then((reply) => {
      //capitalize first letter of name
      const capitalize = (name) => {
        return name.charAt(0).toUpperCase() + name.toLowerCase().slice(1);
      };

      //create new employee using blueprint and save to employees array
      if (reply.role === "Manager") {
        //create manager
        const newEmp = new Manager(
          capitalize(reply.name),
          reply.id,
          reply.email,
          reply.officeNumber
        );
        employees.push(newEmp);
      } else if (reply.role === "Engineer") {
        //create engineer
        const newEmp = new Engineer(
          capitalize(reply.name),
          reply.id,
          reply.email,
          reply.github
        );
        employees.push(newEmp);
      } else if (reply.role === "Intern") {
        //create intern
        const newEmp = new Intern(
          capitalize(reply.name),
          reply.id,
          reply.email,
          reply.school
        );
        employees.push(newEmp);
      } else {
        console.log("Error, employee not added successfully");
      }

      //if they have more employees, re-prompt questions
      if (reply.again) {
        trackEmployee();

        //if all employees entered, return and end
      } else {
        //create HTML templates
        const renderedHTML = render(employees);

        //create HTML file
        fs.writeFile(outputPath, renderedHTML, {}, (err) =>
          err ? console.log(err) : console.log("HTML file created")
        );
      }
    });
  };
  trackEmployee();
}

init();
