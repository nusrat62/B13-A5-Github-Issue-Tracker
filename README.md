1. What is the difference between var, let, and const?

var is function-scoped and can be re-declared.
let is block-scoped and cannot be re-declared, but its value can change.
const is also block-scoped and cannot be re-declared or reassigned.

2.  What is the spread operator (...)?

The spread operator ... is used to expand or copy elements of an array or properties of an object.

Example:

const arr1 = [1,2,3];
const arr2 = [...arr1,4,5];


3. What is the difference between map(), filter(), and forEach()?

map() returns a new array after transforming elements.
filter() returns a new array with elements that pass a condition.
forEach() only loops through elements without returning a new array.

4. What is an arrow function?

An arrow function (=>) is a shorter syntax for writing functions in JavaScript.

Example:

const greet = () => {
  console.log("Hello");
};
5. What are template literals?

Template literals use backticks () and allow embedding variables or expressions inside strings using ${}`.

Example:

const name = "Nusrat";
console.log(`Hello ${name}`);
