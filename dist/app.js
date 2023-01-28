"use strict";

// src/routes/hello.ts
var hello = () => {
  console.log("Hello Routes");
};
var hello_default = hello;

// src/app.ts
console.log("Hello world!");
hello_default();
