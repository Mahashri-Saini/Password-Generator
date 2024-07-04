//fetching elements from html

const inputSlider = document.querySelector("[data-lengthSlider]"); //accessing custom attribute
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generator");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "=-+_)(*&^%$#@!<>?/.,|";

let password = "999";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");
//set strength color as white in circle

function handleSlider() {
  //to update length of password on UI
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  //

  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize =
    ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRandomInt(0, 9);
}

function generateLowerCase() {
  return String.fromCharCode(getRandomInt(97, 123));
}

function generateUpperCase() {
  return String.fromCharCode(getRandomInt(65, 91));
}

function generateSymbol() {
  const randNum = getRandomInt(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;

  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower & (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    //promise
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch {
    copyMsg.innerText = "failed";
  }
  //to make copyMsg invisible after specific time
  copyMsg.classList.add("active");

  setTimeout(() => {
    //we want copied message to disappear after 2s
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  // Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i]; //swap i and j
    array[i] = array[j];
    array[j] = temp;
  }

  let str = "";
  array.forEach((el) => (str += el));

  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  //special case
  if (passwordLength < checkCount) {
    console.log(passwordLength);
    passwordLength = checkCount;
    console.log(passwordLength);
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  //adding event listener to all checkboxes
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});



generateBtn.addEventListener("click", () => {
  //none of checkbox are selected
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  //to new passswors

  //remove old password
  password = "";

  //consider all checkboxes

  //   if (uppercaseCheck.checked) {
  //     password += generateUpperCase();
  //   }

  //   if (lowecaseCheck.checked) {
  //     password += generateLowerCase();
  //   }
  //   if (numbersCheck.checked) {
  //     password += generateRandomNumber();
  //   }

  //   if (symbolsCheck.checked) {
  //     password += generateSymbol();
  //   }

  let funcArr = []; //array of functions
  if (uppercaseCheck.checked) {
    funcArr.push(generateUpperCase);
  }

  if (lowercaseCheck.checked) {
    funcArr.push(generateLowerCase);
  }
  if (numbersCheck.checked) {
    funcArr.push(generateRandomNumber);
  }

  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }

  //compulsary addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  //remaining
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRandomInt(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  console.log(password);
  //shuffling password
  password = shufflePassword(Array.from(password));

  console.log(password);
  //show in UI
  passwordDisplay.value = password;

  //calculate strength
  calcStrength();
});
