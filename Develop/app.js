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

      //if they have more employees, re-ask questions
      if (reply.again) {
        trackEmployee();

        //if all employees entered, return and end
      } else {
        console.log(employees);
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

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
